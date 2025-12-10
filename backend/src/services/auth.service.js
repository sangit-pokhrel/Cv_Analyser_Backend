const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { signAccessToken, signRefreshToken } = require('../../utils/tokenUtils');
const dotenv = require('dotenv');
dotenv.config();

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;

async function registerUser({ email, password, firstName, lastName, role }) {

  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, saltRounds);

  const user = new User({
    email,
    password: hashed,
    firstName,
    lastName,
    role,
    status: 'pending_verification'
  });

  await user.save();

  const access = signAccessToken({ id: user._id, role: user.role, email: user.email });
  const refresh = signRefreshToken({ id: user._id });

  return {
    user: user.toJSON(),
    tokens: {
      accessToken: access.token,
      refreshToken: refresh.token,
      expiresIn: access.expiresIn
    }
  };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }


  if (user.status === 'disabled') {
    const err = new Error('Account disabled');
    err.status = 403;
    throw err;
  }

  const access = signAccessToken({ id: user._id, role: user.role, email: user.email });
  const refresh = signRefreshToken({ id: user._id });

  return {
    user: user.toJSON(),
    tokens: {
      accessToken: access.token,
      refreshToken: refresh.token,
      expiresIn: access.expiresIn
    }
  };
}

module.exports = {
  registerUser,
  loginUser
};
