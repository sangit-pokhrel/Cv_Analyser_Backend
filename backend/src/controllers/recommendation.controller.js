/**
 * Job Recommendation Controller
 * 
 * Endpoints:
 * - POST /recommendations/generate - Generate recommendations for current user
 * - GET /recommendations - Get user's recommendations
 * - PUT /recommendations/:id/view - Mark as viewed
 * - PUT /recommendations/:id/dismiss - Dismiss recommendation
 * - DELETE /recommendations - Clear all recommendations
 */

const recommendationService = require('../services/recommendation.service');
const JobMatch = require('../models/jobMatch.model');

/**
 * Generate recommendations for current user
 * POST //api/v1/recommendations/generate
 */
async function generateRecommendations(req, res) {
  try {
    const userId = req.user._id;
    const { limit = 20, minScore = 40 } = req.query;

    console.log(`🎯 Generating recommendations for user: ${userId}`);

    const result = await recommendationService.generateRecommendations(userId, {
      limit: parseInt(limit),
      minScore: parseInt(minScore)
    });

    if (!result.success) {
      return res.status(400).json({
        error: result.message
      });
    }

    return res.json({
      success: true,
      message: result.message,
      data: {
        recommendations: result.recommendations,
        totalMatches: result.totalMatches,
        analysisId: result.analysisId
      }
    });

  } catch (error) {
    console.error('Generate recommendations error:', error);
    return res.status(500).json({
      error: 'Failed to generate recommendations',
      details: error.message
    });
  }
}

/**
 * Get user's recommendations
 * GET //api/v1/recommendations
 * Query params: status (recommended|viewed|applied|dismissed), limit
 */
async function getRecommendations(req, res) {
  try {
    const userId = req.user._id;
    const { status, limit = 20 } = req.query;

    const recommendations = await recommendationService.getUserRecommendations(userId, {
      status,
      limit: parseInt(limit)
    });

    return res.json({
      success: true,
      data: recommendations,
      count: recommendations.length
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    return res.status(500).json({
      error: 'Failed to fetch recommendations',
      details: error.message
    });
  }
}

/**
 * Get single recommendation with details
 * GET //api/v1/recommendations/:id
 */
async function getRecommendation(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const recommendation = await JobMatch.findOne({
      _id: id,
      user: userId
    })
      .populate({
        path: 'job',
        populate: { path: 'category' }
      })
      .populate('cvAnalysis');

    if (!recommendation) {
      return res.status(404).json({
        error: 'Recommendation not found'
      });
    }

    return res.json({
      success: true,
      data: recommendation
    });

  } catch (error) {
    console.error('Get recommendation error:', error);
    return res.status(500).json({
      error: 'Failed to fetch recommendation',
      details: error.message
    });
  }
}

/**
 * Mark recommendation as viewed
 * PUT //api/v1/recommendations/:id/view
 */
async function markAsViewed(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const match = await recommendationService.markAsViewed(id, userId);

    return res.json({
      success: true,
      message: 'Marked as viewed',
      data: match
    });

  } catch (error) {
    console.error('Mark as viewed error:', error);
    return res.status(500).json({
      error: 'Failed to update recommendation',
      details: error.message
    });
  }
}

/**
 * Dismiss recommendation
 * PUT //api/v1/recommendations/:id/dismiss
 */
async function dismissRecommendation(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const match = await recommendationService.dismissRecommendation(id, userId);

    return res.json({
      success: true,
      message: 'Recommendation dismissed',
      data: match
    });

  } catch (error) {
    console.error('Dismiss recommendation error:', error);
    return res.status(500).json({
      error: 'Failed to dismiss recommendation',
      details: error.message
    });
  }
}

/**
 * Clear all recommendations for user
 * DELETE //api/v1/recommendations
 */
async function clearRecommendations(req, res) {
  try {
    const userId = req.user._id;

    const result = await JobMatch.deleteMany({ user: userId });

    return res.json({
      success: true,
      message: `Cleared ${result.deletedCount} recommendations`
    });

  } catch (error) {
    console.error('Clear recommendations error:', error);
    return res.status(500).json({
      error: 'Failed to clear recommendations',
      details: error.message
    });
  }
}

/**
 * Get recommendation stats for user
 * GET //api/v1/recommendations/stats
 */
async function getRecommendationStats(req, res) {
  try {
    const userId = req.user._id;

    const stats = await JobMatch.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgScore: { $avg: '$matchScore' }
        }
      }
    ]);

    const total = await JobMatch.countDocuments({ user: userId });

    const formattedStats = {
      total,
      byStatus: {}
    };

    stats.forEach(stat => {
      formattedStats.byStatus[stat._id] = {
        count: stat.count,
        averageScore: Math.round(stat.avgScore)
      };
    });

    return res.json({
      success: true,
      data: formattedStats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({
      error: 'Failed to fetch stats',
      details: error.message
    });
  }
}

module.exports = {
  generateRecommendations,
  getRecommendations,
  getRecommendation,
  markAsViewed,
  dismissRecommendation,
  clearRecommendations,
  getRecommendationStats
};