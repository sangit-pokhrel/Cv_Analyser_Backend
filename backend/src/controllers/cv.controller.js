// // const CVAnalysis = require('../models/cvAnlalysis.model');
// // const { uploadBufferToS3 } = require('../../utils/storageS3');
// // const cvQueue = require('../queues/cvQueus');

// // // Analyze CV
// // async function analyzeCV(req, res) {
// //   try {
// //     let cvUrl;
    
// //     if (req.file) {
// //       // Uploaded file via multer memory storage
// //       cvUrl = await uploadBufferToS3(
// //         req.file.buffer, 
// //         req.file.originalname, 
// //         req.file.mimetype, 
// //         'cvs'
// //       );
// //     } else if (req.body.cvUrl) {
// //       cvUrl = req.body.cvUrl;
// //     } else {
// //       return res.status(400).json({ error: 'CV file or cvUrl required' });
// //     }

// //     // Check if user already has a pending/processing analysis
// //     const existingAnalysis = await CVAnalysis.findOne({
// //       user: req.user._id,
// //       status: { $in: ['queued', 'processing'] }
// //     });

// //     if (existingAnalysis) {
// //       return res.status(400).json({ 
// //         error: 'You already have a CV analysis in progress',
// //         analysisId: existingAnalysis._id
// //       });
// //     }

// //     const record = await CVAnalysis.create({
// //       user: req.user._id,
// //       cvFileUrl: cvUrl,
// //       status: 'queued'
// //     });

// //     // Enqueue background job for analysis
// //     await cvQueue.add(
// //       { analysisId: record._id }, 
// //       { attempts: 3, backoff: 5000 }
// //     );

// //     return res.status(202).json({ 
// //       analysisId: record._id, 
// //       status: 'queued',
// //       message: 'CV analysis queued successfully'
// //     });
// //   } catch (err) {
// //     console.error(err);
// //     return res.status(500).json({ error: 'Unable to enqueue CV analysis' });
// //   }
// // }

// // // List user's CV analyses
// // async function listAnalyses(req, res) {
// //   try {
// //     const docs = await CVAnalysis.find({ user: req.user._id })
// //       .sort({ createdAt: -1 })
// //       .limit(20); // Limit to last 20 analyses

// //     return res.json({ data: docs });
// //   } catch (err) {
// //     console.error(err);
// //     return res.status(500).json({ error: 'Unable to list analyses' });
// //   }
// // }

// // // Get specific analysis
// // async function getAnalysis(req, res) {
// //   try {
// //     const doc = await CVAnalysis.findById(req.params.id);
    
// //     if (!doc) return res.status(404).json({ error: 'Analysis not found' });
    
// //     // Authorization check
// //     if (doc.user && req.user) {
// //       if (doc.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
// //         return res.status(403).json({ error: 'Forbidden' });
// //       }
// //     }

// //     return res.json({ data: doc });
// //   } catch (err) {
// //     console.error(err);
// //     return res.status(500).json({ error: 'Unable to fetch analysis' });
// //   }
// // }

// // // Get latest completed analysis for user
// // async function getLatestAnalysis(req, res) {
// //   try {
// //     const doc = await CVAnalysis.findOne({
// //       user: req.user._id,
// //       status: 'done'
// //     }).sort({ analyzedAt: -1 });

// //     if (!doc) {
// //       return res.status(404).json({ error: 'No completed analysis found' });
// //     }

// //     return res.json({ data: doc });
// //   } catch (err) {
// //     console.error(err);
// //     return res.status(500).json({ error: 'Unable to fetch latest analysis' });
// //   }
// // }

// // module.exports = { 
// //   analyzeCV, 
// //   listAnalyses, 
// //   getAnalysis,
// //   getLatestAnalysis
// // };

// const CVAnalysis = require('../models/cvAnlalysis.model');
// const { uploadBufferToS3 } = require('../../utils/storageS3');
// const cvQueue = require('../queues/cvQueus');

// // Analyze CV
// async function analyzeCV(req, res) {
//   try {
//     let cvUrl;
    
//     // Check if file was uploaded via multipart/form-data
//     if (req.file) {
//       console.log('File uploaded:', req.file.originalname);
      
//       // Upload to Cloudinary
//       cvUrl = await uploadBufferToS3(
//         req.file.buffer, 
//         req.file.originalname, 
//         req.file.mimetype, 
//         'cvs'
//       );
      
//       console.log('CV uploaded to Cloudinary:', cvUrl);
      
//     } else if (req.body && req.body.cvUrl) {
//       // Alternative: CV URL provided directly
//       cvUrl = req.body.cvUrl;
//       console.log('Using provided CV URL:', cvUrl);
      
//     } else {
//       return res.status(400).json({ 
//         error: 'CV file or cvUrl required. Please upload a PDF file.' 
//       });
//     }

//     // Check if user already has a pending/processing analysis
//     const existingAnalysis = await CVAnalysis.findOne({
//       user: req.user._id,
//       status: { $in: ['queued', 'processing'] }
//     });

//     if (existingAnalysis) {
//       return res.status(400).json({ 
//         error: 'You already have a CV analysis in progress',
//         analysisId: existingAnalysis._id,
//         status: existingAnalysis.status
//       });
//     }

//     // Create analysis record
//     const record = await CVAnalysis.create({
//       user: req.user._id,
//       cvFileUrl: cvUrl,
//       status: 'queued'
//     });

//     console.log('CV analysis record created:', record._id);

//     // Enqueue background job for analysis
//     await cvQueue.add(
//       { analysisId: record._id.toString() }, 
//       { 
//         attempts: 3, 
//         backoff: {
//           type: 'exponential',
//           delay: 5000
//         }
//       }
//     );

//     console.log('CV analysis job queued:', record._id);

//     return res.status(202).json({ 
//       analysisId: record._id, 
//       status: 'queued',
//       message: 'CV analysis queued successfully. Check back in 30-60 seconds.'
//     });
    
//   } catch (err) {
//     console.error('CV Analysis Error:', err);
//     return res.status(500).json({ 
//       error: 'Unable to enqueue CV analysis',
//       details: err.message 
//     });
//   }
// }

// // List user's CV analyses
// async function listAnalyses(req, res) {
//   try {
//     const docs = await CVAnalysis.find({ user: req.user._id })
//       .sort({ createdAt: -1 })
//       .limit(20); // Limit to last 20 analyses

//     return res.json({ 
//       total: docs.length,
//       data: docs 
//     });
//   } catch (err) {
//     console.error('List Analyses Error:', err);
//     return res.status(500).json({ error: 'Unable to list analyses' });
//   }
// }

// // Get specific analysis
// async function getAnalysis(req, res) {
//   try {
//     const doc = await CVAnalysis.findById(req.params.id);
    
//     if (!doc) {
//       return res.status(404).json({ error: 'Analysis not found' });
//     }
    
//     // Authorization check
//     if (doc.user && req.user) {
//       if (doc.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//         return res.status(403).json({ error: 'Forbidden' });
//       }
//     }

//     return res.json({ data: doc });
//   } catch (err) {
//     console.error('Get Analysis Error:', err);
//     return res.status(500).json({ error: 'Unable to fetch analysis' });
//   }
// }

// // Get latest completed analysis for user
// async function getLatestAnalysis(req, res) {
//   try {
//     const doc = await CVAnalysis.findOne({
//       user: req.user._id,
//       status: 'done'
//     }).sort({ analyzedAt: -1 });

//     if (!doc) {
//       return res.status(404).json({ 
//         error: 'No completed analysis found',
//         message: 'Please upload and analyze your CV first'
//       });
//     }

//     return res.json({ data: doc });
//   } catch (err) {
//     console.error('Get Latest Analysis Error:', err);
//     return res.status(500).json({ error: 'Unable to fetch latest analysis' });
//   }
// }

// module.exports = { 
//   analyzeCV, 
//   listAnalyses, 
//   getAnalysis,
//   getLatestAnalysis
// };
const CVAnalysis = require('../models/cvAnlalysis.model');
const { uploadBufferToS3 } = require('../../utils/storageS3');
const cvQueue = require('../queues/cvQueus');
const JobMatch = require('../models/jobMatch.model');
/**
 * Analyze CV
 * POST /cv/analyze
 * Requires authentication
 * Accepts: multipart/form-data with 'cv' file (PDF) OR JSON with 'cvUrl'
 */
async function analyzeCV(req, res) {
  try {
    // Verify user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Please login to analyze your CV'
      });
    }

    let cvUrl;
    
    // Option 1: File uploaded via multipart/form-data
    if (req.file) {
      console.log(`📄 File uploaded: ${req.file.originalname} (${req.file.size} bytes)`);
      
      try {
        // Upload to Cloudinary
        cvUrl = await uploadBufferToS3(
          req.file.buffer, 
          req.file.originalname, 
          req.file.mimetype, 
          'cvs'
        );
        
        console.log(`☁️  CV uploaded to Cloudinary: ${cvUrl}`);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ 
          error: 'File upload failed',
          message: 'Could not upload CV to storage. Please try again.',
          details: uploadError.message
        });
      }
      
    } 
    // Option 2: CV URL provided directly (for external URLs)
    else if (req.body && req.body.cvUrl) {
      cvUrl = req.body.cvUrl;
      console.log(`🔗 Using provided CV URL: ${cvUrl}`);
      
      // Basic URL validation
      try {
        new URL(cvUrl);
      } catch (urlError) {
        return res.status(400).json({ 
          error: 'Invalid URL',
          message: 'The provided CV URL is not valid'
        });
      }
    } 
    // No file or URL provided
    else {
      return res.status(400).json({ 
        error: 'CV file or URL required',
        message: 'Please upload a PDF file or provide a CV URL'
      });
    }

    // Check if user already has a pending or processing analysis
    const existingAnalysis = await CVAnalysis.findOne({
      user: req.user._id,
      status: { $in: ['queued', 'processing'] }
    });

    if (existingAnalysis) {
      return res.status(400).json({ 
        error: 'Analysis already in progress',
        message: 'You already have a CV analysis in progress. Please wait for it to complete.',
        analysisId: existingAnalysis._id,
        status: existingAnalysis.status,
        createdAt: existingAnalysis.createdAt
      });
    }

    // Create new CV analysis record
    const record = await CVAnalysis.create({
      user: req.user._id,
      cvFileUrl: cvUrl,
      status: 'queued'
    });

    console.log(`✅ CV analysis record created: ${record._id} for user ${req.user.email}`);

    // Enqueue background job for analysis
    try {
      await cvQueue.add(
        'analyze-cv',
        { 
          analysisId: record._id.toString(),
          userId: req.user._id.toString(),
          cvUrl: cvUrl
        }, 
        { 
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000
          },
          removeOnComplete: false, // Keep completed jobs for debugging
          removeOnFail: false
        }
      );

      console.log(`🔄 CV analysis job queued: ${record._id}`);
    } catch (queueError) {
      console.error('Queue error:', queueError);
      
      // Update record to failed if queue fails
      await CVAnalysis.findByIdAndUpdate(record._id, {
        status: 'failed',
        errorMessage: 'Failed to queue analysis job'
      });
      
      return res.status(500).json({ 
        error: 'Failed to queue analysis',
        message: 'Could not start CV analysis. Please try again.',
        details: queueError.message
      });
    }

    // Return success response
    return res.status(202).json({ 
      success: true,
      message: 'CV analysis queued successfully. Results will be ready in 30-60 seconds.',
      analysisId: record._id,
      status: 'queued',
      estimatedTime: '30-60 seconds',
      checkStatusUrl: `//api/v1/cv/analyses/${record._id}`
    });
    
  } catch (err) {
    console.error('❌ CV Analysis Error:', err);
    return res.status(500).json({ 
      error: 'Unable to process CV analysis',
      message: 'An unexpected error occurred. Please try again.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

/**
 * List user's CV analyses
 * GET /cv/analyses
 * Requires authentication
 */
async function listAnalyses(req, res) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Please login to view your CV analyses'
      });
    }

    const { page = 1, limit = 20, status } = req.query;
    
    const query = { user: req.user._id };
    
    // Filter by status if provided
    if (status && ['queued', 'processing', 'done', 'failed'].includes(status)) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [docs, total] = await Promise.all([
      CVAnalysis.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      CVAnalysis.countDocuments(query)
    ]);

    return res.json({ 
      success: true,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      },
      data: docs 
    });
  } catch (err) {
    console.error('❌ List Analyses Error:', err);
    return res.status(500).json({ 
      error: 'Unable to list analyses',
      message: 'Could not retrieve your CV analyses'
    });
  }
}

/**
 * Get specific analysis by ID
 * GET /cv/analyses/:id
 * Requires authentication
 */
async function getAnalysis(req, res) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Please login to view CV analysis'
      });
    }

    const doc = await CVAnalysis.findById(req.params.id);
    
    if (!doc) {
      return res.status(404).json({ 
        error: 'Analysis not found',
        message: 'The requested CV analysis does not exist'
      });
    }
    
    // Authorization check: only owner or admin can view
    if (doc.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'You do not have permission to view this analysis'
      });
    }

    return res.json({ 
      success: true,
      data: doc 
    });
  } catch (err) {
    console.error('❌ Get Analysis Error:', err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Invalid analysis ID',
        message: 'The provided analysis ID is not valid'
      });
    }
    
    return res.status(500).json({ 
      error: 'Unable to fetch analysis',
      message: 'Could not retrieve the CV analysis'
    });
  }
}

/**
 * Get latest completed analysis for user
 * GET /cv/analyses/latest
 * Requires authentication
 */
async function getLatestAnalysis(req, res) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Please login to view your latest CV analysis'
      });
    }

    const doc = await CVAnalysis.findOne({
      user: req.user._id,
      status: 'done'
    }).sort({ analyzedAt: -1 });

    if (!doc) {
      return res.status(404).json({ 
        error: 'No completed analysis found',
        message: 'You have not completed any CV analysis yet. Please upload and analyze your CV first.'
      });
    }

    return res.json({ 
      success: true,
      data: doc 
    });
  } catch (err) {
    console.error('❌ Get Latest Analysis Error:', err);
    return res.status(500).json({ 
      error: 'Unable to fetch latest analysis',
      message: 'Could not retrieve your latest CV analysis'
    });
  }
}


/**
 * List all CV analyses (Admin only)
 * GET /cv/admin/analyses
 */
async function listAllAnalyses(req, res) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false,
        error: 'Unauthorized'
      });
    }

    // Admin check
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Forbidden',
        message: 'Admin access required'
      });
    }

    const { page = 1, limit = 20, status, userId } = req.query;
    
    const query = {};
    
    if (status && ['queued', 'processing', 'done', 'failed'].includes(status)) {
      query.status = status;
    }

    if (userId) {
      query.user = userId;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [docs, total] = await Promise.all([
      CVAnalysis.find(query)
        .populate('user', 'email firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      CVAnalysis.countDocuments(query)
    ]);

    return res.json({ 
      success: true,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      },
      data: docs 
    });
  } catch (err) {
    console.error('❌ List All Analyses Error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Unable to list analyses'
    });
  }
}

/**
 * Delete CV analysis (Admin only)
 * DELETE /cv/admin/analyses/:id
 */
// async function deleteAnalysis(req, res) {
//   try {
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ 
//         success: false,
//         error: 'Unauthorized'
//       });
//     }

//     // Admin check
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ 
//         success: false,
//         error: 'Forbidden',
//         message: 'Admin access required'
//       });
//     }

//     const doc = await CVAnalysis.findById(req.params.id);
    
//     if (!doc) {
//       return res.status(404).json({ 
//         success: false,
//         error: 'Analysis not found'
//       });
//     }

//     // Also delete related job matches
//     await JobMatch.deleteMany({ cvAnalysis: req.params.id });

//     await doc.deleteOne();

//     return res.json({ 
//       success: true,
//       message: 'CV analysis and related job matches deleted successfully'
//     });
//   } catch (err) {
//     console.error('❌ Delete Analysis Error:', err);
    
//     if (err.name === 'CastError') {
//       return res.status(400).json({ 
//         success: false,
//         error: 'Invalid analysis ID'
//       });
//     }
    
//     return res.status(500).json({ 
//       success: false,
//       error: 'Unable to delete analysis'
//     });
//   }
// }


async function deleteAnalysis(req, res) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false,
        error: 'Unauthorized'
      });
    }

    // Admin check
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Forbidden',
        message: 'Admin access required'
      });
    }

    const doc = await CVAnalysis.findById(req.params.id);
    
    if (!doc) {
      return res.status(404).json({ 
        success: false,
        error: 'Analysis not found'
      });
    }

    // Delete related job matches (now JobMatch is imported)
    await JobMatch.deleteMany({ cvAnalysis: req.params.id });

    await doc.deleteOne();

    return res.json({ 
      success: true,
      message: 'CV analysis and related job matches deleted successfully'
    });
  } catch (err) {
    console.error('❌ Delete Analysis Error:', err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid analysis ID'
      });
    }
    
    return res.status(500).json({ 
      success: false,
      error: 'Unable to delete analysis'
    });
  }
}


/**
 * Update CV analysis (Admin only)
 * PUT /cv/admin/analyses/:id
 */
async function updateAnalysis(req, res) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false,
        error: 'Unauthorized'
      });
    }

    // Admin check
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Forbidden',
        message: 'Admin access required'
      });
    }

    const { status, overallScore, strengths, weaknesses, recommendations, skillsDetected } = req.body;

    const doc = await CVAnalysis.findById(req.params.id);
    
    if (!doc) {
      return res.status(404).json({ 
        success: false,
        error: 'Analysis not found'
      });
    }

    // Update fields
    if (status) doc.status = status;
    if (overallScore !== undefined) doc.overallScore = overallScore;
    if (strengths) doc.strengths = strengths;
    if (weaknesses) doc.weaknesses = weaknesses;
    if (recommendations) doc.recommendations = recommendations;
    if (skillsDetected) doc.skillsDetected = skillsDetected;

    await doc.save();

    return res.json({ 
      success: true,
      message: 'CV analysis updated successfully',
      data: doc
    });
  } catch (err) {
    console.error('❌ Update Analysis Error:', err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid analysis ID'
      });
    }
    
    return res.status(500).json({ 
      success: false,
      error: 'Unable to update analysis'
    });
  }
}

// Update exports
module.exports = { 
  analyzeCV, 
  listAnalyses, 
  getAnalysis,
  getLatestAnalysis,
  listAllAnalyses,
  deleteAnalysis,
  updateAnalysis
};
