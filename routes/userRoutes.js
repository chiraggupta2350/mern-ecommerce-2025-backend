import express from 'express';
import { registerUser, authUser, getUserProfile, forgotPassword, chatboatApi, resetPassword } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post("/chat", chatboatApi);

export default router;