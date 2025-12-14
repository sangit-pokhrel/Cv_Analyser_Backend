// const { verifyAccessToken } = require('../../utils/jwt.utils');
// const User = require('../models/user.model');
// async function requireAuth(req, res, next) {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ error: 'Unauthorized: No token provided' });
//     }

//     const token = authHeader.split(' ')[1];

//     // Verify access token
//     const payload = verifyAccessToken(token);

//     // Find the user associated with the token
//     const user = await User.findById(payload.sub);

//     if (!user) {
//       return res.status(401).json({ error: 'Unauthorized: User not found' });
//     }

//     // Check token version for invalidation (logout from all devices)
//     if ((payload.tokenVersion || 0) !== (user.tokenVersion || 0)) {
//       return res.status(401).json({ error: 'Token has been revoked' });
//     }

//     // Attach user to request
//     req.user = user;

//     next();
//   } catch (err) {
//     console.error('AUTH ERROR:', err.message);
//     return res.status(401).json({ error: 'Invalid or expired token' });
//   }
// }

// function permit(...allowedRoles) {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     if (!allowedRoles.includes(req.user.role)) {
//       return res.status(403).json({ error: 'Forbidden: You do not have access' });
//     }

//     next();
//   };
// }

// module.exports = {
//   requireAuth,
//   permit
// };
const { verifyAccessToken } = require('../../utils/jwt.utils');
const User = require('../models/user.model');

/**
 * Require authentication middleware
 * Verifies JWT token and attaches user to req.user
 */
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized: No token provided',
        message: 'Please login to access this resource'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify access token
    const payload = verifyAccessToken(token);

    if (!payload || !payload.sub) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Token payload is malformed'
      });
    }

    // Find the user associated with the token
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ 
        error: 'Unauthorized: User not found',
        message: 'The user associated with this token no longer exists'
      });
    }

    // Check if user account is deactivated
    if (user.status === 'deactivated') {
      return res.status(403).json({ 
        error: 'Account deactivated',
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Check token version for invalidation (logout from all devices)
    if ((payload.tokenVersion || 0) !== (user.tokenVersion || 0)) {
      return res.status(401).json({ 
        error: 'Token has been revoked',
        message: 'This token is no longer valid. Please login again.'
      });
    }

    // Attach user to request
    req.user = user;

    console.log(`✅ Auth successful - User: ${user.email} (${user._id})`);
    
    next();
  } catch (err) {
    console.error('AUTH ERROR:', err.message);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Token verification failed'
      });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Your session has expired. Please login again.'
      });
    }
    
    return res.status(401).json({ 
      error: 'Authentication failed',
      message: err.message 
    });
  }
}

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require it
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without user
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    if (payload && payload.sub) {
      const user = await User.findById(payload.sub);
      
      if (user && user.status !== 'deactivated' && 
          (payload.tokenVersion || 0) === (user.tokenVersion || 0)) {
        req.user = user;
        console.log(`✅ Optional auth - User: ${user.email}`);
      } else {
        req.user = null;
      }
    } else {
      req.user = null;
    }

    next();
  } catch (err) {
    // If token is invalid, just continue without user
    console.log('Optional auth failed, continuing as guest:', err.message);
    req.user = null;
    next();
  }
}

/**
 * Permission middleware
 * Checks if user has required role
 */
function permit(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden: You do not have access',
        message: `This action requires one of these roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}

module.exports = {
  requireAuth,
  optionalAuth,
  permit
};