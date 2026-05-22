import { Router } from 'express';
import mongoose from 'mongoose';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import Review from '@/models/Review';
import { authenticateAdmin, authorizeModule } from '@/middleware/auth';
import { sendError, sendNotFound, sendServerError, sendSuccess } from '@/utils/response';
import { normalizePermissions, resolvePermissions, type AdminRole } from '@/utils/adminRbac';

const router = Router();

// Protect all admin routes with admin auth + RBAC
router.use(authenticateAdmin);

router.get('/orders', authorizeModule('orders', 'can_view'), async (req, res) => {
  try {
    const { status, search = '', page = '1', limit = '100' } = req.query;
    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.min(200, Math.max(1, Number(limit) || 100));
    const skip = (parsedPage - 1) * parsedLimit;

    const query: Record<string, unknown> = {};

    if (typeof status === 'string' && status.trim() && status !== 'all') {
      query.status = status.trim();
    }

    if (typeof search === 'string' && search.trim()) {
      query.$or = [
        { orderNumber: { $regex: search.trim(), $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search.trim(), $options: 'i' } },
        { 'items.name': { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Order.countDocuments(query),
    ]);

    return sendSuccess(res, {
      items,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.max(1, Math.ceil(total / parsedLimit)),
      },
    });
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch admin orders');
  }
});

router.get('/orders-overview', authorizeModule('dashboard', 'can_view'), async (_req, res) => {
  try {
    const now = new Date();
    const months: Array<{ key: string; month: string; year: number }> = [];

    for (let offset = 6; offset >= 0; offset -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      months.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        month: d.toLocaleString('en-US', { month: 'short' }),
        year: d.getFullYear(),
      });
    }

    const [firstYear, firstMonthNumber] = months[0].key.split('-').map(Number);
    const firstMonth = new Date(firstYear, (firstMonthNumber || 1) - 1, 1);

    const stats = await Order.aggregate([
      { $match: { createdAt: { $gte: firstMonth } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          orders: { $sum: 1 },
        },
      },
    ]);

    const statsMap = new Map(
      stats.map((row: any) => [
        `${row._id.year}-${String(row._id.month).padStart(2, '0')}`,
        Number(row.orders || 0),
      ]),
    );

    const items = months.map((m) => ({
      month: m.month,
      key: m.key,
      orders: statsMap.get(m.key) || 0,
    }));

    return sendSuccess(res, { items });
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch orders overview');
  }
});

router.put('/orders/:id', authorizeModule('orders', 'can_edit'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, expectedDeliveryDate } = req.body;

    const allowedStatuses = [
      'confirmed',
      'shipped',
      'out_for_delivery',
      'delivered',
      'cancelled',
    ];

    const shouldUpdateStatus = typeof status === 'string' && allowedStatuses.includes(status);
    const hasExpectedDeliveryDate = expectedDeliveryDate !== undefined && expectedDeliveryDate !== null && String(expectedDeliveryDate).trim() !== '';

    if (typeof status === 'string' && !allowedStatuses.includes(status)) {
      return sendError(res, 'Valid status is required');
    }

    if (!shouldUpdateStatus && !hasExpectedDeliveryDate) {
      return sendError(res, 'Provide a valid status or expected delivery date');
    }

    const order = await Order.findById(id);
    if (!order) {
      return sendNotFound(res, 'Order not found');
    }

    const previousStatus = order.status;

    if (shouldUpdateStatus) {
      order.status = status as typeof order.status;

      if (status === 'delivered') {
        order.deliveredAt = new Date();
      }
      if (status === 'cancelled') {
        order.cancelledAt = new Date();
        order.cancellationReason = 'Cancelled by admin';
      }
    }

    if (hasExpectedDeliveryDate) {
      const parsedExpectedDate = new Date(String(expectedDeliveryDate));
      if (Number.isNaN(parsedExpectedDate.getTime())) {
        return sendError(res, 'Expected delivery date is invalid');
      }
      order.expectedDeliveryDate = parsedExpectedDate;
    }

    await order.save();

    // If admin cancels from a non-cancelled state, restore stock once.
    if (shouldUpdateStatus && status === 'cancelled' && previousStatus !== 'cancelled') {
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } },
        );
      }
    }

    return sendSuccess(res, order, 'Order updated');
  } catch (_error) {
    return sendServerError(res, 'Failed to update order');
  }
});

router.get('/users', authorizeModule('customers', 'can_view'), async (req, res) => {
  try {
    const { search = '', page = '1', limit = '100' } = req.query;
    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.min(200, Math.max(1, Number(limit) || 100));
    const skip = (parsedPage - 1) * parsedLimit;

    const userQuery: Record<string, unknown> = { role: 'user' };
    if (typeof search === 'string' && search.trim()) {
      const q = search.trim();
      userQuery.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(userQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .select('-password')
        .lean(),
      User.countDocuments(userQuery),
    ]);

    const userIds = users.map((u) => new mongoose.Types.ObjectId(String(u._id)));

    const orderAgg = await Order.aggregate([
      { $match: { user: { $in: userIds } } },
      {
        $group: {
          _id: '$user',
          ordersCount: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' },
          lastOrderAt: { $max: '$createdAt' },
        },
      },
    ]);

    const orderSummaryMap = new Map(
      orderAgg.map((row: any) => [String(row._id), row]),
    );

    const items = users.map((u: any) => {
      const summary = orderSummaryMap.get(String(u._id));
      return {
        ...u,
        stats: {
          ordersCount: Number(summary?.ordersCount || 0),
          totalSpent: Number(summary?.totalSpent || 0),
          lastOrderAt: summary?.lastOrderAt || null,
        },
      };
    });

    return sendSuccess(res, {
      items,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.max(1, Math.ceil(total / parsedLimit)),
      },
    });
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch users');
  }
});

router.get('/users/:id', authorizeModule('customers', 'can_view'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    if (!user) {
      return sendNotFound(res, 'User not found');
    }
    return sendSuccess(res, user);
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch user details');
  }
});

router.put('/users/:id/profile', authorizeModule('customers', 'can_edit'), async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const updates: Record<string, unknown> = {};

    if (typeof name === 'string' && name.trim()) updates.name = name.trim();
    if (typeof phone === 'string') updates.phone = phone.trim();
    if (typeof email === 'string' && email.trim()) updates.email = email.toLowerCase().trim();

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return sendNotFound(res, 'User not found');
    }

    return sendSuccess(res, user, 'Profile updated');
  } catch (_error) {
    return sendServerError(res, 'Failed to update profile');
  }
});

router.put('/users/:id/status', authorizeModule('customers', 'can_edit'), async (req, res) => {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return sendError(res, 'isActive must be boolean');
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true },
    ).select('-password');

    if (!user) {
      return sendNotFound(res, 'User not found');
    }

    return sendSuccess(res, user, `User ${isActive ? 'enabled' : 'disabled'}`);
  } catch (_error) {
    return sendServerError(res, 'Failed to update user status');
  }
});

router.post('/users/:id/reset-password', authorizeModule('customers', 'can_edit'), async (req, res) => {
  try {
    const tempPassword = `SS@${Math.random().toString(36).slice(-8)}`;
    const user = await User.findById(req.params.id).select('+password');
    if (!user) {
      return sendNotFound(res, 'User not found');
    }

    user.password = tempPassword;
    await user.save();

    return sendSuccess(
      res,
      { temporaryPassword: tempPassword },
      'Temporary password generated',
    );
  } catch (_error) {
    return sendServerError(res, 'Failed to reset password');
  }
});

router.post('/users/:id/remarks', authorizeModule('customers', 'can_edit'), async (req, res) => {
  try {
    const text = String(req.body?.text || '').trim();
    if (!text) {
      return sendError(res, 'Remark text is required');
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          adminRemarks: {
            text,
            createdAt: new Date(),
          },
        },
      },
      { new: true },
    ).select('-password');

    if (!user) {
      return sendNotFound(res, 'User not found');
    }

    return sendSuccess(res, user, 'Remark added');
  } catch (_error) {
    return sendServerError(res, 'Failed to add remark');
  }
});

router.get('/users/:id/purchases', authorizeModule('customers', 'can_view'), async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return sendSuccess(res, orders);
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch purchases');
  }
});

router.get('/users/:id/report', authorizeModule('customers', 'can_view'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      return sendNotFound(res, 'User not found');
    }

    const orders = await Order.find({ user: req.params.id }).lean();
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
    const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
    const cancelledOrders = orders.filter((o) => o.status === 'cancelled').length;

    return sendSuccess(res, {
      userId: user._id,
      totalOrders,
      totalSpent,
      deliveredOrders,
      cancelledOrders,
      avgOrderValue: totalOrders ? totalSpent / totalOrders : 0,
      lastLoginAt: user.lastLoginAt || null,
      createdAt: user.createdAt,
    });
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch user report');
  }
});

//perfect

router.post('/users/:id/withdraw-credit', authorizeModule('payments', 'can_edit'), async (req, res) => {
  try {
    const { amount = 0 } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendNotFound(res, 'User not found');
    }

    return sendSuccess(
      res,
      { userId: user._id, amount: Number(amount || 0) },
      'Credit withdrawal action recorded',
    );
  } catch (_error) {
    return sendServerError(res, 'Failed to process withdraw credit');
  }
});

router.post('/users/:id/chat', authorizeModule('customers', 'can_view'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      return sendNotFound(res, 'User not found');
    }

    return sendSuccess(res, {
      userId: user._id,
      email: user.email,
      name: user.name,
      chatHint: `Start conversation with ${user.name}`,
    });
  } catch (_error) {
    return sendServerError(res, 'Failed to open chat');
  }
});

router.get('/reviews', authorizeModule('reviews', 'can_view'), async (req, res) => {
  try {
    const { search = '', rating, page = '1', limit = '100' } = req.query;
    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.min(200, Math.max(1, Number(limit) || 100));
    const skip = (parsedPage - 1) * parsedLimit;

    const query: Record<string, unknown> = {};
    if (typeof rating === 'string' && rating.trim()) {
      const parsedRating = Number(rating);
      if (parsedRating >= 1 && parsedRating <= 5) query.rating = parsedRating;
    }

    if (typeof search === 'string' && search.trim()) {
      const products = await Product.find(
        { name: { $regex: search.trim(), $options: 'i' } },
        { _id: 1 },
      ).lean();
      const users = await User.find(
        {
          $or: [
            { name: { $regex: search.trim(), $options: 'i' } },
            { email: { $regex: search.trim(), $options: 'i' } },
          ],
        },
        { _id: 1 },
      ).lean();

      query.$or = [
        { comment: { $regex: search.trim(), $options: 'i' } },
        { product: { $in: products.map((p) => p._id) } },
        { user: { $in: users.map((u) => u._id) } },
      ];
    }

    const [items, total, stats] = await Promise.all([
      Review.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .populate('user', 'name email')
        .populate('product', 'name category generation')
        .lean(),
      Review.countDocuments(query),
      Review.aggregate([
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
            fiveStarReviews: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          },
        },
      ]),
    ]);

    const summary = stats?.[0] || { avgRating: 0, totalReviews: 0, fiveStarReviews: 0 };

    return sendSuccess(res, {
      items,
      summary: {
        averageRating: Number(summary.avgRating || 0),
        totalReviews: Number(summary.totalReviews || 0),
        fiveStarReviews: Number(summary.fiveStarReviews || 0),
      },
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.max(1, Math.ceil(total / parsedLimit)),
      },
    });
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch reviews');
  }
});

router.get('/dashboard', authorizeModule('dashboard'), (_req, res) => {
  res.json({ message: 'Get dashboard stats endpoint - TODO' });
});

router.get('/team', authorizeModule('team'), async (_req, res) => {
  try {
    const admins = await User.find({ role: { $in: ['admin', 'super_admin', 'manager', 'staff'] } })
      .sort({ createdAt: -1 })
      .select('-password')
      .lean();

    const items = admins.map((user: any) => {
      const role = user.role as AdminRole;
      return {
        user_id: String(user._id),
        full_name: user.name,
        email: user.email,
        avatar_url: user.avatar || null,
        is_active: Boolean(user.isActive),
        last_login: user.lastLoginAt || null,
        role,
        created_at: user.createdAt,
        permissions: resolvePermissions(role, user.adminPermissions || []),
      };
    });

    return sendSuccess(res, { items });
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch team members');
  }
});

router.post('/team', authorizeModule('team', 'can_create'), async (req, res) => {
  try {
    if (!['super_admin', 'admin'].includes(String(req.user?.role || ''))) {
      return sendError(res, 'Only super admin can add team members', 403);
    }

    const { fullName, email, password, role, permissions } = req.body || {};
    const parsedRole = String(role || 'staff') as AdminRole;

    if (!fullName || !email || !password) {
      return sendError(res, 'Full name, email and password are required');
    }

    if (!['super_admin', 'admin', 'manager', 'staff'].includes(parsedRole)) {
      return sendError(res, 'Invalid role');
    }

    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) {
      return sendError(res, 'Email already exists', 409);
    }

    const user = await User.create({
      name: String(fullName).trim(),
      email: String(email).toLowerCase().trim(),
      password: String(password),
      role: parsedRole,
      isActive: true,
      isVerified: true,
      adminPermissions: normalizePermissions(parsedRole, permissions || []),
    });

    return sendSuccess(
      res,
      {
        user_id: String(user._id),
      },
      'Team member created',
      201,
    );
  } catch (_error) {
    return sendServerError(res, 'Failed to create team member');
  }
});

router.put('/team/:id', authorizeModule('team', 'can_edit'), async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, password, role, permissions, isActive } = req.body || {};
    const updates: Record<string, unknown> = {};

    if (typeof fullName === 'string' && fullName.trim()) updates.name = fullName.trim();
    if (typeof email === 'string' && email.trim()) updates.email = email.toLowerCase().trim();
    if (typeof role === 'string' && ['super_admin', 'admin', 'manager', 'staff'].includes(role)) {
      updates.role = role;
      updates.adminPermissions = normalizePermissions(role as AdminRole, permissions || []);
    } else if (Array.isArray(permissions)) {
      const current = await User.findById(id).select('role');
      const currentRole = (current?.role || 'staff') as AdminRole;
      updates.adminPermissions = normalizePermissions(currentRole, permissions);
    }
    if (typeof isActive === 'boolean') updates.isActive = isActive;

    const user = await User.findById(id).select('+password');
    if (!user) return sendNotFound(res, 'Team member not found');

    if (typeof password === 'string' && password.trim().length >= 6) {
      user.password = password.trim();
    }
    Object.assign(user, updates);
    await user.save();

    return sendSuccess(res, { user_id: String(user._id) }, 'Team member updated');
  } catch (_error) {
    return sendServerError(res, 'Failed to update team member');
  }
});

router.delete('/users/:id', authorizeModule('customers', 'can_delete'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return sendNotFound(res, 'User not found');
    }
    return sendSuccess(res, { id: user._id }, 'User deleted');
  } catch (_error) {
    return sendServerError(res, 'Failed to delete user');
  }
});

export default router;
