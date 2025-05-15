import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { generateAdminToken } from '../utils/gererateToken.js';

const registerAdmin = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  if (!isAdmin) {
    return res.status(403).json({ message: 'Not authorized to sign up as admin' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateAdminToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    let isPasswordMatch;

    if (user) {
      isPasswordMatch = await bcrypt.compare(password, user.password);
    }

    if (user && isPasswordMatch && user.isAdmin) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateAdminToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password, or not authorized as admin' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

export { registerAdmin, loginAdmin }