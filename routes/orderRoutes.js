import express from 'express';
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin, adminProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/get-all-orders',adminProtect, admin, getAllOrders);
router.post('/create',protect, createOrder)
router.get('/myorders',protect, getUserOrders);
router.put('/:id/status',adminProtect,admin,updateOrderStatus);

export default router;
