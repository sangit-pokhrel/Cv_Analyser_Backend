const express = require('express');
const router = express.Router();
const coachController = require('../controllers/coach.controller');
const { requireAuth, permit } = require('../middlewares/auth.middleware');

// All routes require authentication and career_coach role
router.use(requireAuth);
router.use(permit('career_coach'));

// ==================== DASHBOARD ====================
/**
 * @route   GET /coach/dashboard
 * @desc    Get coach dashboard statistics
 * @access  Career Coach
 */
router.get('/dashboard', coachController.getDashboard);

// ==================== STUDENTS ====================
/**
 * @route   GET /coach/students
 * @desc    Get assigned students
 * @access  Career Coach
 */
router.get('/students', coachController.getAssignedStudents);

/**
 * @route   GET /coach/students/:studentId
 * @desc    Get student details and history
 * @access  Career Coach
 */
router.get('/students/:studentId', coachController.getStudentDetails);

// ==================== INTERVIEW REQUESTS ====================
/**
 * @route   POST /coach/interviews/create
 * @desc    Create and send interview assessment
 * @access  Career Coach
 */
router.post('/interviews/create', coachController.createInterviewRequest);

/**
 * @route   GET /coach/interviews
 * @desc    Get all interview requests
 * @access  Career Coach
 */
router.get('/interviews', coachController.getInterviewRequests);

// ==================== SUBMISSIONS ====================
/**
 * @route   GET /coach/submissions
 * @desc    Get student submissions to review
 * @access  Career Coach
 */
router.get('/submissions', coachController.getSubmissions);

/**
 * @route   GET /coach/submissions/:submissionId
 * @desc    Get submission details
 * @access  Career Coach
 */
router.get('/submissions/:submissionId', coachController.getSubmissionDetails);

/**
 * @route   PUT /coach/submissions/:submissionId/review
 * @desc    Review and approve/reject submission
 * @access  Career Coach
 */
router.put('/submissions/:submissionId/review', coachController.reviewSubmission);

// ==================== VIDEO INTERVIEWS ====================
/**
 * @route   POST /coach/video-interviews/schedule
 * @desc    Schedule video interview after approval
 * @access  Career Coach
 */
router.post('/video-interviews/schedule', coachController.scheduleVideoInterview);

/**
 * @route   GET /coach/video-interviews
 * @desc    Get scheduled video interviews
 * @access  Career Coach
 */
router.get('/video-interviews', coachController.getScheduledInterviews);

/**
 * @route   PUT /coach/video-interviews/:interviewId
 * @desc    Update video interview
 * @access  Career Coach
 */
router.put('/video-interviews/:interviewId', coachController.updateVideoInterview);

/**
 * @route   DELETE /coach/video-interviews/:interviewId/cancel
 * @desc    Cancel video interview
 * @access  Career Coach
 */
router.delete('/video-interviews/:interviewId/cancel', coachController.cancelVideoInterview);

// ==================== ASSIGNMENTS ====================
/**
 * @route   POST /coach/assignments
 * @desc    Create assignment
 * @access  Career Coach
 */
router.post('/assignments', coachController.createAssignment);

/**
 * @route   GET /coach/assignments
 * @desc    Get all assignments
 * @access  Career Coach
 */
router.get('/assignments', coachController.getAssignments);

/**
 * @route   GET /coach/assignments/eligible-students
 * @desc    Get eligible students (interviewed or premium)
 * @access  Career Coach
 */
router.get('/assignments/eligible-students', coachController.getEligibleStudents);

/**
 * @route   PUT /coach/assignments/:assignmentId/review/:studentId
 * @desc    Review and grade assignment submission
 * @access  Career Coach
 */
router.put('/assignments/:assignmentId/review/:studentId', coachController.reviewAssignmentSubmission);

module.exports = router;
