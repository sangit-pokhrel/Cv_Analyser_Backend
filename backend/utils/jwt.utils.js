const jwt = require('jsonwebtoken');
const ms = require('ms'); // optional; if not installed, parse manually or use seconds

const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXP || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXP || '7d';
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  console.warn('JWT secrets not set. Set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in .env');
}

function signAccessToken(user) {
  const payload = {
    sub: user._id.toString(),
    role: user.role,
    tokenVersion: user.tokenVersion || 0,
  };
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

function signRefreshToken(payload) {
  // payload: { userId, jti }
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  ACCESS_EXPIRES,
  REFRESH_EXPIRES
};
