const { verifyAccessToken } = require('../../utils/jwt.utils');
const User = require('../models/user.model');
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify access token
    const payload = verifyAccessToken(token);

    // Find the user associated with the token
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    // Check token version for invalidation (logout from all devices)
    if ((payload.tokenVersion || 0) !== (user.tokenVersion || 0)) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (err) {
    console.error('AUTH ERROR:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function permit(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: You do not have access' });
    }

    next();
  };
}

module.exports = {
  requireAuth,
  permit
};
