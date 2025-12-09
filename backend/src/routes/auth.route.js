// const express = require('express');
// const { body } = require('express-validator');
// const router = express.Router();
// const authController = require('../controllers/authController');

// // POST /auth/register
// router.post('/register', [
//   body('email').isEmail().withMessage('valid email required'),
//   body('password').isLength({ min: 8 }).withMessage('password must be at least 8 chars'),
//   body('firstName').optional().isString(),
//   body('lastName').optional().isString(),
//   body('role').optional().isIn(['job_seeker', 'employer', 'admin'])
// ], authController.register);


// // POST /auth/login
// router.post('/login', [
//   body('email').isEmail().withMessage('valid email required'),
//   body('password').exists().withMessage('password required')
// ], authController.login);

// module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { createAccountLimiter, authLimiter } = require('../middleware/rateLimiter');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/register', createAccountLimiter, authController.register);

router.get('/verify-email', authController.verifyEmail);

router.post('/login', authLimiter, authController.login);

router.post('/refresh', authController.refreshTokenHandler);

router.post('/logout', authController.logout);

router.post('/revoke-all', requireAuth, authController.revokeAll);

module.exports = router;
