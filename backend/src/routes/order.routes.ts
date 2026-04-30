import { Router } from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { authenticate } from '@/middleware/auth';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { sendError, sendNotFound, sendServerError, sendSuccess, sendUnauthorized } from '@/utils/response';

const router = Router();

router.use(authenticate);

type IncomingOrderItem = {
  productId?: string;
  quantity?: number;
  size?: string;
  color?: string;
};

type PreparedOrderData = {
  orderItems: Array<{
    product: mongoose.Types.ObjectId;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }>;
  normalizedItems: Array<{
    productId: string;
    quantity: number;
  }>;
  normalizedAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
};

const createOrderNumber = () => {
  const stamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SS${stamp}${random}`;
};

const createExpectedDeliveryDate = (baseDate = new Date(), days = 7) => {
  const expected = new Date(baseDate);
  expected.setDate(expected.getDate() + days);
  return expected;
};

const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  if (!keyId || !keySecret) return null;

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

const prepareOrderData = async (body: any): Promise<{ ok: true; data: PreparedOrderData } | { ok: false; error: string }> => {
  const { items, shippingAddress } = body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, error: 'At least one order item is required' };
  }

  if (!shippingAddress || typeof shippingAddress !== 'object') {
    return { ok: false, error: 'Shipping address is required' };
  }

  const normalizedItems = (items as IncomingOrderItem[])
    .map((item) => ({
      productId: typeof item.productId === 'string' ? item.productId : '',
      quantity: Number(item.quantity) || 0,
      size: typeof item.size === 'string' ? item.size.trim() : '',
      color: typeof item.color === 'string' ? item.color.trim() : '',
    }))
    .filter((item) => mongoose.Types.ObjectId.isValid(item.productId) && item.quantity > 0);

  if (normalizedItems.length === 0) {
    return { ok: false, error: 'Order items are invalid' };
  }

  const productIds = [...new Set(normalizedItems.map((item) => item.productId))];
  const dbProducts = await Product.find({ _id: { $in: productIds }, isActive: true }).lean();
  const productMap = new Map(dbProducts.map((product) => [product._id.toString(), product]));

  if (productMap.size !== productIds.length) {
    return { ok: false, error: 'Some products are unavailable' };
  }

  const orderItems: PreparedOrderData['orderItems'] = [];
  let itemsPrice = 0;

  for (const item of normalizedItems) {
    const product = productMap.get(item.productId);
    if (!product) {
      return { ok: false, error: 'Some products are unavailable' };
    }

    if (product.stock < item.quantity) {
      return { ok: false, error: `Insufficient stock for ${product.name}` };
    }

    const unitPrice = typeof product.discountPrice === 'number' && product.discountPrice > 0 ? product.discountPrice : product.price;

    itemsPrice += unitPrice * item.quantity;
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || 'https://placehold.co/400x500?text=No+Image',
      price: unitPrice,
      quantity: item.quantity,
      size: item.size || undefined,
      color: item.color || undefined,
    });
  }

  const shippingPriceInput = Number(body.shippingPrice);
  const shippingPrice = Number.isFinite(shippingPriceInput) ? Math.max(0, shippingPriceInput) : itemsPrice > 0 ? 15 : 0;

  const taxPriceInput = Number(body.taxPrice);
  const taxPrice = Number.isFinite(taxPriceInput)
    ? Math.max(0, taxPriceInput)
    : Math.round((itemsPrice + shippingPrice) * 0.08);

  const totalPrice = Math.max(0, Math.round((itemsPrice + shippingPrice + taxPrice) * 100) / 100);

  const normalizedAddress = {
    fullName: String(shippingAddress.fullName || '').trim(),
    phone: String(shippingAddress.phone || '').trim(),
    addressLine1: String(shippingAddress.addressLine1 || '').trim(),
    addressLine2: String(shippingAddress.addressLine2 || '').trim(),
    city: String(shippingAddress.city || '').trim(),
    state: String(shippingAddress.state || '').trim(),
    pincode: String(shippingAddress.pincode || '').trim(),
    country: String(shippingAddress.country || 'India').trim() || 'India',
  };

  if (
    !normalizedAddress.fullName ||
    !normalizedAddress.phone ||
    !normalizedAddress.addressLine1 ||
    !normalizedAddress.city ||
    !normalizedAddress.state ||
    !normalizedAddress.pincode
  ) {
    return { ok: false, error: 'Please complete shipping address fields' };
  }

  return {
    ok: true,
    data: {
      orderItems,
      normalizedItems: normalizedItems.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      normalizedAddress,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    },
  };
};

router.get('/', async (req, res) => {
  try {
    if (!req.user?._id) {
      return sendUnauthorized(res, 'Authentication required');
    }

    const { status, page = '1', limit = '20', search = '' } = req.query;
    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (parsedPage - 1) * parsedLimit;

    const query: Record<string, unknown> = { user: req.user._id };

    if (typeof status === 'string' && status.trim()) {
      query.status = status.trim();
    }

    if (typeof search === 'string' && search.trim()) {
      query.orderNumber = { $regex: search.trim(), $options: 'i' };
    }

    const [items, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(parsedLimit).lean(),
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
    return sendServerError(res, 'Failed to fetch orders');
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!req.user?._id) {
      return sendUnauthorized(res, 'Authentication required');
    }

    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const order = isObjectId
      ? await Order.findOne({ _id: id, user: req.user._id }).lean()
      : await Order.findOne({ orderNumber: id, user: req.user._id }).lean();

    if (!order) {
      return sendNotFound(res, 'Order not found');
    }

    return sendSuccess(res, order);
  } catch (_error) {
    return sendServerError(res, 'Failed to fetch order');
  }
});

router.post('/razorpay/create', async (req, res) => {
  try {
    if (!req.user?._id) {
      return sendUnauthorized(res, 'Authentication required');
    }

    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      return sendError(res, 'Razorpay is not configured on server', 500);
    }

    const prepared = await prepareOrderData(req.body);
    if (!prepared.ok) {
      return sendError(res, prepared.error);
    }

    const { orderItems, normalizedAddress, itemsPrice, shippingPrice, taxPrice, totalPrice } = prepared.data;

    const order = await Order.create({
      user: req.user._id,
      orderNumber: createOrderNumber(),
      items: orderItems,
      shippingAddress: normalizedAddress,
      paymentMethod: 'razorpay',
      paymentStatus: 'pending',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      status: 'pending',
      expectedDeliveryDate: createExpectedDeliveryDate(),
      notes: typeof req.body.notes === 'string' ? req.body.notes.trim() : '',
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100),
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        appOrderId: String(order._id),
      },
    });

    order.paymentId = razorpayOrder.id;
    await order.save();

    return sendSuccess(res, {
      keyId: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      appOrderId: String(order._id),
      orderNumber: order.orderNumber,
    }, 'Razorpay order created');
  } catch (_error) {
    return sendServerError(res, 'Failed to create Razorpay order');
  }
});

router.post('/razorpay/verify', async (req, res) => {
  try {
    if (!req.user?._id) {
      return sendUnauthorized(res, 'Authentication required');
    }

    const { appOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!appOrderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return sendError(res, 'Razorpay verification payload is incomplete');
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    if (!keySecret) {
      return sendError(res, 'Razorpay secret is missing on server', 500);
    }

    const order = await Order.findOne({ _id: appOrderId, user: req.user._id });
    if (!order) {
      return sendNotFound(res, 'Order not found');
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return sendError(res, 'Invalid payment signature', 400);
    }

    if (order.paymentStatus === 'paid') {
      return sendSuccess(res, order, 'Payment already verified');
    }

    for (const item of order.items) {
      const product = await Product.findById(item.product).lean();
      if (!product || product.stock < item.quantity) {
        return sendError(res, `Stock unavailable for ${item.name}. Please contact support.`);
      }
    }

    for (const item of order.items) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } });
    }

    order.paymentStatus = 'paid';
    order.paymentId = razorpay_payment_id;
    order.status = 'confirmed';
    if (!order.expectedDeliveryDate) {
      order.expectedDeliveryDate = createExpectedDeliveryDate();
    }
    await order.save();

    return sendSuccess(res, order, 'Payment verified and order placed');
  } catch (_error) {
    return sendServerError(res, 'Failed to verify payment');
  }
});

router.post('/', async (req, res) => {
  try {
    if (!req.user?._id) {
      return sendUnauthorized(res, 'Authentication required');
    }

    const { paymentMethod = 'cod', notes } = req.body;

    if (!['razorpay', 'cod'].includes(paymentMethod)) {
      return sendError(res, 'Valid payment method is required');
    }

    if (paymentMethod === 'razorpay') {
      return sendError(res, 'Use Razorpay create and verify endpoints for online payment', 400);
    }

    const prepared = await prepareOrderData(req.body);
    if (!prepared.ok) {
      return sendError(res, prepared.error);
    }

    const { orderItems, normalizedItems, normalizedAddress, itemsPrice, shippingPrice, taxPrice, totalPrice } = prepared.data;

    const order = await Order.create({
      user: req.user._id,
      orderNumber: createOrderNumber(),
      items: orderItems,
      shippingAddress: normalizedAddress,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      status: 'confirmed',
      expectedDeliveryDate: createExpectedDeliveryDate(),
      notes: typeof notes === 'string' ? notes.trim() : '',
    });

    for (const item of normalizedItems) {
      await Product.updateOne({ _id: item.productId }, { $inc: { stock: -item.quantity } });
    }

    return sendSuccess(res, order, 'Order placed successfully', 201);
  } catch (_error) {
    return sendServerError(res, 'Failed to place order');
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!req.user?._id) {
      return sendUnauthorized(res, 'Authentication required');
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid order id');
    }

    const order = await Order.findOne({ _id: id, user: req.user._id });
    if (!order) {
      return sendNotFound(res, 'Order not found');
    }

    if (order.status === 'cancelled') {
      return sendError(res, 'Order already cancelled');
    }

    if (order.status === 'delivered') {
      return sendError(res, 'Delivered order cannot be cancelled');
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = typeof req.body.reason === 'string' ? req.body.reason.trim() : 'Cancelled by user';
    await order.save();

    for (const item of order.items) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
    }

    return sendSuccess(res, order, 'Order cancelled successfully');
  } catch (_error) {
    return sendServerError(res, 'Failed to cancel order');
  }
});

export default router;
