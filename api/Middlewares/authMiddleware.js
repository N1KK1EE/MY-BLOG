const jwt = require('jsonwebtoken');
const User = require('../Models/user');

// exports.protect = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) throw new Error('Not authorized, no token');
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select('-password');
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Not authorized' });
//   }
// };

// JWT authentication middleware
const authMiddleware = async (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Authorization required' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach the user to the request object
    req.user = await User.findById(decoded.userId);

    if (!req.user) return res.status(401).json({ message: 'User not found' });


    // Move to the next middleware/handler
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }

};

module.exports = authMiddleware;

