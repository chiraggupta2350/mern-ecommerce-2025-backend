import { sendNotification } from '../config/firebaseAdmin.js';
import Order from '../models/orderModel.js';

// Create Order
const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice,isPaid,paidAt } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt
  });

  const createdOrder = await order.save();

  const token = req.body.fcmToken

  sendNotification(token,'Order Placed',`Your order has been placed successfully. Order ID: ${createdOrder._id}`)
  res.status(201).json(createdOrder);
};

// Get All Orders (Admin)
const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'id name email');
  res.json(orders);
};

// Get User Orders
const getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// Get Single Order
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(order);
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isDelivered = status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus
};
