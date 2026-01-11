const CVAnalysis = require("../models/cvAnlalysis.model");
const User = require("../models/user.model");
const { performCVAnalysis } = require("../services/cvAnalysis.service");
const {
  generateRecommendations,
  clearOldRecommendations
} = require("../services/recommendation.service");

module.exports = async function processCVAnalysis(job) {
  const { analysisId } = job.data;

  console.log(`📋 Processing CV Analysis Job #${job.id}`);

  try {
    const analysis = await CVAnalysis.findById(analysisId).populate("user");
    if (!analysis) throw new Error("Analysis not found");

    analysis.status = "processing";
    await analysis.save();

    const result = await performCVAnalysis(analysis.cvFileUrl);
    if (!result.success) throw new Error(result.error);

    Object.assign(analysis, {
      status: "done",
      analysisResult: result.analysis,
      overallScore: result.analysis.overallScore,
      skillsDetected: result.analysis.skillsDetected,
      analyzedAt: new Date()
    });

    await analysis.save();

    await clearOldRecommendations(analysis.user._id, analysisId);
    await generateRecommendations(analysis.user._id);

    console.log(`✅ CV Analysis completed (${analysisId})`);
    return { success: true };
  } catch (err) {
    console.error("❌ CV Analysis failed:", err.message);
    throw err;
  }
};
