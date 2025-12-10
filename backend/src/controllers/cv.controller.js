const CVAnalysis = require('../models/cvAnlalysis.model');
const { uploadBufferToS3 } = require('../../utils/storageS3');
const cvQueue = require('../queues/cvQueus');

// Accept multipart or JSON { cvUrl }
async function analyzeCV(req, res) {
  try {
    let cvUrl;
    if (req.file) {
      // uploaded file via multer memory storage
      cvUrl = await uploadBufferToS3(req.file.buffer, req.file.originalname, req.file.mimetype, 'cvs');
    } else if (req.body.cvUrl) {
      cvUrl = req.body.cvUrl;
    } else {
      return res.status(400).json({ error: 'cv file or cvUrl required' });
    }

    const record = await CVAnalysis.create({
      user: req.user ? req.user._id : null,
      cvFileUrl: cvUrl,
      status: 'queued'
    });

    // enqueue background job for analysis
    await cvQueue.add({ analysisId: record._id }, { attempts: 3, backoff: 5000 });

    return res.status(202).json({ analysisId: record._id, status: 'queued' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unable to enqueue CV analysis' });
  }
}

async function listAnalyses(req, res) {
  try {
    const docs = await CVAnalysis.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({ data: docs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unable to list analyses' });
  }
}

async function getAnalysis(req, res) {
  try {
    const doc = await CVAnalysis.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    if (doc.user && req.user && doc.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return res.json({ data: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unable to fetch analysis' });
  }
}

module.exports = { analyzeCV, listAnalyses, getAnalysis };
