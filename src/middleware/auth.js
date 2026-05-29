import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default authMiddleware;
