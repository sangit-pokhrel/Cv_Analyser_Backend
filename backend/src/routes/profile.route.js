const express = require('express');
const router = express.Router();
const { getMyProfile, upsertProfile } = require('../controllers/profileController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/me', requireAuth, getMyProfile);
router.put('/me', requireAuth, upsertProfile);

module.exports = router;
