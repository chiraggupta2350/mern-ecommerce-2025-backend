import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getChatsToAdmin,
  getAdminProducts,
  getChatMessages,
  getUserChat,
} from '../controllers/productController.js';
import { protect, admin, adminProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/get-chats-user-to-admin/:productId').get(adminProtect, admin, getChatsToAdmin)

router.route('/get-chat-messages/:productId/:userId').get(adminProtect, admin, getChatMessages)

router.route('/get-admin-products').get(adminProtect, admin, getAdminProducts)

router.route('/').get(getProducts).post(adminProtect, admin, createProduct);

router.get('/chats/:productId/:adminId', protect, getUserChat);
router
  .route('/:id')
  .get(getProductById)
  .put(adminProtect, admin, updateProduct)
  .delete(adminProtect, admin, deleteProduct);


export default router;