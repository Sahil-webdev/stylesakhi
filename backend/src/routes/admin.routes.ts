import { Router } from 'express';
import mongoose from 'mongoose';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import Review from '@/models/Review';
import AdminSettings from '@/models/AdminSettings';
import AdminActivityLog from '@/models/AdminActivityLog';
import { authenticateAdmin, authorizeModule } from '@/middleware/auth';
import { sendError, sendNotFound, sendServerError, sendSuccess } from '@/utils/response';
import { normalizePermissions, resolvePermissions, type AdminRole, type PermissionModule } from '@/utils/adminRbac';

const router = Router();

// Protect all admin routes with admin auth + RBAC
router.use(authenticateAdmin);

const DEFAULT_ADMIN_SETTINGS = {
  profile: {
    firstName: '',
    lastName: '',
    name: '',
    email: '',
  },
  notifications: {
    emailNotifs: true,
    pushNotifs: false,
  },
  security: {
    twoFactorEnabled: false,
  },
  store: {
    publicStore: true,
  },
};

const toInr = (value: number) => Number(Number(value || 0).toFixed(2));

const percentChange = (current: number, previous: number) => {
  if (previous <= 0 && current <= 0) return 0;
  if (previous <= 0) return 100;
  return ((current - previous) / previous) * 100;
};

const logAdminActivity = async (
  req: any,
  params: {
    action: string;
    module: PermissionModule | 'auth';
    targetType?: string;
    targetId?: string;
    metadata?: Record<string, unknown>;
  },
) => {
  const actor = req.user?._id || req.user?.userId;
  if (!actor) return;

  try {
    await AdminActivityLog.create({
      actor,
      action: params.action,
      module: params.module,
      targetType: params.targetType || '',
      targetId: params.targetId || '',
      metadata: params.metadata || {},
    });
  } catch {
    // Activity log should never block primary operation.
  }
};

router.get('/orders', authorizeModule('orders', 'can_view'), async (req, res) => {
  try {
    const { status, search = '', page = '1', limit = '20' } = req.query;
    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.min(100, Math.max(1, Number(limit) || 20));
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

    await logAdminActivity(req, {
      action: `Updated order ${order.orderNumber}`,
      module: 'orders',
      targetType: 'order',
      targetId: String(order._id),
      metadata: {
        status: order.status,
        expectedDeliveryDate: order.expectedDeliveryDate || null,
      },
    });

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
    const { search = '', page = '1', limit = '20' } = req.query;
    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.min(100, Math.max(1, Number(limit) || 20));
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

    await logAdminActivity(req, {
      action: `Updated customer profile: ${user.email}`,
      module: 'customers',
      targetType: 'user',
      targetId: String(user._id),
    });

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

    await logAdminActivity(req, {
      action: `${isActive ? 'Enabled' : 'Disabled'} customer: ${user.email}`,
      module: 'customers',
      targetType: 'user',
      targetId: String(user._id),
    });

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

    await logAdminActivity(req, {
      action: `Reset customer password: ${user.email}`,
      module: 'customers',
      targetType: 'user',
      targetId: String(user._id),
    });

    return sendSuccess(
      res,
      { resetAt: new Date().toISOString() },
      'Password reset successfully. Share a new password securely with the customer.',
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

    await logAdminActivity(req, {
      action: `Added remark for customer: ${user.email}`,
      module: 'customers',
      targetType: 'user',
      targetId: String(user._id),
    });

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

    await logAdminActivity(req, {
      action: `Recorded credit withdrawal for ${user.email}`,
      module: 'payments',
      targetType: 'user',
      targetId: String(user._id),
      metadata: { amount: Number(amount || 0) },
    });

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
    const { search = '', rating, page = '1', limit = '20' } = req.query;
    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.min(100, Math.max(1, Number(limit) || 20));
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

router.get('/dashboard', authorizeModule('dashboard', 'can_view'), async (_req, res) => {
  try {
    const now = new Date();
    const currentStart = new Date(now);
    currentStart.setDate(currentStart.getDate() - 30);
    const previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - 30);

    const [allUsersCount, uniqueBuyersCurrent, uniqueBuyersPrevious] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Order.distinct('user', {
        status: { $ne: 'cancelled' },
        createdAt: { $gte: currentStart, $lte: now },
      }),
      Order.distinct('user', {
        status: { $ne: 'cancelled' },
        createdAt: { $gte: previousStart, $lt: currentStart },
      }),
    ]);

    const [orderAndRevenue] = await Order.aggregate([
      {
        $facet: {
          current: [
            { $match: { createdAt: { $gte: currentStart, $lte: now } } },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: {
                  $sum: {
                    $cond: [{ $ne: ['$status', 'cancelled'] }, '$totalPrice', 0],
                  },
                },
              },
            },
          ],
          previous: [
            { $match: { createdAt: { $gte: previousStart, $lt: currentStart } } },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: {
                  $sum: {
                    $cond: [{ $ne: ['$status', 'cancelled'] }, '$totalPrice', 0],
                  },
                },
              },
            },
          ],
          currentDelivered: [
            {
              $match: {
                createdAt: { $gte: currentStart, $lte: now },
                status: 'delivered',
              },
            },
            { $count: 'count' },
          ],
          previousDelivered: [
            {
              $match: {
                createdAt: { $gte: previousStart, $lt: currentStart },
                status: 'delivered',
              },
            },
            { $count: 'count' },
          ],
        },
      },
    ]);

    const currentTotals = orderAndRevenue?.current?.[0] || { totalOrders: 0, totalRevenue: 0 };
    const previousTotals = orderAndRevenue?.previous?.[0] || { totalOrders: 0, totalRevenue: 0 };
    const currentDelivered = Number(orderAndRevenue?.currentDelivered?.[0]?.count || 0);
    const previousDelivered = Number(orderAndRevenue?.previousDelivered?.[0]?.count || 0);
    const currentOrders = Number(currentTotals.totalOrders || 0);
    const previousOrders = Number(previousTotals.totalOrders || 0);
    const conversionRateCurrent = allUsersCount > 0 ? (uniqueBuyersCurrent.length / allUsersCount) * 100 : 0;
    const conversionRatePrevious = allUsersCount > 0 ? (uniqueBuyersPrevious.length / allUsersCount) * 100 : 0;

    const stats = [
      {
        key: 'revenue',
        title: 'Total Revenue',
        value: toInr(Number(currentTotals.totalRevenue || 0)),
        change: percentChange(Number(currentTotals.totalRevenue || 0), Number(previousTotals.totalRevenue || 0)),
        changeType:
          Number(currentTotals.totalRevenue || 0) >= Number(previousTotals.totalRevenue || 0)
            ? 'positive'
            : 'negative',
      },
      {
        key: 'orders',
        title: 'Total Orders',
        value: currentOrders,
        change: percentChange(currentOrders, previousOrders),
        changeType: currentOrders >= previousOrders ? 'positive' : 'negative',
      },
      {
        key: 'customers',
        title: 'Customers',
        value: allUsersCount,
        change: percentChange(uniqueBuyersCurrent.length, uniqueBuyersPrevious.length),
        changeType: uniqueBuyersCurrent.length >= uniqueBuyersPrevious.length ? 'positive' : 'negative',
      },
      {
        key: 'conversionRate',
        title: 'Conversion Rate',
        value: Number(conversionRateCurrent.toFixed(2)),
        change: percentChange(conversionRateCurrent, conversionRatePrevious),
        changeType: conversionRateCurrent >= conversionRatePrevious ? 'positive' : 'negative',
      },
      {
        key: 'deliveredRate',
        title: 'Delivered Rate',
        value: currentOrders > 0 ? Number(((currentDelivered / currentOrders) * 100).toFixed(2)) : 0,
        change: percentChange(currentDelivered, previousDelivered),
        changeType: currentDelivered >= previousDelivered ? 'positive' : 'negative',
      },
    ];

    return sendSuccess(res, { stats });
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch dashboard stats');
  }
});

router.get('/analytics', authorizeModule('analytics', 'can_view'), async (_req, res) => {
  try {
    const now = new Date();
    const sevenMonthStart = new Date(now.getFullYear(), now.getMonth() - 6, 1);

    const [orderMonthly, reviewSummary, totalUsers, repeatCustomersData, categoryBreakdown] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenMonthStart },
            status: { $ne: 'cancelled' },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            orders: { $sum: 1 },
            revenue: { $sum: '$totalPrice' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Review.aggregate([
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
          },
        },
      ]),
      User.countDocuments({ role: 'user' }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: '$user', ordersCount: { $sum: 1 } } },
        { $group: { _id: null, repeatCustomers: { $sum: { $cond: [{ $gt: ['$ordersCount', 1] }, 1, 0] } } } },
      ]),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'productInfo',
          },
        },
        {
          $addFields: {
            productCategory: {
              $ifNull: [{ $arrayElemAt: ['$productInfo.category', 0] }, 'other'],
            },
          },
        },
        {
          $group: {
            _id: '$productCategory',
            units: { $sum: '$items.quantity' },
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          },
        },
        { $sort: { revenue: -1 } },
      ]),
    ]);

    const recentOrders = orderMonthly.reduce((sum: number, row: any) => sum + Number(row.orders || 0), 0);
    const recentRevenue = orderMonthly.reduce((sum: number, row: any) => sum + Number(row.revenue || 0), 0);
    const averageOrderValue = recentOrders > 0 ? recentRevenue / recentOrders : 0;
    const repeatCustomers = Number(repeatCustomersData?.[0]?.repeatCustomers || 0);
    const repeatCustomerRate = totalUsers > 0 ? (repeatCustomers / totalUsers) * 100 : 0;
    const reviewAvg = Number(reviewSummary?.[0]?.avgRating || 0);

    const orderTrend = orderMonthly.map((row: any) => ({
      key: `${row._id.year}-${String(row._id.month).padStart(2, '0')}`,
      month: new Date(row._id.year, row._id.month - 1, 1).toLocaleString('en-US', { month: 'short' }),
      orders: Number(row.orders || 0),
      revenue: toInr(Number(row.revenue || 0)),
    }));

    const categories = categoryBreakdown.map((row: any, index: number) => ({
      name: String(row._id || 'other'),
      units: Number(row.units || 0),
      revenue: toInr(Number(row.revenue || 0)),
      color: ['#4d44e3', '#0ea5e9', '#22c55e', '#f59e0b', '#6366f1', '#ef4444'][index % 6],
    }));

    return sendSuccess(res, {
      metrics: {
        averageOrderValue: toInr(averageOrderValue),
        repeatCustomerRate: Number(repeatCustomerRate.toFixed(2)),
        reviewAverage: Number(reviewAvg.toFixed(2)),
        reviewCount: Number(reviewSummary?.[0]?.totalReviews || 0),
      },
      orderTrend,
      categories,
    });
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch analytics');
  }
});

router.get('/payments', authorizeModule('payments', 'can_view'), async (req, res) => {
  try {
    const { search = '', status = 'all', page = '1', limit = '20' } = req.query;
    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (parsedPage - 1) * parsedLimit;

    const query: Record<string, unknown> = {};
    if (typeof status === 'string' && status.trim() && status !== 'all') {
      query.paymentStatus = status.trim();
    }
    if (typeof search === 'string' && search.trim()) {
      const q = search.trim();
      query.$or = [
        { orderNumber: { $regex: q, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: q, $options: 'i' } },
      ];
    }

    const now = new Date();
    const currentStart = new Date(now);
    currentStart.setDate(currentStart.getDate() - 30);
    const previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - 30);

    const [items, total, summaryData, previousData] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Order.countDocuments(query),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' }, createdAt: { $gte: currentStart, $lte: now } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' },
            cardPayments: {
              $sum: {
                $cond: [{ $eq: ['$paymentMethod', 'razorpay'] }, '$totalPrice', 0],
              },
            },
            codPayments: {
              $sum: {
                $cond: [{ $eq: ['$paymentMethod', 'cod'] }, '$totalPrice', 0],
              },
            },
          },
        },
      ]),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' }, createdAt: { $gte: previousStart, $lt: currentStart } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' },
            cardPayments: {
              $sum: {
                $cond: [{ $eq: ['$paymentMethod', 'razorpay'] }, '$totalPrice', 0],
              },
            },
            codPayments: {
              $sum: {
                $cond: [{ $eq: ['$paymentMethod', 'cod'] }, '$totalPrice', 0],
              },
            },
          },
        },
      ]),
    ]);

    const currentSummary = summaryData?.[0] || { totalRevenue: 0, cardPayments: 0, codPayments: 0 };
    const prevSummary = previousData?.[0] || { totalRevenue: 0, cardPayments: 0, codPayments: 0 };

    const transactions = items.map((order: any) => ({
      id: order.orderNumber,
      customer: order.shippingAddress?.fullName || 'Customer',
      amount: toInr(Number(order.totalPrice || 0)),
      amountDirection: order.status === 'cancelled' ? 'debit' : 'credit',
      type: order.status === 'cancelled' ? 'Refund' : 'Payment',
      method: String(order.paymentMethod || 'cod').toUpperCase(),
      status: order.paymentStatus || 'pending',
      date: order.createdAt,
    }));

    return sendSuccess(res, {
      cards: [
        {
          key: 'totalRevenue',
          title: 'Total Revenue',
          value: toInr(Number(currentSummary.totalRevenue || 0)),
          change: percentChange(Number(currentSummary.totalRevenue || 0), Number(prevSummary.totalRevenue || 0)),
        },
        {
          key: 'cardPayments',
          title: 'Online Payments',
          value: toInr(Number(currentSummary.cardPayments || 0)),
          change: percentChange(Number(currentSummary.cardPayments || 0), Number(prevSummary.cardPayments || 0)),
        },
        {
          key: 'codPayments',
          title: 'COD Payments',
          value: toInr(Number(currentSummary.codPayments || 0)),
          change: percentChange(Number(currentSummary.codPayments || 0), Number(prevSummary.codPayments || 0)),
        },
      ],
      items: transactions,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.max(1, Math.ceil(total / parsedLimit)),
      },
    });
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch payments');
  }
});

router.get('/settings', authorizeModule('settings', 'can_view'), async (req, res) => {
  try {
    const adminId = req.user?._id || req.user?.userId;
    const adminUser = await User.findById(adminId).lean();
    if (!adminUser) return sendNotFound(res, 'Admin not found');

    const existing = await AdminSettings.findOne({ user: adminId }).lean();
    const names = String(adminUser.name || '').trim().split(/\s+/);
    const firstName = existing?.profile?.firstName || names[0] || '';
    const lastName =
      existing?.profile?.lastName ||
      (names.length > 1 ? names.slice(1).join(' ') : '');

    const settings = {
      profile: {
        firstName,
        lastName,
        name: existing?.profile?.name || adminUser.name || '',
        email: existing?.profile?.email || adminUser.email || '',
        phone: existing?.profile?.phone || adminUser.phone || '',
      },
      notifications: {
        emailNotifs: existing?.notifications?.emailNotifs ?? DEFAULT_ADMIN_SETTINGS.notifications.emailNotifs,
        pushNotifs: existing?.notifications?.pushNotifs ?? DEFAULT_ADMIN_SETTINGS.notifications.pushNotifs,
      },
      security: {
        twoFactorEnabled:
          existing?.security?.twoFactorEnabled ?? DEFAULT_ADMIN_SETTINGS.security.twoFactorEnabled,
      },
      store: {
        publicStore: existing?.store?.publicStore ?? DEFAULT_ADMIN_SETTINGS.store.publicStore,
      },
    };

    return sendSuccess(res, settings);
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch settings');
  }
});

router.put('/settings', authorizeModule('settings', 'can_edit'), async (req, res) => {
  try {
    const adminId = req.user?._id || req.user?.userId;
    const adminUser = await User.findById(adminId);
    if (!adminUser) return sendNotFound(res, 'Admin not found');

    const nextProfile = req.body?.profile || {};
    const nextNotifications = req.body?.notifications || {};
    const nextSecurity = req.body?.security || {};
    const nextStore = req.body?.store || {};

    const firstName = String(nextProfile.firstName || '').trim();
    const lastName = String(nextProfile.lastName || '').trim();
    const combinedName = String(nextProfile.name || `${firstName} ${lastName}`.trim()).trim();
    const profileEmail = String(nextProfile.email || adminUser.email || '').toLowerCase().trim();
    const profilePhone = String(nextProfile.phone || adminUser.phone || '').trim();

    if (!combinedName) {
      return sendError(res, 'Profile name is required');
    }
    if (!profileEmail) {
      return sendError(res, 'Profile email is required');
    }

    const existingEmail = await User.findOne({
      email: profileEmail,
      _id: { $ne: adminUser._id },
    })
      .select('_id')
      .lean();
    if (existingEmail) {
      return sendError(res, 'Email already in use by another account', 409);
    }

    adminUser.name = combinedName;
    adminUser.email = profileEmail;
    adminUser.phone = profilePhone;
    await adminUser.save();

    const settings = await AdminSettings.findOneAndUpdate(
      { user: adminUser._id },
      {
        $set: {
          profile: {
            firstName,
            lastName,
            name: combinedName,
            email: profileEmail,
            phone: profilePhone,
          },
          notifications: {
            emailNotifs: Boolean(nextNotifications.emailNotifs),
            pushNotifs: Boolean(nextNotifications.pushNotifs),
          },
          security: {
            twoFactorEnabled: Boolean(nextSecurity.twoFactorEnabled),
          },
          store: {
            publicStore: Boolean(nextStore.publicStore),
          },
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    ).lean();

    await logAdminActivity(req, {
      action: 'Updated admin settings',
      module: 'settings',
      targetType: 'user',
      targetId: String(adminUser._id),
    });

    return sendSuccess(res, {
      profile: settings?.profile || DEFAULT_ADMIN_SETTINGS.profile,
      notifications: settings?.notifications || DEFAULT_ADMIN_SETTINGS.notifications,
      security: settings?.security || DEFAULT_ADMIN_SETTINGS.security,
      store: settings?.store || DEFAULT_ADMIN_SETTINGS.store,
    });
  } catch (_error) {
    return sendServerError(res, 'Failed to update settings');
  }
});

router.get('/activity-log', authorizeModule('team', 'can_view'), async (req, res) => {
  try {
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 30));
    const items = await AdminActivityLog.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('actor', 'name email')
      .lean();

    return sendSuccess(
      res,
      items.map((item: any) => ({
        id: String(item._id),
        action: item.action,
        module: item.module,
        created_at: item.createdAt,
        actor_name: item.actor?.name || 'Admin',
        actor_email: item.actor?.email || '',
      })),
    );
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch activity log');
  }
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

    await logAdminActivity(req, {
      action: `Created team member: ${user.email}`,
      module: 'team',
      targetType: 'team_member',
      targetId: String(user._id),
      metadata: { role: parsedRole },
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

    await logAdminActivity(req, {
      action: `Updated team member: ${user.email}`,
      module: 'team',
      targetType: 'team_member',
      targetId: String(user._id),
      metadata: { role: user.role, isActive: user.isActive },
    });

    return sendSuccess(res, { user_id: String(user._id) }, 'Team member updated');
  } catch (_error) {
    return sendServerError(res, 'Failed to update team member');
  }
});

router.delete('/team/:id', authorizeModule('team', 'can_delete'), async (req, res) => {
  try {
    const teamMember = await User.findById(req.params.id);
    if (!teamMember) return sendNotFound(res, 'Team member not found');

    if (!['admin', 'super_admin', 'manager', 'staff'].includes(String(teamMember.role))) {
      return sendError(res, 'User is not a team member');
    }

    if (String(teamMember._id) === String(req.user?._id || req.user?.userId || '')) {
      return sendError(res, 'You cannot remove your own account', 403);
    }

    if (teamMember.role === 'super_admin') {
      return sendError(res, 'Super admin cannot be removed', 403);
    }

    await teamMember.deleteOne();

    await logAdminActivity(req, {
      action: `Removed team member: ${teamMember.email}`,
      module: 'team',
      targetType: 'team_member',
      targetId: String(teamMember._id),
    });

    return sendSuccess(res, { user_id: String(teamMember._id) }, 'Team member removed');
  } catch (_error) {
    return sendServerError(res, 'Failed to remove team member');
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
