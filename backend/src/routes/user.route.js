// const express = require('express');
// const router = express.Router();

// const {
//   createUser,
//   getMe,
//   getUserById,
//   listUsers,
//   updateMe,
//   changePassword,
//   deactivateAccount,
//   hardDeleteAccount,
//   updateProfile,
//   updateUserProfileByAdmin
// } = require('../controllers/user.controller');

// const { requireAuth, permit } = require('../middlewares/auth.middleware');

// // Logging middleware to debug route matching
// router.use((req, res, next) => {
//   console.log(`[USER ROUTES] ${req.method} ${req.originalUrl} - ${req.path}`);
//   next();
// });

// // Self routes
// router.get('/me', requireAuth, getMe);
// router.put('/me', requireAuth, updateMe);
// router.put('/me/change-password', requireAuth, changePassword);
// router.delete('/me/deactivate', requireAuth, deactivateAccount);
// router.delete('/me/delete', requireAuth, hardDeleteAccount);
// router.put('/profile', requireAuth, updateProfile);
// // Admin routes
// router.post('/create', requireAuth, permit('admin'), createUser);
// router.get('/', requireAuth, permit('admin'), listUsers);
// router.put('/:id/profile', requireAuth, permit('admin'), updateUserProfileByAdmin); 

// // Parameterized route
// router.get('/:id', requireAuth, getUserById);

// module.exports = router;
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { requireAuth, permit } = require('../middlewares/auth.middleware');

// ==================== PUBLIC ROUTES ====================
/**
 * @route   POST /users
 * @desc    Create new user (public registration)
 * @access  Public
 */
router.post('/', userController.createUser);

// ==================== AUTHENTICATED ROUTES ====================
/**
 * @route   GET /users/me
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/me', requireAuth, userController.getMe);

/**
 * @route   PUT /users/me
 * @desc    Update own profile (LIMITED FIELDS)
 * @access  Private
 */
router.put('/me', requireAuth, userController.updateProfile);

/**
 * @route   PUT /users/me/change-password
 * @desc    Change own password
 * @access  Private
 */
router.put('/me/change-password', requireAuth, userController.changePassword);

/**
 * @route   DELETE /users/me
 * @desc    Deactivate own account
 * @access  Private
 */
router.delete('/me', requireAuth, userController.deactivateAccount);

// ==================== ADMIN ROUTES ====================
/**
 * @route   GET /users
 * @desc    List all users
 * @access  Admin only
 */
router.get('/', requireAuth, permit('admin'), userController.listUsers);

/**
 * @route   GET /users/:id
 * @desc    Get user by ID
 * @access  Private (own profile) or Admin
 */
router.get('/:id', requireAuth, userController.getUserById);

/**
 * @route   PUT /users/:id
 * @desc    Update user by ID (ALL FIELDS)
 * @access  Admin only
 */
router.put('/:id', requireAuth, permit('admin'), userController.updateUserByAdmin);

/**
 * @route   PUT /users/:id/reset-password
 * @desc    Reset user password
 * @access  Admin only
 */
router.put('/:id/reset-password', requireAuth, permit('admin'), userController.resetUserPasswordByAdmin);

/**
 * @route   DELETE /users/:id
 * @desc    Delete user permanently
 * @access  Admin only
 */
router.delete('/:id', requireAuth, permit('admin'), userController.deleteUserByAdmin);

module.exports = router;