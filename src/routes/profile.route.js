const express = require('express');
const router = express.Router();
const { getMyProfile, upsertProfile } = require('../controllers/profile.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.get('/me', requireAuth, getMyProfile);
router.put('/me', requireAuth, upsertProfile);

module.exports = router;
