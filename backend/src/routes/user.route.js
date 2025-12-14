const express = require('express');
const router = express.Router();

const {
  createUser,
  getMe,
  getUserById,
  listUsers,
  updateMe,
  changePassword,
  deactivateAccount,
  hardDeleteAccount,
  updateProfile,
  updateUserProfileByAdmin
} = require('../controllers/user.controller');

const { requireAuth, permit } = require('../middlewares/auth.middleware');

// Logging middleware to debug route matching
router.use((req, res, next) => {
  console.log(`[USER ROUTES] ${req.method} ${req.originalUrl} - ${req.path}`);
  next();
});

// Self routes
router.get('/me', requireAuth, getMe);
router.put('/me', requireAuth, updateMe);
router.put('/me/change-password', requireAuth, changePassword);
router.delete('/me/deactivate', requireAuth, deactivateAccount);
router.delete('/me/delete', requireAuth, hardDeleteAccount);
router.put('/profile', requireAuth, updateProfile);
// Admin routes
router.post('/create', requireAuth, permit('admin'), createUser);
router.get('/', requireAuth, permit('admin'), listUsers);
router.put('/:id/profile', requireAuth, permit('admin'), updateUserProfileByAdmin); 

// Parameterized route
router.get('/:id', requireAuth, getUserById);

module.exports = router;