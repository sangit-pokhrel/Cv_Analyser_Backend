// /**
//  * Recommendation Routes
//  * 
//  * All routes require authentication
//  */

// const express = require('express');
// const router = express.Router();
// const recommendationController = require('../controllers/recommendation.controller');
// const { authenticateToken } = require('../middlewares/auth.middleware');

// // All routes require authentication
// router.use(authenticateToken);

// /**
//  * @route   POST /api/v1/recommendations/generate
//  * @desc    Generate job recommendations based on latest CV analysis
//  * @access  Private (job_seeker)
//  * @query   limit (default: 20), minScore (default: 40)
//  */
// router.post('/generate', recommendationController.generateRecommendations);

// /**
//  * @route   GET /api/v1/recommendations/stats
//  * @desc    Get recommendation statistics
//  * @access  Private
//  */
// router.get('/stats', recommendationController.getRecommendationStats);

// /**
//  * @route   GET /api/v1/recommendations
//  * @desc    Get user's job recommendations
//  * @access  Private
//  * @query   status (recommended|viewed|applied|dismissed), limit (default: 20)
//  */
// router.get('/', recommendationController.getRecommendations);

// /**
//  * @route   GET /api/v1/recommendations/:id
//  * @desc    Get single recommendation with details
//  * @access  Private
//  */
// router.get('/:id', recommendationController.getRecommendation);

// /**
//  * @route   PUT /api/v1/recommendations/:id/view
//  * @desc    Mark recommendation as viewed
//  * @access  Private
//  */
// router.put('/:id/view', recommendationController.markAsViewed);

// /**
//  * @route   PUT /api/v1/recommendations/:id/dismiss
//  * @desc    Dismiss a recommendation
//  * @access  Private
//  */
// router.put('/:id/dismiss', recommendationController.dismissRecommendation);

// /**
//  * @route   DELETE /api/v1/recommendations
//  * @desc    Clear all recommendations for user
//  * @access  Private
//  */
// router.delete('/', recommendationController.clearRecommendations);

// module.exports = router;


/**
 * Recommendation Routes
 * 
 * All routes require authentication
 */

const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendation.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

/**
 * @route   POST /api/v1/recommendations/generate
 * @desc    Generate job recommendations based on latest CV analysis
 * @access  Private (job_seeker)
 * @query   limit (default: 20), minScore (default: 40)
 */
router.post('/generate', requireAuth, recommendationController.generateRecommendations);

/**
 * @route   GET /api/v1/recommendations/stats
 * @desc    Get recommendation statistics
 * @access  Private
 */
router.get('/stats', requireAuth, recommendationController.getRecommendationStats);

/**
 * @route   GET /api/v1/recommendations
 * @desc    Get user's job recommendations
 * @access  Private
 * @query   status (recommended|viewed|applied|dismissed), limit (default: 20)
 */
router.get('/', requireAuth, recommendationController.getRecommendations);

/**
 * @route   GET /api/v1/recommendations/:id
 * @desc    Get single recommendation with details
 * @access  Private
 */
router.get('/:id', requireAuth, recommendationController.getRecommendation);

/**
 * @route   PUT /api/v1/recommendations/:id/view
 * @desc    Mark recommendation as viewed
 * @access  Private
 */
router.put('/:id/view', requireAuth, recommendationController.markAsViewed);

/**
 * @route   PUT /api/v1/recommendations/:id/dismiss
 * @desc    Dismiss a recommendation
 * @access  Private
 */
router.put('/:id/dismiss', requireAuth, recommendationController.dismissRecommendation);

/**
 * @route   DELETE /api/v1/recommendations
 * @desc    Clear all recommendations for user
 * @access  Private
 */
router.delete('/', requireAuth, recommendationController.clearRecommendations);

module.exports = router;