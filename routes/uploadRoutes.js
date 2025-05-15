import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { admin,adminProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', adminProtect, admin, upload.single('image'), (req, res) => {
  res.json({ imageUrl: req.file.location });
});

export default router;