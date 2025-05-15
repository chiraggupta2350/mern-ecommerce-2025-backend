import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const generateAdminToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_ADMIN_SECRET, {
    expiresIn: process.env.JWT_ADMIN_EXPIRES_IN,
  });
};


export { generateToken,generateAdminToken };