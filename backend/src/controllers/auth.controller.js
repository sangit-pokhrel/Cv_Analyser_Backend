

const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const VerificationToken = require('../models/verificationToken.model');
const { signAccessToken, signRefreshToken, verifyRefreshToken, REFRESH_EXPIRES } = require('../../utils/jwt.utils');
const { sendEmail, verificationEmail } = require('../../utils/email.utils');
const { validateRegister } = require('../../utils/validators.utils');

const LoginAttempt = require('../models/loginAttempt.model');

const ms = (str) => {
  // crude parse: support number + 'd' or 'h' or 'm'
  if (typeof str === 'number') return str;
  const n = parseInt(str,10);
  if (str.endsWith('d')) return n * 24 * 60 * 60 * 1000;
  if (str.endsWith('h')) return n * 60 * 60 * 1000;
  if (str.endsWith('m')) return n * 60 * 1000;
  return n;
};


const MAX_LOGIN_ATTEMPTS = 3;
const BLOCK_DURATION = 24 * 60 * 60 * 1000; // 24 hours
async function register(req, res) {
  try {
    console.log('[REGISTER] incoming body:', { ...req.body, password: '<<redacted>>' });

    const { email, password, firstName, lastName, role } = req.body;
    const errors = validateRegister({ email, password });
    if (errors.length) {
      console.log('[REGISTER] validation failed:', errors);
      return res.status(400).json({ errors });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('[REGISTER] email exists:', email);
      return res.status(400).json({ error: 'Email already in use' });
    }

    // create user and save
    const user = new User({ email, password, firstName, lastName, role });
    await user.save();
    console.log('[REGISTER] user saved:', user._id);

    // create verification token record
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await VerificationToken.create({ user: user._id, token, type: 'email_verify', expiresAt });
    console.log('[REGISTER] verification token stored:', token);

    // Send email ASYNCHRONOUSLY (do not await) so email issues do not hang the response.
    // We still log failures, but won't block the user response.
    (async () => {
      try {
        const mail = verificationEmail({ user, token });
        await sendEmail(mail);
        console.log('[REGISTER] verification email sent to', user.email);
      } catch (mailErr) {
        console.warn('[REGISTER] failed to send verification email (non-blocking):', mailErr && mailErr.message);
      }
    })();

    // Respond to client immediately
    return res.status(201).json({
      message: 'Registered. Check email to verify account.',
      user: user.toJSON()
    });

  } catch (err) {
    console.error('[REGISTER] unexpected error:', err);
    // safe fallback response
    return res.status(500).json({ error: 'Server error during registration' });
  }
}

async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token required' });

    const record = await VerificationToken.findOne({ token, type: 'email_verify' }).populate('user');
    if (!record) return res.status(400).json({ error: 'Invalid token' });
    if (record.expiresAt < new Date()) return res.status(400).json({ error: 'Token expired' });
    if (record.consumed) return res.status(400).json({ error: 'Token already used' });

    const user = record.user;
    user.isEmailVerified = true;
    user.status = 'active';
    await user.save();

    record.consumed = true;
    await record.save();

    return res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// async function login(req, res) {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: 'Invalid credentials' });

//     // simple lockout check
//     if (user.lockUntil && user.lockUntil > new Date()) {
//       return res.status(403).json({ error: 'Account temporarily locked due to failed attempts' });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
//       if (user.failedLoginAttempts >= 5) {
//         user.lockUntil = new Date(Date.now() + (15 * 60 * 1000)); // 15min lock
//         user.failedLoginAttempts = 0;
//       }
//       await user.save();
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     // reset failed attempts
//     user.failedLoginAttempts = 0;
//     user.lockUntil = undefined;
//     user.lastLoginAt = new Date();
//     await user.save();

//     // create access token
//     const accessToken = signAccessToken(user);

//     // create refresh token record with random jti
//     const jti = uuidv4();
//     const refreshPayload = { userId: user._id.toString(), jti, tokenVersion: user.tokenVersion || 0 };
//     const refreshToken = signRefreshToken(refreshPayload);

//     const expiresAt = new Date(Date.now() + ms(process.env.REFRESH_TOKEN_EXP || '7d'));
//     await RefreshToken.create({
//       user: user._id,
//       token: jti,
//       createdByIp: req.ip,
//       expiresAt
//     });

//     // set refresh token as httpOnly cookie
//     const cookieSecure = process.env.COOKIE_SECURE === 'true';
//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       secure: cookieSecure,
//       sameSite: 'lax',
//       maxAge: expiresAt - Date.now()
//     });

//     return res.json({ accessToken, user: user.toJSON() });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Server error' });
//   }
// }

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Clean expired blocks
    await LoginAttempt.cleanExpiredBlocks();

    // Check for login attempts
    let loginAttempt = await LoginAttempt.findOne({ email: email.toLowerCase() });

    // Check if blocked
    if (loginAttempt && loginAttempt.isCurrentlyBlocked()) {
      const timeRemaining = loginAttempt.blockedUntil 
        ? Math.ceil((loginAttempt.blockedUntil - new Date()) / (1000 * 60))
        : null;

      return res.status(403).json({ 
        error: 'Account temporarily blocked',
        message: timeRemaining 
          ? `Too many failed login attempts. Try again in ${timeRemaining} minutes.`
          : 'Account blocked. Contact administrator.',
        isBlocked: true,
        blockedUntil: loginAttempt.blockedUntil
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      await recordFailedAttempt(email, ipAddress, userAgent, loginAttempt);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // simple lockout check (legacy)
    if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(403).json({ error: 'Account temporarily locked due to failed attempts' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Record failed attempt
      const attemptsLeft = await recordFailedAttempt(email, ipAddress, userAgent, loginAttempt);
      
      // Legacy tracking
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + (15 * 60 * 1000)); // 15min lock
        user.failedLoginAttempts = 0;
      }
      await user.save();

      if (attemptsLeft === 0) {
        return res.status(403).json({ 
          error: 'Account blocked',
          message: 'Too many failed attempts. Account blocked for 24 hours.',
          isBlocked: true
        });
      }

      return res.status(400).json({ 
        error: 'Invalid credentials',
        attemptsLeft,
        message: `Invalid password. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`
      });
    }

    // ✅ SUCCESS - Reset attempts
    if (loginAttempt) {
      await loginAttempt.resetAttempts();
    }

    // reset failed attempts
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLoginAt = new Date();
    await user.save();

    // create access token
    const accessToken = signAccessToken(user);

    // create refresh token record with random jti
    const jti = uuidv4();
    const refreshPayload = { userId: user._id.toString(), jti, tokenVersion: user.tokenVersion || 0 };
    const refreshToken = signRefreshToken(refreshPayload);

    const expiresAt = new Date(Date.now() + ms(process.env.REFRESH_TOKEN_EXP || '7d'));
    await RefreshToken.create({
      user: user._id,
      token: jti,
      createdByIp: req.ip,
      expiresAt
    });

    // set refresh token as httpOnly cookie
    const cookieSecure = process.env.COOKIE_SECURE === 'true';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: 'lax',
      maxAge: expiresAt - Date.now()
    });

    // Also set accessToken cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    return res.json({ 
      success: true,
      accessToken, 
      user: user.toJSON() 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// ADD THIS HELPER FUNCTION at the bottom before module.exports
async function recordFailedAttempt(email, ipAddress, userAgent, existingAttempt) {
  try {
    if (!existingAttempt) {
      await LoginAttempt.create({
        email: email.toLowerCase(),
        ipAddress,
        userAgent,
        attemptCount: 1,
        attempts: [{ timestamp: new Date(), ipAddress, userAgent, success: false }]
      });
      return MAX_LOGIN_ATTEMPTS - 1;
    }

    existingAttempt.attemptCount += 1;
    existingAttempt.lastAttemptAt = new Date();
    existingAttempt.ipAddress = ipAddress;
    existingAttempt.attempts.push({ timestamp: new Date(), ipAddress, userAgent, success: false });

    if (existingAttempt.attemptCount >= MAX_LOGIN_ATTEMPTS) {
      existingAttempt.isBlocked = true;
      existingAttempt.blockedUntil = new Date(Date.now() + BLOCK_DURATION);
      await existingAttempt.save();
      return 0;
    }

    await existingAttempt.save();
    return MAX_LOGIN_ATTEMPTS - existingAttempt.attemptCount;
  } catch (error) {
    console.error('Error recording failed attempt:', error);
    return MAX_LOGIN_ATTEMPTS - 1;
  }
}

async function refreshTokenHandler(req, res) {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) return res.status(401).json({ error: 'No refresh token provided' });

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (e) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const { jti, userId } = payload;
    // find persisted refresh token by jti
    const stored = await RefreshToken.findOne({ token: jti }).populate('user');
    if (!stored || !stored.isActive) {
      return res.status(401).json({ error: 'Refresh token revoked or expired' });
    }

    // Token rotation: revoke current stored token and issue a new one replacing it
    stored.revokedAt = new Date();
    stored.replacedByToken = uuidv4();
    await stored.save();

    // create new saved refresh token
    const newJti = stored.replacedByToken;
    const newRefreshPayload = { userId: stored.user._id.toString(), jti: newJti, tokenVersion: stored.user.tokenVersion || 0 };
    const newRefreshToken = signRefreshToken(newRefreshPayload);
    const expiresAt = new Date(Date.now() + ms(process.env.REFRESH_TOKEN_EXP || '7d'));
    await RefreshToken.create({ user: stored.user._id, token: newJti, createdByIp: req.ip, expiresAt });

    // issue new access token
    const accessToken = signAccessToken(stored.user);

    // set cookie
    const cookieSecure = process.env.COOKIE_SECURE === 'true';
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: 'lax',
      maxAge: expiresAt - Date.now()
    });

    return res.json({ accessToken, user: stored.user.toJSON() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function logout(req, res) {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (token) {
      try {
        const payload = verifyRefreshToken(token);
        const jti = payload.jti || payload.jti;
        const stored = await RefreshToken.findOne({ token: jti });
        if (stored && stored.isActive) {
          stored.revokedAt = new Date();
          await stored.save();
        }
      } catch (e) {
        // ignore invalid token
      }
    }

    // clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax'
    });

    return res.json({ message: 'Logged out' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// Revoke all refresh tokens and increment token version — forces all devices to re-login
async function revokeAll(req, res) {
  try {
    const user = req.user;
    await RefreshToken.updateMany({ user: user._id, revokedAt: null }, { revokedAt: new Date() });
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();
    res.clearCookie('refreshToken');
    return res.json({ message: 'All sessions revoked' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  register,
  verifyEmail,
  login,
  refreshTokenHandler,
  logout,
  revokeAll,
  recordFailedAttempt
};
