import jwt from "jsonwebtoken";
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  // Verify header format
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(' ')[1]; // Get token after 'Bearer'

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and check existence
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Update activity
    user.lastActivity = Date.now();
    user.isOnline = true;
    await user.save();

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error('JWT Error:', err.message);
    const errorMessage = err.name === 'TokenExpiredError' 
      ? "Token expired" 
      : "Invalid token";
    res.status(401).json({ message: errorMessage });
  }
};
