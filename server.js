import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import userRoutes from "./routes/userRoutes.js";
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from "./routes/adminAuthRoutes.js"
import http from 'http';
import { Server } from 'socket.io';
import User from "./models/userModel.js";
import Chat from "./models/chatModel.js"

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // set your frontend URL here
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {

  console.log('socketid',socket.id)

  socket.on('register', async (userId) => {
    await User.findByIdAndUpdate({ _id: userId }, { socketId: socket.id, online: true });
  });

  socket.on('sendMessage', async (data) => {
    const { productId, senderId, receiverId, message } = data;

    // Find receiver's socket id
    const receiver = await User.findById(receiverId);

    const chat = await Chat.create({ productId, senderId, receiverId, message });

    if (receiver?.socketId) {
      io.to(receiver.socketId).emit('receiveMessage', { senderId, message, productId, createdAt: chat.createdAt });
    }

  });

  socket.on('disconnect', async () => {
    console.log(`User Disconnected: ${socket.id}`);
    await User.findOneAndUpdate({ socketId: socket.id }, { socketId: null, online: false });
  });
});



app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes)

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
