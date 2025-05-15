import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getCart, addToCart, removeFromCart, clearCart } from '../controllers/cartController.js';

const router = express.Router();

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.delete('/remove/:productId', protect, removeFromCart);
router.delete('/clear', protect, clearCart);

export default router;