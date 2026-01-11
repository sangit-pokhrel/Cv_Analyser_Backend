/**
 * Job Recommendation Service
 * 
 * This service provides intelligent job matching based on:
 * - Recent CV analysis (ATS score, skills detected)
 * - User profile skills
 * - Job requirements
 * - Experience level matching
 * - Location preferences
 */

const JobMatch = require('../models/jobMatch.model');
const Job = require('../models/job.model');
const CVAnalysis = require('../models/cvAnlalysis.model');
const User = require('../models/user.model');

/**
 * Calculate skill match percentage
 */
function calculateSkillMatch(userSkills, jobSkills) {
  if (!jobSkills || jobSkills.length === 0) {
    return { score: 0, matched: [], missing: jobSkills || [] };
  }

  // Normalize skills (lowercase, trim)
  const normalizedUserSkills = userSkills.map(s => s.toLowerCase().trim());
  const normalizedJobSkills = jobSkills.map(s => s.toLowerCase().trim());

  // Find matches
  const matchedSkills = normalizedJobSkills.filter(jobSkill =>
    normalizedUserSkills.some(userSkill => 
      userSkill.includes(jobSkill) || jobSkill.includes(userSkill)
    )
  );

  const missingSkills = normalizedJobSkills.filter(jobSkill =>
    !matchedSkills.includes(jobSkill)
  );

  const score = normalizedJobSkills.length > 0
    ? Math.round((matchedSkills.length / normalizedJobSkills.length) * 100)
    : 0;

  return {
    score,
    matched: matchedSkills,
    missing: missingSkills
  };
}

/**
 * Calculate experience match
 */
function calculateExperienceMatch(userExperience, jobExperienceLevel) {
  if (!userExperience || !jobExperienceLevel) return 50; // Neutral

  const experienceMap = {
    'entry': { min: 0, max: 2 },
    'mid': { min: 2, max: 5 },
    'senior': { min: 5, max: 100 }
  };

  const jobRange = experienceMap[jobExperienceLevel];
  if (!jobRange) return 50;

  // Check if user experience falls in range
  if (userExperience >= jobRange.min && userExperience <= jobRange.max) {
    return 100; // Perfect match
  } else if (userExperience < jobRange.min) {
    return Math.max(0, 100 - (jobRange.min - userExperience) * 20); // Penalty for less experience
  } else {
    return Math.max(50, 100 - (userExperience - jobRange.max) * 10); // Small penalty for overqualified
  }
}

/**
 * Calculate location match
 */
function calculateLocationMatch(userLocation, jobLocation) {
  if (!userLocation || !jobLocation) return 50; // Neutral

  // Exact match
  if (userLocation.toLowerCase() === jobLocation.toLowerCase()) {
    return 100;
  }

  // Partial match (same city or region)
  if (userLocation.toLowerCase().includes(jobLocation.toLowerCase()) ||
      jobLocation.toLowerCase().includes(userLocation.toLowerCase())) {
    return 75;
  }

  // Remote jobs always match
  if (jobLocation.toLowerCase().includes('remote')) {
    return 90;
  }

  return 30; // Different location
}

/**
 * Calculate overall match score
 */
function calculateOverallScore(matchingCriteria, atsScore) {
  // Weights
  const weights = {
    skills: 0.50,      // 50% - Most important
    experience: 0.20,  // 20%
    location: 0.15,    // 15%
    ats: 0.15          // 15% - ATS score bonus
  };

  const skillScore = matchingCriteria.skillsMatch || 0;
  const expScore = matchingCriteria.experienceMatch || 50;
  const locScore = matchingCriteria.locationMatch || 50;
  const atsBonus = atsScore ? Math.min(atsScore, 100) : 50; // Use ATS score as bonus

  const overallScore = (
    skillScore * weights.skills +
    expScore * weights.experience +
    locScore * weights.location +
    atsBonus * weights.ats
  );

  return Math.round(overallScore);
}

/**
 * Generate job recommendations for a user based on latest CV analysis
 * 
 * @param {ObjectId} userId - User ID
 * @param {Object} options - Options { limit, minScore }
 * @returns {Array} Recommendations with scores
 */
async function generateRecommendations(userId, options = {}) {
  try {
    const { limit = 20, minScore = 40 } = options;

    console.log(`🎯 Generating recommendations for user: ${userId}`);

    // Step 1: Get user data
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Step 2: Get latest completed CV analysis
    const latestAnalysis = await CVAnalysis.findOne({
      user: userId,
      status: 'done'
    }).sort({ analyzedAt: -1 });

    if (!latestAnalysis) {
      console.log('⚠️ No completed CV analysis found');
      return {
        success: false,
        message: 'Please complete a CV analysis first to get personalized recommendations'
      };
    }

    console.log(`✅ Found CV analysis: ${latestAnalysis._id}`);
    console.log(`   ATS Score: ${latestAnalysis.overallScore}/100`);
    console.log(`   Skills detected: ${latestAnalysis.skillsDetected?.length || 0}`);

    // Step 3: Combine skills from profile + CV analysis
    const userSkills = [
      ...(user.skills || []),
      ...(latestAnalysis.skillsDetected || [])
    ].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates

    console.log(`   Total unique skills: ${userSkills.length}`);

    // Step 4: Get user experience from analysis
    const userExperience = latestAnalysis.extractedData?.totalYearsExperience || 0;

    // Step 5: Fetch active jobs
    const activeJobs = await Job.find({ status: 'active' })
      .populate('category')
      .lean();

    console.log(`📊 Found ${activeJobs.length} active jobs`);

    if (activeJobs.length === 0) {
      return {
        success: true,
        recommendations: [],
        message: 'No active jobs available at the moment'
      };
    }

    // Step 6: Calculate match scores for each job
    const matches = [];

    for (const job of activeJobs) {
      // Skip if no required skills
      if (!job.requiredSkills || job.requiredSkills.length === 0) {
        continue;
      }

      // Calculate matching criteria
      const skillMatch = calculateSkillMatch(userSkills, job.requiredSkills);
      const expMatch = calculateExperienceMatch(userExperience, job.experienceLevel);
      const locMatch = calculateLocationMatch(user.location, job.location);

      const matchingCriteria = {
        skillsMatch: skillMatch.score,
        experienceMatch: expMatch,
        locationMatch: locMatch,
        matchedSkills: skillMatch.matched,
        missingSkills: skillMatch.missing
      };

      // Calculate overall score
      const overallScore = calculateOverallScore(
        matchingCriteria,
        latestAnalysis.overallScore
      );

      // Only include if meets minimum score
      if (overallScore >= minScore) {
        matches.push({
          job,
          matchScore: overallScore,
          matchingCriteria
        });
      }
    }

    // Step 7: Sort by match score (highest first)
    matches.sort((a, b) => b.matchScore - a.matchScore);

    // Step 8: Limit results
    const topMatches = matches.slice(0, limit);

    console.log(`✅ Generated ${topMatches.length} recommendations (min score: ${minScore})`);

    // Step 9: Save to database
    const savedMatches = [];
    for (let i = 0; i < topMatches.length; i++) {
      const match = topMatches[i];

      // Check if match already exists
      const existing = await JobMatch.findOne({
        user: userId,
        job: match.job._id,
        cvAnalysis: latestAnalysis._id
      });

      if (existing) {
        // Update existing
        existing.matchScore = match.matchScore;
        existing.matchingCriteria = match.matchingCriteria;
        existing.rank = i + 1;
        await existing.save();
        savedMatches.push(existing);
      } else {
        // Create new
        const newMatch = await JobMatch.create({
          user: userId,
          job: match.job._id,
          cvAnalysis: latestAnalysis._id,
          matchScore: match.matchScore,
          matchingCriteria: match.matchingCriteria,
          rank: i + 1,
          status: 'recommended'
        });
        savedMatches.push(newMatch);
      }
    }

    // Mark analysis as having triggered matching
    latestAnalysis.matchingTriggered = true;
    latestAnalysis.matchingTriggeredAt = new Date();
    await latestAnalysis.save();

    return {
      success: true,
      recommendations: savedMatches,
      analysisId: latestAnalysis._id,
      totalMatches: topMatches.length,
      message: `Found ${topMatches.length} job matches based on your profile and CV analysis`
    };

  } catch (error) {
    console.error('❌ Recommendation error:', error);
    throw error;
  }
}

/**
 * Get user's recommendations (with populated job details)
 */
async function getUserRecommendations(userId, options = {}) {
  try {
    const { status = 'recommended', limit = 20 } = options;

    const recommendations = await JobMatch.find({
      user: userId,
      ...(status && { status })
    })
      .populate({
        path: 'job',
        populate: { path: 'category' }
      })
      .populate('cvAnalysis')
      .sort({ matchScore: -1, rank: 1 })
      .limit(limit)
      .lean();

    return recommendations;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
}

/**
 * Mark recommendation as viewed
 */
async function markAsViewed(matchId, userId) {
  try {
    const match = await JobMatch.findOne({
      _id: matchId,
      user: userId
    });

    if (!match) {
      throw new Error('Recommendation not found');
    }

    if (match.status === 'recommended') {
      match.status = 'viewed';
      match.viewedAt = new Date();
      await match.save();
    }

    return match;
  } catch (error) {
    console.error('Error marking as viewed:', error);
    throw error;
  }
}

/**
 * Dismiss recommendation
 */
async function dismissRecommendation(matchId, userId) {
  try {
    const match = await JobMatch.findOne({
      _id: matchId,
      user: userId
    });

    if (!match) {
      throw new Error('Recommendation not found');
    }

    match.status = 'dismissed';
    match.dismissedAt = new Date();
    await match.save();

    return match;
  } catch (error) {
    console.error('Error dismissing recommendation:', error);
    throw error;
  }
}

/**
 * Clear old recommendations (when new analysis is done)
 */
async function clearOldRecommendations(userId, keepAnalysisId) {
  try {
    // Delete recommendations from old analyses
    const result = await JobMatch.deleteMany({
      user: userId,
      cvAnalysis: { $ne: keepAnalysisId }
    });

    console.log(`🗑️ Cleared ${result.deletedCount} old recommendations`);
    return result;
  } catch (error) {
    console.error('Error clearing old recommendations:', error);
    throw error;
  }
}

module.exports = {
  generateRecommendations,
  getUserRecommendations,
  markAsViewed,
  dismissRecommendation,
  clearOldRecommendations,
  calculateSkillMatch,
  calculateOverallScore
};