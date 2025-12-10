const express = require('express');
const router = express.Router();
const { analyzeCV, listAnalyses, getAnalysis } = require('../controllers/cv.controller');
const { requireAuth } = require('../middlewares/auth.middleware');
const { uploadCV } = require('../../utils/upload');

// analyze: allow auth or guest (but if auth present, attach user)
router.post('/analyze', uploadCV.single('cv'), analyzeCV);

// list/get user's analyses (auth required)
router.get('/analyses', requireAuth, listAnalyses);
router.get('/analyses/:id', requireAuth, getAnalysis);

module.exports = router;
