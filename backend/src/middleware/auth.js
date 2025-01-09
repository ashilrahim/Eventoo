// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    console.log("Token from cookies:", token);
    if (!token) {
      return res.status(401).json({ message: 'Access denied no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
    const user = await User.findById(decoded.userId).select('-password');
    console.log("User found:", user);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = { 
      ...user.toObject(),
      admin: user.role === 'admin',
      event_owner: user.role === 'event_owner',
    };
    console.log("req.user set as:", req.user); // Log req.user
    console.log("req.user set:", req.user);
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'You do not have permission to perform this action' 
      });
    }
    next();
  };
};