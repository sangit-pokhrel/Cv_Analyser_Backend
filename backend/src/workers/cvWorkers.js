
// const CVAnalysis = require('../models/cvAnlalysis.model');
// const User = require('../models/user.model');
// const { performCVAnalysis } = require('../services/cvAnalysis.service');
// const { generateJobMatches } = require('../controllers/jobs.controller');


// async function processCVAnalysis(job) {
//   const { analysisId } = job.data;

//   try {
//     console.log(`Processing CV analysis: ${analysisId}`);

//     // Get the analysis record
//     const analysis = await CVAnalysis.findById(analysisId).populate('user');
    
//     if (!analysis) {
//       throw new Error('Analysis record not found');
//     }

//     // Update status to processing
//     analysis.status = 'processing';
//     await analysis.save();

//     // Perform CV analysis
//     const result = await performCVAnalysis(analysis.cvFileUrl);

//     if (!result.success) {
//       // Analysis failed
//       analysis.status = 'failed';
//       analysis.errorMessage = result.error;
//       await analysis.save();
      
//       console.error(`CV analysis failed for ${analysisId}:`, result.error);
//       return;
//     }

//     // Update analysis with results
//     analysis.status = 'done';
//     analysis.analysisResult = result.analysis;
//     analysis.overallScore = result.analysis.overallScore;
//     analysis.strengths = result.analysis.strengths;
//     analysis.weaknesses = result.analysis.weaknesses;
//     analysis.recommendations = result.analysis.recommendations;
//     analysis.skillsDetected = result.analysis.skillsDetected;
//     analysis.extractedData = result.analysis.extractedData;
//     analysis.analyzedAt = new Date();

//     await analysis.save();

//     console.log(`CV analysis completed successfully: ${analysisId}`);

//     // Update user profile with detected skills (optional)
//     if (analysis.user && result.analysis.skillsDetected.length > 0) {
//       await User.findByIdAndUpdate(
//         analysis.user._id,
//         { 
//           $addToSet: { 
//             skills: { $each: result.analysis.skillsDetected } 
//           } 
//         }
//       );
//     }

//     // Generate job matches in real-time
//     console.log(`Generating job matches for user: ${analysis.user._id}`);
//     await generateJobMatches(analysisId);

//     console.log(`Job matching completed for analysis: ${analysisId}`);

//   } catch (error) {
//     console.error(`Error processing CV analysis ${analysisId}:`, error);

//     // Update status to failed
//     try {
//       await CVAnalysis.findByIdAndUpdate(analysisId, {
//         status: 'failed',
//         errorMessage: error.message
//       });
//     } catch (updateError) {
//       console.error('Failed to update analysis status:', updateError);
//     }

//     throw error; // Re-throw for Bull queue retry logic
//   }
// }

// module.exports = processCVAnalysis;
const CVAnalysis = require('../models/cvAnlalysis.model');
const User = require('../models/user.model');
const { performCVAnalysis } = require('../services/cvAnalysis.service');
const { generateJobMatches } = require('../controllers/jobs.controller');

/**
 * Emit socket event helper
 */
function emitProgress(analysisId, data) {
  if (global.io) {
    global.io.to(`analysis-${analysisId}`).emit('analysis-progress', data);
    console.log(`📡 Emitted to analysis-${analysisId}:`, data.message);
  }
}

/**
 * Process CV Analysis Job with Real-time Updates
 */
async function processCVAnalysis(job) {
  const { analysisId, userId, cvUrl } = job.data;

  console.log(`\n========================================`);
  console.log(`📋 Processing CV Analysis Job #${job.id}`);
  console.log(`Analysis ID: ${analysisId}`);
  console.log(`User ID: ${userId}`);
  console.log(`CV URL: ${cvUrl}`);
  console.log(`========================================\n`);

  try {
    // Step 1: Get analysis record
    emitProgress(analysisId, {
      status: 'processing',
      progress: 5,
      message: 'Initializing analysis...',
      step: 'init'
    });

    const analysis = await CVAnalysis.findById(analysisId).populate('user');
    
    if (!analysis) {
      throw new Error(`Analysis record not found: ${analysisId}`);
    }

    console.log(`📄 Found analysis for user: ${analysis.user?.email || 'Unknown'}`);

    // Step 2: Update status to processing
    analysis.status = 'processing';
    await analysis.save();
    console.log(`🔄 Status updated to 'processing'`);

    emitProgress(analysisId, {
      status: 'processing',
      progress: 10,
      message: 'Downloading CV from cloud storage...',
      step: 'download'
    });

    // Step 3: Perform AI analysis
    console.log(`🤖 Starting AI analysis...`);
    
    emitProgress(analysisId, {
      status: 'processing',
      progress: 20,
      message: 'CV downloaded. Extracting text...',
      step: 'extract'
    });

    const result = await performCVAnalysis(analysis.cvFileUrl, (progressData) => {
      // Callback for progress updates from AI service
      emitProgress(analysisId, progressData);
    });

    if (!result.success) {
      console.error(`❌ AI Analysis failed: ${result.error}`);
      
      analysis.status = 'failed';
      analysis.errorMessage = result.error;
      await analysis.save();

      emitProgress(analysisId, {
        status: 'failed',
        progress: 0,
        message: `Analysis failed: ${result.error}`,
        step: 'error',
        error: result.error
      });
      
      throw new Error(result.error);
    }

    console.log(`✅ AI Analysis completed`);
    console.log(`   Score: ${result.analysis.overallScore}/100`);
    console.log(`   Skills: ${result.analysis.skillsDetected?.length || 0}`);

    emitProgress(analysisId, {
      status: 'processing',
      progress: 80,
      message: 'Saving analysis results...',
      step: 'save'
    });

    // Step 4: Save results
    analysis.status = 'done';
    analysis.analysisResult = result.analysis;
    analysis.overallScore = result.analysis.overallScore;
    analysis.strengths = result.analysis.strengths || [];
    analysis.weaknesses = result.analysis.weaknesses || [];
    analysis.recommendations = result.analysis.recommendations || [];
    analysis.skillsDetected = result.analysis.skillsDetected || [];
    analysis.extractedData = result.analysis.extractedData || {};
    analysis.analyzedAt = new Date();
    
    await analysis.save();
    console.log(`💾 Results saved to database`);

    emitProgress(analysisId, {
      status: 'processing',
      progress: 85,
      message: 'Updating user profile with detected skills...',
      step: 'update-profile'
    });

    // Step 5: Update user skills
    if (analysis.user && result.analysis.skillsDetected?.length > 0) {
      try {
        await User.findByIdAndUpdate(
          analysis.user._id,
          { 
            $addToSet: { 
              skills: { $each: result.analysis.skillsDetected } 
            } 
          }
        );
        console.log(`👤 User profile updated with skills`);
      } catch (error) {
        console.warn(`⚠️  Could not update user skills:`, error.message);
      }
    }

    emitProgress(analysisId, {
      status: 'processing',
      progress: 90,
      message: 'Generating job recommendations...',
      step: 'job-matching'
    });

    // Step 6: Generate job matches
    console.log(`🎯 Generating job matches...`);
    try {
      await generateJobMatches(analysisId);
      console.log(`✅ Job matching completed`);
    } catch (error) {
      console.error(`❌ Job matching failed:`, error.message);
    }

    // Step 7: Send completion event with full results
    emitProgress(analysisId, {
      status: 'done',
      progress: 100,
      message: 'Analysis completed successfully!',
      step: 'complete',
      data: {
        analysisId: analysis._id,
        overallScore: analysis.overallScore,
        skillsDetected: analysis.skillsDetected,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        recommendations: analysis.recommendations,
        extractedData: analysis.extractedData,
        analyzedAt: analysis.analyzedAt
      }
    });

    console.log(`\n✅ CV Analysis Job #${job.id} COMPLETED!\n`);
    
    return {
      success: true,
      analysisId: analysisId,
      score: result.analysis.overallScore
    };

  } catch (error) {
    console.error(`\n❌ Job #${job.id} FAILED:`, error.message);

    // Update to failed status
    try {
      await CVAnalysis.findByIdAndUpdate(analysisId, {
        status: 'failed',
        errorMessage: error.message
      });

      emitProgress(analysisId, {
        status: 'failed',
        progress: 0,
        message: `Analysis failed: ${error.message}`,
        step: 'error',
        error: error.message
      });
    } catch (updateError) {
      console.error('Failed to update status:', updateError.message);
    }

    throw error;
  }
}

module.exports = processCVAnalysis;