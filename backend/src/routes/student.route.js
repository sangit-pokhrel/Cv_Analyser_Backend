const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { requireAuth, permit } = require('../middlewares/auth.middleware');

// All routes require authentication and job_seeker role
router.use(requireAuth);
router.use(permit('job_seeker'));

// ==================== INTERVIEW ASSESSMENTS ====================
/**
 * @route   GET /user/interviews/pending
 * @desc    Get pending interview assessments
 * @access  Job Seeker
 */
router.get('/interviews/pending', studentController.getPendingInterviews);

/**
 * @route   GET /user/interviews/:token
 * @desc    Access interview assessment (ONE-TIME LINK)
 * @access  Job Seeker
 */
router.get('/interviews/:token', studentController.accessInterview);

/**
 * @route   POST /user/interviews/:interviewId/submit
 * @desc    Submit interview assessment
 * @access  Job Seeker
 */
router.post('/interviews/:interviewId/submit', studentController.submitInterview);

/**
 * @route   GET /user/interviews/submissions
 * @desc    Get my interview submissions
 * @access  Job Seeker
 */
router.get('/interviews/submissions', studentController.getMySubmissions);

/**
 * @route   GET /user/interviews/submissions/:submissionId
 * @desc    Get submission result
 * @access  Job Seeker
 */
router.get('/interviews/submissions/:submissionId', studentController.getSubmissionResult);

// ==================== VIDEO INTERVIEWS ====================
/**
 * @route   GET /user/interviews/scheduled
 * @desc    Get scheduled video interviews
 * @access  Job Seeker
 */
router.get('/interviews/scheduled', studentController.getScheduledInterviews);

/**
 * @route   GET /user/interviews/video/:interviewId
 * @desc    Get video interview details
 * @access  Job Seeker
 */
router.get('/interviews/video/:interviewId', studentController.getVideoInterviewDetails);

/**
 * @route   POST /user/interviews/video/:interviewId/join
 * @desc    Join video interview
 * @access  Job Seeker
 */
router.post('/interviews/video/:interviewId/join', studentController.joinVideoInterview);

/**
 * @route   POST /user/interviews/video/:interviewId/feedback
 * @desc    Submit interview feedback
 * @access  Job Seeker
 */
router.post('/interviews/video/:interviewId/feedback', studentController.submitInterviewFeedback);

// ==================== ASSIGNMENTS ====================
/**
 * @route   GET /user/assignments
 * @desc    Get my assignments
 * @access  Job Seeker
 */
router.get('/assignments', studentController.getMyAssignments);

/**
 * @route   GET /user/assignments/:assignmentId
 * @desc    Get assignment details
 * @access  Job Seeker
 */
router.get('/assignments/:assignmentId', studentController.getAssignmentDetails);

/**
 * @route   POST /user/assignments/:assignmentId/submit
 * @desc    Submit assignment
 * @access  Job Seeker
 */
router.post('/assignments/:assignmentId/submit', studentController.submitAssignment);

module.exports = router;
