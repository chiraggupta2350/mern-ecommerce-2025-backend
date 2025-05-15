import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/userModel.js';
import { generateToken } from '../utils/gererateToken.js';
import sendEmail from '../utils/sendEmails.js';
import { rules } from '../config/utils.js';

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashedPassword, isAdmin: false });
  if (user) {
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id), });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// Login user
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (isPasswordMatch) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};


const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate Reset Token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send Reset Email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: email,
      subject: 'Reset Your Password',
      templateName: 'resetPassword',
      templateData: { resetUrl }
    });

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

const chatboatApi = async (req, res) => {
  {
    const message = req.body.message.toLowerCase();
    const response = rules[message] || "Sorry, I couldn't understand your question. Please check our FAQ section.";

    setTimeout(() => {
      res.json({ response });
    }, 800); // Simulate delay for better user experience
  }
}

export { registerUser, authUser, getUserProfile, forgotPassword, resetPassword, chatboatApi };