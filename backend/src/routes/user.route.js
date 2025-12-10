const express = require('express');
const router = express.Router();

const {
  getMe,
  getUserById,
  listUsers,
  updateMe,
  changePassword,
  deactivateAccount,
  hardDeleteAccount
} = require('../controllers/user.controller');

const { requireAuth, permit } = require('../middlewares/auth.middleware');

// Self routes
router.get('/me', requireAuth, getMe);
router.put('/me', requireAuth, updateMe);
router.put('/me/change-password', requireAuth, changePassword);
router.delete('/me/deactivate', requireAuth, deactivateAccount);
router.delete('/me/delete', requireAuth, hardDeleteAccount);

// Admin routes
router.get('/', requireAuth, permit('admin'), listUsers);
router.get('/:id', requireAuth, getUserById);

module.exports = router;
