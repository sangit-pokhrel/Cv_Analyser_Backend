const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.route')); 
router.use('/users', require('./user.route'));
router.use('/profiles', require('./profile.route'));
router.use('/jobs', require('./jobs.route'));
// router.use('/categories', require('./category.route'));
router.use('/applications', require('./application.route'));
router.use('/saved-jobs', require('./savedJobs.route'));
router.use('/support', require('./support.route'));
router.use('/contact', require('./contact.route'));
router.use('/cv', require('./cv.route'));
// router.use('/coaching', require('./coaching.route'));
// router.use('/notifications', require('./notification.route'));
router.use('/skills', require('./skill.route'));
router.use('/admin', require('./admin.route'));

module.exports = router;







