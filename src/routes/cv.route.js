// // const express = require('express');
// // const router = express.Router();
// // const { analyzeCV, listAnalyses, getAnalysis } = require('../controllers/cv.controller');
// // const { requireAuth } = require('../middlewares/auth.middleware');
// // const { uploadCV } = require('../../utils/upload');

// // // analyze: allow auth or guest (but if auth present, attach user)
// // router.post('/analyze', uploadCV.single('cv'), analyzeCV);

// // // list/get user's analyses (auth required)
// // router.get('/analyses', requireAuth, listAnalyses);
// // router.get('/analyses/:id', requireAuth, getAnalysis);

// // module.exports = router;
// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const { 
//   analyzeCV, 
//   listAnalyses, 
//   getAnalysis,
//   getLatestAnalysis
// } = require('../controllers/cv.controller');
// const { requireAuth } = require('../middlewares/auth.middleware');

// // Multer configuration for CV uploads
// const upload = multer({ 
//   storage: multer.memoryStorage(), // Store in memory for Cloudinary upload
//   limits: { 
//     fileSize: 5 * 1024 * 1024, // 5MB max file size
//     files: 1 // Only one file at a time
//   },
//   fileFilter: (req, file, cb) => {
//     // Only allow PDF files
//     if (file.mimetype === 'application/pdf') {
//       cb(null, true);
//     } else {
//       cb(new Error('Only PDF files are allowed. Please upload a PDF resume/CV.'));
//     }
//   }
// });

// // Multer error handler middleware
// function handleMulterError(err, req, res, next) {
//   if (err instanceof multer.MulterError) {
//     if (err.code === 'LIMIT_FILE_SIZE') {
//       return res.status(400).json({ 
//         error: 'File too large',
//         message: 'CV file must be less than 5MB'
//       });
//     }
//     if (err.code === 'LIMIT_FILE_COUNT') {
//       return res.status(400).json({ 
//         error: 'Too many files',
//         message: 'Please upload only one CV file'
//       });
//     }
//     return res.status(400).json({ 
//       error: 'Upload error',
//       message: err.message 
//     });
//   } else if (err) {
//     return res.status(400).json({ 
//       error: 'Upload error',
//       message: err.message 
//     });
//   }
//   next();
// }

// // Routes

// // POST /cv/analyze - Upload and analyze CV (requires authentication)
// router.post('/analyze', 
//   requireAuth,                    // Must be logged in
//   upload.single('cv'),            // Handle file upload
//   handleMulterError,              // Handle upload errors
//   analyzeCV                       // Process CV analysis
// );

// // GET /cv/analyses - List all user's CV analyses (requires authentication)
// router.get('/analyses', 
//   requireAuth, 
//   listAnalyses
// );

// // GET /cv/analyses/latest - Get latest completed CV analysis (requires authentication)
// router.get('/analyses/latest', 
//   requireAuth, 
//   getLatestAnalysis
// );

// // GET /cv/analyses/:id - Get specific CV analysis by ID (requires authentication)
// router.get('/analyses/:id', 
//   requireAuth, 
//   getAnalysis
// );

// module.exports = router;


const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
  analyzeCV, 
  listAnalyses, 
  getAnalysis,
  getLatestAnalysis,
  listAllAnalyses,
  deleteAnalysis,
  updateAnalysis
} = require('../controllers/cv.controller');
const { requireAuth, permit } = require('../middlewares/auth.middleware');

// Multer configuration
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 5 * 1024 * 1024,
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Error handler
function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large', message: 'Max 5MB' });
    }
    return res.status(400).json({ error: 'Upload error', message: err.message });
  } else if (err) {
    return res.status(400).json({ error: 'Upload error', message: err.message });
  }
  next();
}

// User routes
router.post('/analyze', requireAuth, upload.single('cv'), handleMulterError, analyzeCV);
router.get('/analyses', requireAuth, listAnalyses);
router.get('/analyses/latest', requireAuth, getLatestAnalysis);
router.get('/analyses/:id', requireAuth, getAnalysis);

// Admin routes
router.get('/admin/analyses', requireAuth, permit('admin'), listAllAnalyses);
router.put('/admin/analyses/:id', requireAuth, permit('admin'), updateAnalysis);
router.delete('/admin/analyses/:id', requireAuth, permit('admin'), deleteAnalysis);

module.exports = router;
