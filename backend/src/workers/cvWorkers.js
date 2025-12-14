
const CVAnalysis = require('../models/cvAnlalysis.model');
const User = require('../models/user.model');
const { performCVAnalysis } = require('../services/cvAnalysis.service');
const { generateJobMatches } = require('../controllers/jobs.controller');


async function processCVAnalysis(job) {
  const { analysisId } = job.data;

  try {
    console.log(`Processing CV analysis: ${analysisId}`);

    // Get the analysis record
    const analysis = await CVAnalysis.findById(analysisId).populate('user');
    
    if (!analysis) {
      throw new Error('Analysis record not found');
    }

    // Update status to processing
    analysis.status = 'processing';
    await analysis.save();

    // Perform CV analysis
    const result = await performCVAnalysis(analysis.cvFileUrl);

    if (!result.success) {
      // Analysis failed
      analysis.status = 'failed';
      analysis.errorMessage = result.error;
      await analysis.save();
      
      console.error(`CV analysis failed for ${analysisId}:`, result.error);
      return;
    }

    // Update analysis with results
    analysis.status = 'done';
    analysis.analysisResult = result.analysis;
    analysis.overallScore = result.analysis.overallScore;
    analysis.strengths = result.analysis.strengths;
    analysis.weaknesses = result.analysis.weaknesses;
    analysis.recommendations = result.analysis.recommendations;
    analysis.skillsDetected = result.analysis.skillsDetected;
    analysis.extractedData = result.analysis.extractedData;
    analysis.analyzedAt = new Date();

    await analysis.save();

    console.log(`CV analysis completed successfully: ${analysisId}`);

    // Update user profile with detected skills (optional)
    if (analysis.user && result.analysis.skillsDetected.length > 0) {
      await User.findByIdAndUpdate(
        analysis.user._id,
        { 
          $addToSet: { 
            skills: { $each: result.analysis.skillsDetected } 
          } 
        }
      );
    }

    // Generate job matches in real-time
    console.log(`Generating job matches for user: ${analysis.user._id}`);
    await generateJobMatches(analysisId);

    console.log(`Job matching completed for analysis: ${analysisId}`);

  } catch (error) {
    console.error(`Error processing CV analysis ${analysisId}:`, error);

    // Update status to failed
    try {
      await CVAnalysis.findByIdAndUpdate(analysisId, {
        status: 'failed',
        errorMessage: error.message
      });
    } catch (updateError) {
      console.error('Failed to update analysis status:', updateError);
    }

    throw error; // Re-throw for Bull queue retry logic
  }
}

module.exports = processCVAnalysis;



// require('dotenv').config();
// const cvQueue = require('../queues/cvQueus');
// const CVAnalysis = require('../models/cvAnlalysis.model');

// cvQueue.process(async (job) => {
//   const { analysisId } = job.data;
//   console.log('[CV WORKER] processing', analysisId);
//   const record = await CVAnalysis.findById(analysisId);
//   if (!record) throw new Error('analysis record not found');

//   try {
//     // mark processing
//     record.status = 'processing';
//     await record.save();

//     // === PLACEHOLDER: call your ML/NLP function here ===
//     // Simulated analysis:
//     await new Promise(r => setTimeout(r, 2000)); // simulate processing time

//     const fakeResult = {
//       overallScore: Math.floor(Math.random() * 41) + 60, // 60-100
//       strengths: ['clear structure','relevant keywords'],
//       weaknesses: ['missing quantification','short summary'],
//       recommendations: ['Add metrics', 'Include technical keywords'],
//       skillsDetected: ['nodejs', 'mongodb']
//     };

//     record.analysisResult = fakeResult;
//     record.overallScore = fakeResult.overallScore;
//     record.strengths = fakeResult.strengths;
//     record.weaknesses = fakeResult.weaknesses;
//     record.recommendations = fakeResult.recommendations;
//     record.skillsDetected = fakeResult.skillsDetected;
//     record.status = 'done';
//     record.analyzedAt = new Date();
//     await record.save();

//     console.log('[CV WORKER] done', analysisId);
//     return { ok: true };
//   } catch (err) {
//     console.error('[CV WORKER] failed', err);
//     record.status = 'failed';
//     await record.save();
//     throw err;
//   }
// });

// cvQueue.on('completed', (job) => console.log('Job completed', job.id));
// cvQueue.on('failed', (job, err) => console.log('Job failed', job.id, err.message));
// console.log('CV worker started, listening for jobs...');
