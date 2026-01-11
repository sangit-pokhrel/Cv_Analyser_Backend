

// const crypto = require('crypto');
// const { v4: uuidv4 } = require('uuid');
// const User = require('../models/user.model');
// const RefreshToken = require('../models/refreshToken.model');
// const VerificationToken = require('../models/verificationToken.model');
// const { signAccessToken, signRefreshToken, verifyRefreshToken, REFRESH_EXPIRES } = require('../../utils/jwt.utils');
// const { sendEmail, verificationEmail } = require('../../utils/email.utils');
// const { validateRegister } = require('../../utils/validators.utils');

// const LoginAttempt = require('../models/loginAttempt.model');

// const ms = (str) => {
//   // crude parse: support number + 'd' or 'h' or 'm'
//   if (typeof str === 'number') return str;
//   const n = parseInt(str,10);
//   if (str.endsWith('d')) return n * 24 * 60 * 60 * 1000;
//   if (str.endsWith('h')) return n * 60 * 60 * 1000;
//   if (str.endsWith('m')) return n * 60 * 1000;
//   return n;
// };


// const MAX_LOGIN_ATTEMPTS = 3;
// const BLOCK_DURATION = 24 * 60 * 60 * 1000; // 24 hours
// async function register(req, res) {
//   try {
//     console.log('[REGISTER] incoming body:', { ...req.body, password: '<<redacted>>' });

//     const { email, password, firstName, lastName, role } = req.body;
//     const errors = validateRegister({ email, password });
//     if (errors.length) {
//       console.log('[REGISTER] validation failed:', errors);
//       return res.status(400).json({ errors });
//     }

//     const existing = await User.findOne({ email });
//     if (existing) {
//       console.log('[REGISTER] email exists:', email);
//       return res.status(400).json({ error: 'Email already in use' });
//     }

//     // create user and save
//     const user = new User({ email, password, firstName, lastName, role });
//     await user.save();
//     console.log('[REGISTER] user saved:', user._id);

//     // create verification token record
//     const token = uuidv4();
//     const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
//     await VerificationToken.create({ user: user._id, token, type: 'email_verify', expiresAt });
//     console.log('[REGISTER] verification token stored:', token);

//     // Send email ASYNCHRONOUSLY (do not await) so email issues do not hang the response.
//     // We still log failures, but won't block the user response.
//     (async () => {
//       try {
//         const mail = verificationEmail({ user, token });
//         await sendEmail(mail);
//         console.log('[REGISTER] verification email sent to', user.email);
//       } catch (mailErr) {
//         console.warn('[REGISTER] failed to send verification email (non-blocking):', mailErr && mailErr.message);
//       }
//     })();

//     // Respond to client immediately
//     return res.status(201).json({
//       message: 'Registered. Check email to verify account.',
//       user: user.toJSON()
//     });

//   } catch (err) {
//     console.error('[REGISTER] unexpected error:', err);
//     // safe fallback response
//     return res.status(500).json({ error: 'Server error during registration' });
//   }
// }

// async function verifyEmail(req, res) {
//   try {
//     const { token } = req.query;
//     if (!token) return res.status(400).json({ error: 'Token required' });

//     const record = await VerificationToken.findOne({ token, type: 'email_verify' }).populate('user');
//     if (!record) return res.status(400).json({ error: 'Invalid token' });
//     if (record.expiresAt < new Date()) return res.status(400).json({ error: 'Token expired' });
//     if (record.consumed) return res.status(400).json({ error: 'Token already used' });

//     const user = record.user;
//     user.isEmailVerified = true;
//     user.status = 'active';
//     await user.save();

//     record.consumed = true;
//     await record.save();

//     return res.json({ message: 'Email verified successfully' });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Server error' });
//   }
// }

// // async function login(req, res) {
// //   try {
// //     const { email, password } = req.body;
// //     if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

// //     const user = await User.findOne({ email });
// //     if (!user) return res.status(400).json({ error: 'Invalid credentials' });

// //     // simple lockout check
// //     if (user.lockUntil && user.lockUntil > new Date()) {
// //       return res.status(403).json({ error: 'Account temporarily locked due to failed attempts' });
// //     }

// //     const isMatch = await user.comparePassword(password);
// //     if (!isMatch) {
// //       user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
// //       if (user.failedLoginAttempts >= 5) {
// //         user.lockUntil = new Date(Date.now() + (15 * 60 * 1000)); // 15min lock
// //         user.failedLoginAttempts = 0;
// //       }
// //       await user.save();
// //       return res.status(400).json({ error: 'Invalid credentials' });
// //     }

// //     // reset failed attempts
// //     user.failedLoginAttempts = 0;
// //     user.lockUntil = undefined;
// //     user.lastLoginAt = new Date();
// //     await user.save();

// //     // create access token
// //     const accessToken = signAccessToken(user);

// //     // create refresh token record with random jti
// //     const jti = uuidv4();
// //     const refreshPayload = { userId: user._id.toString(), jti, tokenVersion: user.tokenVersion || 0 };
// //     const refreshToken = signRefreshToken(refreshPayload);

// //     const expiresAt = new Date(Date.now() + ms(process.env.REFRESH_TOKEN_EXP || '7d'));
// //     await RefreshToken.create({
// //       user: user._id,
// //       token: jti,
// //       createdByIp: req.ip,
// //       expiresAt
// //     });

// //     // set refresh token as httpOnly cookie
// //     const cookieSecure = process.env.COOKIE_SECURE === 'true';
// //     res.cookie('refreshToken', refreshToken, {
// //       httpOnly: true,
// //       secure: cookieSecure,
// //       sameSite: 'lax',
// //       maxAge: expiresAt - Date.now()
// //     });

// //     return res.json({ accessToken, user: user.toJSON() });
// //   } catch (err) {
// //     console.error(err);
// //     return res.status(500).json({ error: 'Server error' });
// //   }
// // }

// async function login(req, res) {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

//     const ipAddress = req.ip || req.connection.remoteAddress;
//     const userAgent = req.headers['user-agent'];

//     // Clean expired blocks
//     await LoginAttempt.cleanExpiredBlocks();

//     // Check for login attempts
//     let loginAttempt = await LoginAttempt.findOne({ email: email.toLowerCase() });

//     // Check if blocked
//     if (loginAttempt && loginAttempt.isCurrentlyBlocked()) {
//       const timeRemaining = loginAttempt.blockedUntil 
//         ? Math.ceil((loginAttempt.blockedUntil - new Date()) / (1000 * 60))
//         : null;

//       return res.status(403).json({ 
//         error: 'Account temporarily blocked',
//         message: timeRemaining 
//           ? `Too many failed login attempts. Try again in ${timeRemaining} minutes.`
//           : 'Account blocked. Contact administrator.',
//         isBlocked: true,
//         blockedUntil: loginAttempt.blockedUntil
//       });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       await recordFailedAttempt(email, ipAddress, userAgent, loginAttempt);
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     // simple lockout check (legacy)
//     if (user.lockUntil && user.lockUntil > new Date()) {
//       return res.status(403).json({ error: 'Account temporarily locked due to failed attempts' });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       // Record failed attempt
//       const attemptsLeft = await recordFailedAttempt(email, ipAddress, userAgent, loginAttempt);
      
//       // Legacy tracking
//       user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
//       if (user.failedLoginAttempts >= 5) {
//         user.lockUntil = new Date(Date.now() + (15 * 60 * 1000)); // 15min lock
//         user.failedLoginAttempts = 0;
//       }
//       await user.save();

//       if (attemptsLeft === 0) {
//         return res.status(403).json({ 
//           error: 'Account blocked',
//           message: 'Too many failed attempts. Account blocked for 24 hours.',
//           isBlocked: true
//         });
//       }

//       return res.status(400).json({ 
//         error: 'Invalid credentials',
//         attemptsLeft,
//         message: `Invalid password. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`
//       });
//     }

//     // ✅ SUCCESS - Reset attempts
//     if (loginAttempt) {
//       await loginAttempt.resetAttempts();
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

//     // Also set accessToken cookie
//     res.cookie('accessToken', accessToken, {
//       httpOnly: true,
//       secure: cookieSecure,
//       sameSite: 'lax',
//       maxAge: 15 * 60 * 1000 // 15 minutes
//     });

//     return res.json({ 
//       success: true,
//       accessToken, 
//       user: user.toJSON() 
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Server error' });
//   }
// }

// // ADD THIS HELPER FUNCTION at the bottom before module.exports
// async function recordFailedAttempt(email, ipAddress, userAgent, existingAttempt) {
//   try {
//     if (!existingAttempt) {
//       await LoginAttempt.create({
//         email: email.toLowerCase(),
//         ipAddress,
//         userAgent,
//         attemptCount: 1,
//         attempts: [{ timestamp: new Date(), ipAddress, userAgent, success: false }]
//       });
//       return MAX_LOGIN_ATTEMPTS - 1;
//     }

//     existingAttempt.attemptCount += 1;
//     existingAttempt.lastAttemptAt = new Date();
//     existingAttempt.ipAddress = ipAddress;
//     existingAttempt.attempts.push({ timestamp: new Date(), ipAddress, userAgent, success: false });

//     if (existingAttempt.attemptCount >= MAX_LOGIN_ATTEMPTS) {
//       existingAttempt.isBlocked = true;
//       existingAttempt.blockedUntil = new Date(Date.now() + BLOCK_DURATION);
//       await existingAttempt.save();
//       return 0;
//     }

//     await existingAttempt.save();
//     return MAX_LOGIN_ATTEMPTS - existingAttempt.attemptCount;
//   } catch (error) {
//     console.error('Error recording failed attempt:', error);
//     return MAX_LOGIN_ATTEMPTS - 1;
//   }
// }

// async function refreshTokenHandler(req, res) {
//   try {
//     const token = req.cookies.refreshToken || req.body.refreshToken;
//     if (!token) return res.status(401).json({ error: 'No refresh token provided' });

//     let payload;
//     try {
//       payload = verifyRefreshToken(token);
//     } catch (e) {
//       return res.status(401).json({ error: 'Invalid refresh token' });
//     }

//     const { jti, userId } = payload;
//     // find persisted refresh token by jti
//     const stored = await RefreshToken.findOne({ token: jti }).populate('user');
//     if (!stored || !stored.isActive) {
//       return res.status(401).json({ error: 'Refresh token revoked or expired' });
//     }

//     // Token rotation: revoke current stored token and issue a new one replacing it
//     stored.revokedAt = new Date();
//     stored.replacedByToken = uuidv4();
//     await stored.save();

//     // create new saved refresh token
//     const newJti = stored.replacedByToken;
//     const newRefreshPayload = { userId: stored.user._id.toString(), jti: newJti, tokenVersion: stored.user.tokenVersion || 0 };
//     const newRefreshToken = signRefreshToken(newRefreshPayload);
//     const expiresAt = new Date(Date.now() + ms(process.env.REFRESH_TOKEN_EXP || '7d'));
//     await RefreshToken.create({ user: stored.user._id, token: newJti, createdByIp: req.ip, expiresAt });

//     // issue new access token
//     const accessToken = signAccessToken(stored.user);

//     // set cookie
//     const cookieSecure = process.env.COOKIE_SECURE === 'true';
//     res.cookie('refreshToken', newRefreshToken, {
//       httpOnly: true,
//       secure: cookieSecure,
//       sameSite: 'lax',
//       maxAge: expiresAt - Date.now()
//     });

//     return res.json({ accessToken, user: stored.user.toJSON() });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Server error' });
//   }
// }

// async function logout(req, res) {
//   try {
//     const token = req.cookies.refreshToken || req.body.refreshToken;
//     if (token) {
//       try {
//         const payload = verifyRefreshToken(token);
//         const jti = payload.jti || payload.jti;
//         const stored = await RefreshToken.findOne({ token: jti });
//         if (stored && stored.isActive) {
//           stored.revokedAt = new Date();
//           await stored.save();
//         }
//       } catch (e) {
//         // ignore invalid token
//       }
//     }

//     // clear cookie
//     res.clearCookie('refreshToken', {
//       httpOnly: true,
//       secure: process.env.COOKIE_SECURE === 'true',
//       sameSite: 'lax'
//     });

//     return res.json({ message: 'Logged out' });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Server error' });
//   }
// }

// // Revoke all refresh tokens and increment token version — forces all devices to re-login
// async function revokeAll(req, res) {
//   try {
//     const user = req.user;
//     await RefreshToken.updateMany({ user: user._id, revokedAt: null }, { revokedAt: new Date() });
//     user.tokenVersion = (user.tokenVersion || 0) + 1;
//     await user.save();
//     res.clearCookie('refreshToken');
//     return res.json({ message: 'All sessions revoked' });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Server error' });
//   }
// }

// module.exports = {
//   register,
//   verifyEmail,
//   login,
//   refreshTokenHandler,
//   logout,
//   revokeAll,
//   recordFailedAttempt
// };



const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user.model');
const OTP = require('../models/otp.model');
const RefreshToken = require('../models/refreshToken.model');
const LoginAttempt = require('../models/loginAttempt.model');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../utils/jwt.utils');
const { sendEmail } = require('../../utils/email.utils');
const { validateRegister } = require('../../utils/validators.utils');

// ==================== CONSTANTS ====================
const MAX_LOGIN_ATTEMPTS = 3;
const BLOCK_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const OTP_EXPIRY_MINUTES = 10;
const OTP_COOLDOWN_SECONDS = 60;

const ms = (str) => {
  if (typeof str === 'number') return str;
  const n = parseInt(str, 10);
  if (str.endsWith('d')) return n * 24 * 60 * 60 * 1000;
  if (str.endsWith('h')) return n * 60 * 60 * 1000;
  if (str.endsWith('m')) return n * 60 * 1000;
  return n;
};

// ==================== EMAIL TEMPLATES ====================
const otpEmailTemplate = ({ user, otp }) => ({
  to: user.email,
  subject: 'Verify Your Email - CV Saathi',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%); border-radius: 16px 16px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">CV Saathi</h1>
                  <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Email Verification</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600;">
                    Hello${user.firstName ? ` ${user.firstName}` : ''}! 👋
                  </h2>
                  <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    Thank you for registering with CV Saathi. To complete your registration and verify your email address, please use the following OTP code:
                  </p>
                  
                  <!-- OTP Box -->
                  <div style="background: linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%); border: 2px dashed #22d3ee; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                    <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                    <div style="font-size: 40px; font-weight: 700; color: #0891b2; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                      ${otp}
                    </div>
                  </div>
                  
                  <p style="margin: 0 0 10px; color: #4b5563; font-size: 14px; line-height: 1.6;">
                    ⏰ This code will expire in <strong>${OTP_EXPIRY_MINUTES} minutes</strong>.
                  </p>
                  <p style="margin: 0 0 20px; color: #4b5563; font-size: 14px; line-height: 1.6;">
                    🔒 If you didn't create an account with CV Saathi, please ignore this email.
                  </p>
                  
                  <!-- Security Note -->
                  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 0 8px 8px 0; margin-top: 30px;">
                    <p style="margin: 0; color: #92400e; font-size: 13px;">
                      <strong>Security Tip:</strong> Never share this OTP with anyone. Our team will never ask for your OTP.
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 16px 16px; text-align: center;">
                  <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                    Need help? Contact us at <a href="mailto:support@cvsaathi.com" style="color: #0891b2; text-decoration: none;">support@cvsaathi.com</a>
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    © ${new Date().getFullYear()} CV Saathi. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
  text: `
    Hello${user.firstName ? ` ${user.firstName}` : ''}!
    
    Thank you for registering with CV Saathi.
    
    Your verification code is: ${otp}
    
    This code will expire in ${OTP_EXPIRY_MINUTES} minutes.
    
    If you didn't create an account, please ignore this email.
    
    - CV Saathi Team
  `
});

// ==================== REGISTER ====================
async function register(req, res) {
  try {
    console.log('[REGISTER] incoming body:', { ...req.body, password: '<<redacted>>' });

    const { email, password, firstName, lastName, phoneNumber } = req.body;
    
    // Validate input
    const errors = validateRegister({ email, password });
    if (errors.length) {
      console.log('[REGISTER] validation failed:', errors);
      return res.status(400).json({ errors });
    }

    // Check if email exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log('[REGISTER] email exists:', email);
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Create user with default 'user' role and pending_verification status
    const user = new User({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      phoneNumber,
      role: 'user', // Always set to 'user' by default
      status: 'pending_verification',
      isEmailVerified: false
    });
    
    await user.save();
    console.log('[REGISTER] user saved:', user._id);

    // Generate OTP
    const { otp } = await OTP.createOTP(user._id, user.email, 'email_verify', OTP_EXPIRY_MINUTES);
    console.log('[REGISTER] OTP generated for user:', user._id);

    // Send OTP email asynchronously
    (async () => {
      try {
        const mail = otpEmailTemplate({ user, otp });
        await sendEmail(mail);
        console.log('[REGISTER] OTP email sent to', user.email);
      } catch (mailErr) {
        console.warn('[REGISTER] failed to send OTP email (non-blocking):', mailErr?.message);
      }
    })();

    // Respond to client
    return res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for the verification code.',
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        isEmailVerified: user.isEmailVerified
      },
      requiresVerification: true,
      otpExpiresIn: OTP_EXPIRY_MINUTES * 60 // in seconds
    });

  } catch (err) {
    console.error('[REGISTER] unexpected error:', err);
    return res.status(500).json({ error: 'Server error during registration' });
  }
}

// ==================== VERIFY OTP ====================
async function verifyOTP(req, res) {
  try {
    const { userId, email, otp } = req.body;

    // Validate input
    if (!otp || otp.length !== 6) {
      return res.status(400).json({ error: 'Invalid OTP format. Must be 6 digits.' });
    }

    if (!userId && !email) {
      return res.status(400).json({ error: 'User ID or email is required' });
    }

    // Find user
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already verified
    if (user.isEmailVerified && user.status === 'verified') {
      return res.status(400).json({ 
        error: 'Email already verified',
        isVerified: true 
      });
    }

    // Verify OTP
    const result = await OTP.verifyOTP(user._id, otp, 'email_verify');

    if (!result.valid) {
      const errorMessages = {
        'no_otp_found': 'No valid OTP found. Please request a new one.',
        'already_used': 'This OTP has already been used. Please request a new one.',
        'expired': 'OTP has expired. Please request a new one.',
        'max_attempts': 'Too many invalid attempts. Please request a new OTP.',
        'invalid_otp': `Invalid OTP. ${result.attemptsLeft} attempts remaining.`
      };

      return res.status(400).json({
        error: errorMessages[result.reason] || 'Invalid OTP',
        reason: result.reason,
        attemptsLeft: result.attemptsLeft
      });
    }

    // OTP verified successfully - Update user status
    user.isEmailVerified = true;
    user.status = 'verified';
    await user.save();

    console.log('[VERIFY_OTP] User verified successfully:', user._id);

    // Generate tokens for automatic login after verification
    const accessToken = signAccessToken(user);
    
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

    // Set cookies
    const cookieSecure = process.env.COOKIE_SECURE === 'true';
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: 'lax',
      maxAge: expiresAt - Date.now()
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: false, // Allow frontend to read it
      secure: cookieSecure,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    return res.json({
      success: true,
      message: 'Email verified successfully!',
      isVerified: true,
      accessToken,
      user: user.toJSON()
    });

  } catch (err) {
    console.error('[VERIFY_OTP] error:', err);
    return res.status(500).json({ error: 'Server error during verification' });
  }
}

// ==================== RESEND OTP ====================
async function resendOTP(req, res) {
  try {
    const { userId, email } = req.body;

    if (!userId && !email) {
      return res.status(400).json({ error: 'User ID or email is required' });
    }

    // Find user
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already verified
    if (user.isEmailVerified && user.status === 'verified') {
      return res.status(400).json({ 
        error: 'Email already verified',
        isVerified: true 
      });
    }

    // Check cooldown
    const cooldownCheck = await OTP.canRequestNewOTP(user._id, 'email_verify', OTP_COOLDOWN_SECONDS);
    if (!cooldownCheck.canRequest) {
      return res.status(429).json({
        error: `Please wait ${cooldownCheck.waitTime} seconds before requesting a new OTP`,
        waitTime: cooldownCheck.waitTime
      });
    }

    // Generate new OTP
    const { otp } = await OTP.createOTP(user._id, user.email, 'email_verify', OTP_EXPIRY_MINUTES);
    console.log('[RESEND_OTP] New OTP generated for user:', user._id);

    // Send OTP email
    try {
      const mail = otpEmailTemplate({ user, otp });
      await sendEmail(mail);
      console.log('[RESEND_OTP] OTP email sent to', user.email);
    } catch (mailErr) {
      console.warn('[RESEND_OTP] failed to send OTP email:', mailErr?.message);
      return res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
    }

    return res.json({
      success: true,
      message: 'New OTP sent to your email',
      otpExpiresIn: OTP_EXPIRY_MINUTES * 60 // in seconds
    });

  } catch (err) {
    console.error('[RESEND_OTP] error:', err);
    return res.status(500).json({ error: 'Server error while resending OTP' });
  }
}

// ==================== LOGIN ====================
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Clean expired blocks
    if (LoginAttempt && LoginAttempt.cleanExpiredBlocks) {
      await LoginAttempt.cleanExpiredBlocks();
    }

    // Check for login attempts
    let loginAttempt = null;
    if (LoginAttempt) {
      loginAttempt = await LoginAttempt.findOne({ email: email.toLowerCase() });

      // Check if blocked
      if (loginAttempt && loginAttempt.isCurrentlyBlocked && loginAttempt.isCurrentlyBlocked()) {
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
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      if (LoginAttempt) {
        await recordFailedAttempt(email, ipAddress, userAgent, loginAttempt);
      }
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isEmailVerified || user.status === 'pending_verification') {
      return res.status(403).json({
        error: 'Email not verified',
        message: 'Please verify your email before logging in.',
        requiresVerification: true,
        userId: user._id,
        email: user.email
      });
    }

    // Check user status
    if (user.status === 'deactivated') {
      return res.status(403).json({ error: 'Account has been deactivated. Contact support.' });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({ error: 'Account has been rejected. Contact support.' });
    }

    // Legacy lockout check
    if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(403).json({ error: 'Account temporarily locked due to failed attempts' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Record failed attempt
      let attemptsLeft = MAX_LOGIN_ATTEMPTS - 1;
      if (LoginAttempt) {
        attemptsLeft = await recordFailedAttempt(email, ipAddress, userAgent, loginAttempt);
      }
      
      // Legacy tracking
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + (15 * 60 * 1000));
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

    // SUCCESS - Reset attempts
    if (loginAttempt && loginAttempt.resetAttempts) {
      await loginAttempt.resetAttempts();
    }

    // Reset failed attempts
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLoginAt = new Date();
    await user.save();

    // Create access token
    const accessToken = signAccessToken(user);

    // Create refresh token
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

    // Set cookies
    const cookieSecure = process.env.COOKIE_SECURE === 'true';
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: 'lax',
      maxAge: expiresAt - Date.now()
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: cookieSecure,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000
    });

    return res.json({ 
      success: true,
      accessToken, 
      user: user.toJSON() 
    });
  } catch (err) {
    console.error('[LOGIN] error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// ==================== HELPER: Record Failed Attempt ====================
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

// ==================== REFRESH TOKEN ====================
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

    const { jti } = payload;
    const stored = await RefreshToken.findOne({ token: jti }).populate('user');
    if (!stored || !stored.isActive) {
      return res.status(401).json({ error: 'Refresh token revoked or expired' });
    }

    // Token rotation
    stored.revokedAt = new Date();
    stored.replacedByToken = uuidv4();
    await stored.save();

    // Create new refresh token
    const newJti = stored.replacedByToken;
    const newRefreshPayload = { userId: stored.user._id.toString(), jti: newJti, tokenVersion: stored.user.tokenVersion || 0 };
    const newRefreshToken = signRefreshToken(newRefreshPayload);
    const expiresAt = new Date(Date.now() + ms(process.env.REFRESH_TOKEN_EXP || '7d'));
    await RefreshToken.create({ user: stored.user._id, token: newJti, createdByIp: req.ip, expiresAt });

    // Issue new access token
    const accessToken = signAccessToken(stored.user);

    // Set cookies
    const cookieSecure = process.env.COOKIE_SECURE === 'true';
    
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: 'lax',
      maxAge: expiresAt - Date.now()
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: cookieSecure,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000
    });

    return res.json({ accessToken, user: stored.user.toJSON() });
  } catch (err) {
    console.error('[REFRESH] error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// ==================== LOGOUT ====================
async function logout(req, res) {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (token) {
      try {
        const payload = verifyRefreshToken(token);
        const jti = payload.jti;
        const stored = await RefreshToken.findOne({ token: jti });
        if (stored && stored.isActive) {
          stored.revokedAt = new Date();
          await stored.save();
        }
      } catch (e) {
        // ignore invalid token
      }
    }

    // Clear cookies
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax'
    });
    
    res.clearCookie('accessToken', {
      httpOnly: false,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax'
    });

    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('[LOGOUT] error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// ==================== REVOKE ALL ====================
async function revokeAll(req, res) {
  try {
    const user = req.user;
    await RefreshToken.updateMany({ user: user._id, revokedAt: null }, { revokedAt: new Date() });
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();
    
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    
    return res.json({ success: true, message: 'All sessions revoked' });
  } catch (e) {
    console.error('[REVOKE_ALL] error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
  refreshTokenHandler,
  logout,
  revokeAll,
  recordFailedAttempt
};