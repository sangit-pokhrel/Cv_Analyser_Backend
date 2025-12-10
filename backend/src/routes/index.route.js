const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes')); 
router.use('/users', require('./userRoutes'));
router.use('/profiles', require('./profileRoutes'));
router.use('/jobs', require('./jobsRoutes'));
router.use('/categories', require('./categoryRoutes'));
router.use('/applications', require('./applicationRoutes'));
router.use('/saved-jobs', require('./savedJobsRoutes'));
router.use('/support', require('./supportRoutes'));
router.use('/contact', require('./contactRoutes'));
router.use('/cv', require('./cvRoutes'));
router.use('/coaching', require('./coachingRoutes'));
router.use('/notifications', require('./notificationRoutes'));
router.use('/admin', require('./adminRoutes'));

module.exports = router;
