const CVAnalysis = require('../models/cvAnlalysis.model');
const { uploadBufferToS3 } = require('../../utils/storageS3');
const cvQueue = require('../queues/cvQueus');

// Analyze CV
async function analyzeCV(req, res) {
  try {
    let cvUrl;
    
    if (req.file) {
      // Uploaded file via multer memory storage
      cvUrl = await uploadBufferToS3(
        req.file.buffer, 
        req.file.originalname, 
        req.file.mimetype, 
        'cvs'
      );
    } else if (req.body.cvUrl) {
      cvUrl = req.body.cvUrl;
    } else {
      return res.status(400).json({ error: 'CV file or cvUrl required' });
    }

    // Check if user already has a pending/processing analysis
    const existingAnalysis = await CVAnalysis.findOne({
      user: req.user._id,
      status: { $in: ['queued', 'processing'] }
    });

    if (existingAnalysis) {
      return res.status(400).json({ 
        error: 'You already have a CV analysis in progress',
        analysisId: existingAnalysis._id
      });
    }

    const record = await CVAnalysis.create({
      user: req.user._id,
      cvFileUrl: cvUrl,
      status: 'queued'
    });

    // Enqueue background job for analysis
    await cvQueue.add(
      { analysisId: record._id }, 
      { attempts: 3, backoff: 5000 }
    );

    return res.status(202).json({ 
      analysisId: record._id, 
      status: 'queued',
      message: 'CV analysis queued successfully'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unable to enqueue CV analysis' });
  }
}

// List user's CV analyses
async function listAnalyses(req, res) {
  try {
    const docs = await CVAnalysis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20); // Limit to last 20 analyses

    return res.json({ data: docs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unable to list analyses' });
  }
}

// Get specific analysis
async function getAnalysis(req, res) {
  try {
    const doc = await CVAnalysis.findById(req.params.id);
    
    if (!doc) return res.status(404).json({ error: 'Analysis not found' });
    
    // Authorization check
    if (doc.user && req.user) {
      if (doc.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    return res.json({ data: doc });
  } catch (err) {
    console.error(err);
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
      return res.status(404).json({ error: 'No completed analysis found' });
    }

    return res.json({ data: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unable to fetch latest analysis' });
  }
}

module.exports = { 
  analyzeCV, 
  listAnalyses, 
  getAnalysis,
  getLatestAnalysis
};






















// const CVAnalysis = require('../models/cvAnlalysis.model');
// const { uploadBufferToS3 } = require('../../utils/storageS3');
// const cvQueue = require('../queues/cvQueus');

// // Accept multipart or JSON { cvUrl }
// async function analyzeCV(req, res) {
//   try {
//     let cvUrl;
//     if (req.file) {
//       // uploaded file via multer memory storage
//       cvUrl = await uploadBufferToS3(req.file.buffer, req.file.originalname, req.file.mimetype, 'cvs');
//     } else if (req.body.cvUrl) {
//       cvUrl = req.body.cvUrl;
//     } else {
//       return res.status(400).json({ error: 'cv file or cvUrl required' });
//     }

//     const record = await CVAnalysis.create({
//       user: req.user ? req.user._id : null,
//       cvFileUrl: cvUrl,
//       status: 'queued'
//     });

//     // enqueue background job for analysis
//     await cvQueue.add({ analysisId: record._id }, { attempts: 3, backoff: 5000 });

//     return res.status(202).json({ analysisId: record._id, status: 'queued' });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Unable to enqueue CV analysis' });
//   }
// }

// async function listAnalyses(req, res) {
//   try {
//     const docs = await CVAnalysis.find({ user: req.user._id }).sort({ createdAt: -1 });
//     return res.json({ data: docs });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Unable to list analyses' });
//   }
// }

// async function getAnalysis(req, res) {
//   try {
//     const doc = await CVAnalysis.findById(req.params.id);
//     if (!doc) return res.status(404).json({ error: 'Not found' });
//     if (doc.user && req.user && doc.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Forbidden' });
//     }
//     return res.json({ data: doc });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Unable to fetch analysis' });
//   }
// }

// module.exports = { analyzeCV, listAnalyses, getAnalysis };
