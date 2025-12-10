const express = require('express');
const router = express.Router();

const {
  getMe,
  getUserById,
  listUsers,
  updateMe,
  changePassword,
  deactivateAccount
} = require('../controllers/userController');

const { requireAuth, permit } = require('../middleware/authMiddleware');

// Self routes
router.get('/me', requireAuth, getMe);
router.put('/me', requireAuth, updateMe);
router.put('/me/change-password', requireAuth, changePassword);
router.delete('/me', requireAuth, deactivateAccount);

// Admin routes
router.get('/', requireAuth, permit('admin'), listUsers);
router.get('/:id', requireAuth, getUserById);

module.exports = router;
