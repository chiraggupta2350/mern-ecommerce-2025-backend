import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: String,
      required: false,
    },
    socketId: {
      type: String
    },
    online: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;