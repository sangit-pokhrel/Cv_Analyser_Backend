const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiter.controller');
const { requireAuth, permit } = require('../middlewares/auth.middleware');

// All routes require authentication and recruiter role
router.use(requireAuth);
router.use(permit('recruiter'));

// ==================== DASHBOARD ====================
/**
 * @route   GET /recruiter/dashboard
 * @desc    Get recruiter dashboard statistics
 * @access  Recruiter
 */
router.get('/dashboard', recruiterController.getDashboard);

// ==================== JOB POSTING ====================
/**
 * @route   POST /recruiter/jobs
 * @desc    Create new job posting
 * @access  Recruiter
 */
router.post('/jobs', recruiterController.createJob);

/**
 * @route   GET /recruiter/jobs
 * @desc    Get all jobs posted by recruiter
 * @access  Recruiter
 */
router.get('/jobs', recruiterController.getMyJobs);

/**
 * @route   GET /recruiter/jobs/:jobId
 * @desc    Get job details with applications
 * @access  Recruiter
 */
router.get('/jobs/:jobId', recruiterController.getJobDetails);

/**
 * @route   PUT /recruiter/jobs/:jobId
 * @desc    Update job posting
 * @access  Recruiter
 */
router.put('/jobs/:jobId', recruiterController.updateJob);

/**
 * @route   DELETE /recruiter/jobs/:jobId
 * @desc    Delete job posting (soft delete)
 * @access  Recruiter
 */
router.delete('/jobs/:jobId', recruiterController.deleteJob);

/**
 * @route   PUT /recruiter/jobs/:jobId/close
 * @desc    Close job (stop accepting applications)
 * @access  Recruiter
 */
router.put('/jobs/:jobId/close', recruiterController.closeJob);

// ==================== APPLICATION TRACKING ====================
/**
 * @route   GET /recruiter/jobs/:jobId/applications
 * @desc    Get applications for specific job
 * @access  Recruiter
 */
router.get('/jobs/:jobId/applications', recruiterController.getJobApplications);

/**
 * @route   GET /recruiter/applications
 * @desc    Get all applications across all jobs
 * @access  Recruiter
 */
router.get('/applications', recruiterController.getAllApplications);

/**
 * @route   GET /recruiter/applications/:applicationId
 * @desc    Get application details
 * @access  Recruiter
 */
router.get('/applications/:applicationId', recruiterController.getApplicationDetails);

/**
 * @route   PUT /recruiter/applications/:applicationId/status
 * @desc    Update application status (approve/reject/interview)
 * @access  Recruiter
 */
router.put('/applications/:applicationId/status', recruiterController.updateApplicationStatus);

/**
 * @route   PUT /recruiter/applications/bulk-update
 * @desc    Bulk update application status
 * @access  Recruiter
 */
router.put('/applications/bulk-update', recruiterController.bulkUpdateApplications);

module.exports = router;
