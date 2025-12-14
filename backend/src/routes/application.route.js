// const express = require('express');
// const router = express.Router();
// const ctrl = require('../controllers/application.controller');
// const { requireAuth, permit } = require('../middlewares/auth.middleware');

// router.post('/', requireAuth, permit('user','admin'), ctrl.submitApplication);
// router.get('/', requireAuth, ctrl.listUserApplications);
// router.get('/:id', requireAuth, ctrl.getApplication);
// router.delete('/:id', requireAuth, ctrl.withdrawApplication);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { 
  submitApplication, 
  listUserApplications, 
  getApplication, 
  withdrawApplication,
  updateApplicationStatus,
  listJobApplications,
  listAllApplications,
  deleteApplication
} = require('../controllers/application.controller');
const { requireAuth, permit } = require('../middlewares/auth.middleware');

// User routes
router.post('/', requireAuth, submitApplication);
router.get('/my-applications', requireAuth, listUserApplications);
router.get('/:id', requireAuth, getApplication);
router.delete('/:id', requireAuth, withdrawApplication);

// Employer/Admin routes
router.get('/job/:jobId/applications', requireAuth, permit('admin', 'employer'), listJobApplications);
router.put('/:id/status', requireAuth, permit('admin', 'employer'), updateApplicationStatus);

// Admin-only routes
router.get('/admin/all', requireAuth, permit('admin'), listAllApplications);
router.delete('/admin/:id', requireAuth, permit('admin'), deleteApplication);

module.exports = router;