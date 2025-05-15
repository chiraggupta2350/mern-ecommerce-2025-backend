// models/chatModel.js

import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
