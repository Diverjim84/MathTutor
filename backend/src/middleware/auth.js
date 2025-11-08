const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mathtutor-secret-key-change-in-production';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

function requireParent(req, res, next) {
  if (!req.user.isParent) {
    return res.status(403).json({ error: 'Parent access required' });
  }
  next();
}

module.exports = {
  authenticateToken,
  requireParent,
  JWT_SECRET
};
