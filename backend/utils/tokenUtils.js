const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const signAccessToken = (payload) => {
  const expiresIn = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN, 10) || 3600;
  const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn });
  return { token, expiresIn };
};

const signRefreshToken = (payload) => {
  const expiresIn = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN, 10) || (7 * 24 * 3600);
  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn });
  return { token, expiresIn };
};

module.exports = {
  signAccessToken,
  signRefreshToken
};
