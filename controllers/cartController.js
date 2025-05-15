import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// Get cart by user ID
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.productId');
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  const { productId, name, price, image, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, image, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
}

// Remove item from cart
const removeFromCart =  async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
}

// Clear cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear cart' });
  }
};

export { getCart, addToCart, removeFromCart, clearCart };
