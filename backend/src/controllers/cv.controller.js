// const CVAnalysis = require('../models/cvAnlalysis.model');
// const { uploadBufferToS3 } = require('../../utils/storageS3');
// const cvQueue = require('../queues/cvQueus');

// // Analyze CV
// async function analyzeCV(req, res) {
//   try {
//     let cvUrl;
    
//     if (req.file) {
//       // Uploaded file via multer memory storage
//       cvUrl = await uploadBufferToS3(
//         req.file.buffer, 
//         req.file.originalname, 
//         req.file.mimetype, 
//         'cvs'
//       );
//     } else if (req.body.cvUrl) {
//       cvUrl = req.body.cvUrl;
//     } else {
//       return res.status(400).json({ error: 'CV file or cvUrl required' });
//     }

//     // Check if user already has a pending/processing analysis
//     const existingAnalysis = await CVAnalysis.findOne({
//       user: req.user._id,
//       status: { $in: ['queued', 'processing'] }
//     });

//     if (existingAnalysis) {
//       return res.status(400).json({ 
//         error: 'You already have a CV analysis in progress',
//         analysisId: existingAnalysis._id
//       });
//     }

//     const record = await CVAnalysis.create({
//       user: req.user._id,
//       cvFileUrl: cvUrl,
//       status: 'queued'
//     });

//     // Enqueue background job for analysis
//     await cvQueue.add(
//       { analysisId: record._id }, 
//       { attempts: 3, backoff: 5000 }
//     );

//     return res.status(202).json({ 
//       analysisId: record._id, 
//       status: 'queued',
//       message: 'CV analysis queued successfully'
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Unable to enqueue CV analysis' });
//   }
// }

// // List user's CV analyses
// async function listAnalyses(req, res) {
//   try {
//     const docs = await CVAnalysis.find({ user: req.user._id })
//       .sort({ createdAt: -1 })
//       .limit(20); // Limit to last 20 analyses

//     return res.json({ data: docs });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Unable to list analyses' });
//   }
// }

// // Get specific analysis
// async function getAnalysis(req, res) {
//   try {
//     const doc = await CVAnalysis.findById(req.params.id);
    
//     if (!doc) return res.status(404).json({ error: 'Analysis not found' });
    
//     // Authorization check
//     if (doc.user && req.user) {
//       if (doc.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//         return res.status(403).json({ error: 'Forbidden' });
//       }
//     }

//     return res.json({ data: doc });
//   } catch (err) {
//     console.error(err);
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
//       return res.status(404).json({ error: 'No completed analysis found' });
//     }

//     return res.json({ data: doc });
//   } catch (err) {
//     console.error(err);
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

// Analyze CV
async function analyzeCV(req, res) {
  try {
    let cvUrl;
    
    // Check if file was uploaded via multipart/form-data
    if (req.file) {
      console.log('File uploaded:', req.file.originalname);
      
      // Upload to Cloudinary
      cvUrl = await uploadBufferToS3(
        req.file.buffer, 
        req.file.originalname, 
        req.file.mimetype, 
        'cvs'
      );
      
      console.log('CV uploaded to Cloudinary:', cvUrl);
      
    } else if (req.body && req.body.cvUrl) {
      // Alternative: CV URL provided directly
      cvUrl = req.body.cvUrl;
      console.log('Using provided CV URL:', cvUrl);
      
    } else {
      return res.status(400).json({ 
        error: 'CV file or cvUrl required. Please upload a PDF file.' 
      });
    }

    // Check if user already has a pending/processing analysis
    const existingAnalysis = await CVAnalysis.findOne({
      user: req.user._id,
      status: { $in: ['queued', 'processing'] }
    });

    if (existingAnalysis) {
      return res.status(400).json({ 
        error: 'You already have a CV analysis in progress',
        analysisId: existingAnalysis._id,
        status: existingAnalysis.status
      });
    }

    // Create analysis record
    const record = await CVAnalysis.create({
      user: req.user._id,
      cvFileUrl: cvUrl,
      status: 'queued'
    });

    console.log('CV analysis record created:', record._id);

    // Enqueue background job for analysis
    await cvQueue.add(
      { analysisId: record._id.toString() }, 
      { 
        attempts: 3, 
        backoff: {
          type: 'exponential',
          delay: 5000
        }
      }
    );

    console.log('CV analysis job queued:', record._id);

    return res.status(202).json({ 
      analysisId: record._id, 
      status: 'queued',
      message: 'CV analysis queued successfully. Check back in 30-60 seconds.'
    });
    
  } catch (err) {
    console.error('CV Analysis Error:', err);
    return res.status(500).json({ 
      error: 'Unable to enqueue CV analysis',
      details: err.message 
    });
  }
}

// List user's CV analyses
async function listAnalyses(req, res) {
  try {
    const docs = await CVAnalysis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20); // Limit to last 20 analyses

    return res.json({ 
      total: docs.length,
      data: docs 
    });
  } catch (err) {
    console.error('List Analyses Error:', err);
    return res.status(500).json({ error: 'Unable to list analyses' });
  }
}

// Get specific analysis
async function getAnalysis(req, res) {
  try {
    const doc = await CVAnalysis.findById(req.params.id);
    
    if (!doc) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    
    // Authorization check
    if (doc.user && req.user) {
      if (doc.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    return res.json({ data: doc });
  } catch (err) {
    console.error('Get Analysis Error:', err);
    return res.status(500).json({ error: 'Unable to fetch analysis' });
  }
}

// Get latest completed analysis for user
async function getLatestAnalysis(req, res) {
  try {
    const doc = await CVAnalysis.findOne({
      user: req.user._id,
      status: 'done'
    }).sort({ analyzedAt: -1 });

    if (!doc) {
      return res.status(404).json({ 
        error: 'No completed analysis found',
        message: 'Please upload and analyze your CV first'
      });
    }

    return res.json({ data: doc });
  } catch (err) {
    console.error('Get Latest Analysis Error:', err);
    return res.status(500).json({ error: 'Unable to fetch latest analysis' });
  }
}

module.exports = { 
  analyzeCV, 
  listAnalyses, 
  getAnalysis,
  getLatestAnalysis
};
