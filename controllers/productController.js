import Product from '../models/productModel.js';
import s3 from '../config/s3Config.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import Chat from '../models/chatModel.js';
import User from '../models/userModel.js';

// Create a product (Admin only)
const createProduct = async (req, res) => {
  const { name, description, price, category, stock, image } = req.body;

  try {
    const product = new Product({
      createdBy: req.user._id,
      name,
      description,
      price,
      category,
      stock,
      image,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' }; // Case-insensitive search

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
  const { name, description, price, category, stock, image } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.image = image || product.image;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Delete the product image from S3
    const key = product.image.split('/').pop(); // Extract key from S3 URL
    await s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: key }));

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};
    const adminId = req.user._id

    query.createdBy = adminId; // Filter products created by the logged-in admin
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' }; // Case-insensitive search

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChatsToAdmin = async (req, res) => {
  try {
    const adminId = req.user._id; // assuming you have auth middleware
    const productId = req.params.productId; // assuming you pass productId in the URL

    // 1. Find all chats where admin is receiver
    const chats = await Chat.find({ receiverId: adminId, productId });

    // 2. Get unique senderIds
    const senderIds = [...new Set(chats.map(chat => chat.senderId.toString()))];

    // 3. Fetch user details
    const users = await User.find({ _id: { $in: senderIds } }).select('_id name email online');

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getChatMessages = async (req, res) => {
  const adminId = req.user._id;
  const { productId, userId } = req.params;

  // Find chats between admin and user for the product
  const messages = await Chat.find({
    productId: productId,
    $or: [
      { senderId: adminId, receiverId: userId },
      { senderId: userId, receiverId: adminId },
    ],
  }).sort({ createdAt: 1 }); // sort oldest to newest

  // Optional: populate sender name if you want
  const populatedMessages = await Promise.all(
    messages.map(async (msg) => {
      const sender = await User.findById(msg.senderId).select('name');
      return {
        _id: msg._id,
        senderId: sender ? sender.name : 'Unknown',
        text: msg.message,
        createdAt: msg.createdAt,
      };
    })
  );

  res.json(populatedMessages);
};

const getUserChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, adminId } = req.params;

    if (!productId || !adminId) {
      return res.status(400).json({ message: 'Missing productId or adminId' });
    }

    const messages = await Chat.find({
      productId,
      $or: [
        { senderId: adminId, receiverId: userId },
        { senderId: userId, receiverId: adminId },
      ],
    }).sort({ createdAt: 1 }); // sort messages by time ascending

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching chats' });
  }
};

export { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getChatsToAdmin,getChatMessages, getAdminProducts,getUserChat };
