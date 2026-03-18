const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1]; // Bearer <token>
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin; // <-- add this
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// middleware/admin.js
const adminMiddleware = (req, res, next) => {
  // First, ensure authMiddleware has run (attach to route before adminMiddleware)
  if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
  if (!req.isAdmin) {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware
};






