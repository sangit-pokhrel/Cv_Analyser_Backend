// const CVAnalysis = require("../models/cvAnlalysis.model");
// const User = require("../models/user.model");
// const { performCVAnalysis } = require("../services/cvAnalysis.service");
// const {
//   generateRecommendations,
//   clearOldRecommendations
// } = require("../services/recommendation.service");

// module.exports = async function processCVAnalysis(job) {
//   const { analysisId } = job.data;

//   console.log(`📋 Processing CV Analysis Job #${job.id}`);

//   try {
//     const analysis = await CVAnalysis.findById(analysisId).populate("user");
//     if (!analysis) throw new Error("Analysis not found");

//     analysis.status = "processing";
//     await analysis.save();

//     const result = await performCVAnalysis(analysis.cvFileUrl);
//     if (!result.success) throw new Error(result.error);

//     Object.assign(analysis, {
//       status: "done",
//       analysisResult: result.analysis,
//       overallScore: result.analysis.overallScore,
//       skillsDetected: result.analysis.skillsDetected,
//       analyzedAt: new Date()
//     });

//     await analysis.save();

//     await clearOldRecommendations(analysis.user._id, analysisId);
//     await generateRecommendations(analysis.user._id);

//     console.log(`✅ CV Analysis completed (${analysisId})`);
//     return { success: true };
//   } catch (err) {
//     console.error("❌ CV Analysis failed:", err.message);
//     throw err;
//   }
// };


const CVAnalysis = require("../models/cvAnlalysis.model");
const User = require("../models/user.model");
const { performCVAnalysis } = require("../services/cvAnalysis.service");
const {
  generateRecommendations,
  clearOldRecommendations
} = require("../services/recommendation.service");

module.exports = async function processCVAnalysis(job) {
  const { analysisId } = job.data;

  console.log(`\n========================================`);
  console.log(`📋 Processing CV Analysis Job #${job.id}`);
  console.log(`Analysis ID: ${analysisId}`);
  console.log(`========================================\n`);

  try {
    console.log(`🔍 Fetching analysis record...`);
    const analysis = await CVAnalysis.findById(analysisId).populate("user");
    if (!analysis) {
      throw new Error("Analysis not found");
    }
    console.log(`✅ Analysis record found for user: ${analysis.user.email}`);

    console.log(`🔄 Updating status to 'processing'...`);
    analysis.status = "processing";
    await analysis.save();
    console.log(`✅ Status updated`);

    console.log(`🤖 Starting AI analysis of CV...`);
    console.log(`📄 CV URL: ${analysis.cvFileUrl}`);
    const result = await performCVAnalysis(analysis.cvFileUrl);
    
    if (!result.success) {
      console.error(`❌ Analysis failed: ${result.error}`);
      throw new Error(result.error);
    }
    console.log(`✅ AI analysis completed successfully`);

    console.log(`💾 Saving analysis results...`);
    Object.assign(analysis, {
      status: "done",
      analysisResult: result.analysis,
      overallScore: result.analysis.overallScore,
      skillsDetected: result.analysis.skillsDetected,
      analyzedAt: new Date()
    });

    await analysis.save();
    console.log(`✅ Results saved to database`);

    console.log(`🧹 Clearing old recommendations...`);
    await clearOldRecommendations(analysis.user._id, analysisId);
    
    console.log(`🎯 Generating new job recommendations...`);
    await generateRecommendations(analysis.user._id);

    console.log(`\n========================================`);
    console.log(`✅ CV Analysis COMPLETED: ${analysisId}`);
    console.log(`========================================\n`);
    
    return { success: true };
  } catch (err) {
    console.error(`\n========================================`);
    console.error(`❌ CV Analysis FAILED`);
    console.error(`Job ID: ${job.id}`);
    console.error(`Analysis ID: ${analysisId}`);
    console.error(`Error: ${err.message}`);
    console.error(`Stack: ${err.stack}`);
    console.error(`========================================\n`);
    
    // Update analysis status to failed
    try {
      const analysis = await CVAnalysis.findById(analysisId);
      if (analysis) {
        analysis.status = "failed";
        analysis.error = err.message;
        await analysis.save();
      }
    } catch (saveErr) {
      console.error(`❌ Failed to update error status:`, saveErr.message);
    }
    
    throw err;
  }
};