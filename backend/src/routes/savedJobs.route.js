
// // const router = require('express').Router();
// // const ctrl = require('../controllers/savedJobs.controller');
// // const { authenticate } = require('../middlewares/auth.middleware');

// // // All routes require authentication
// // router.use(authenticate);

// // // POST /api/v1/saved-jobs/:jobId - Save a job
// // router.post('/:jobId', ctrl.saveJob);

// // // GET /api/v1/saved-jobs - Get all saved jobs
// // router.get('/', ctrl.listSaved);

// // // DELETE /api/v1/saved-jobs/:jobId - Remove saved job
// // router.delete('/:jobId', ctrl.removeSaved);

// // module.exports = router;

// const router = require('express').Router();
// const ctrl = require('../controllers/savedJobs.controller');
// const { verifyAccessToken } = require('../../utils/jwt.utils');

// // Authentication middleware
// const authenticate = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ error: 'No token provided' });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = verifyAccessToken(token);
    
//     // Attach user info to request
//     req.user = { _id: decoded.userId };
//     next();
//   } catch (error) {
//     console.error('Auth error:', error);
//     return res.status(401).json({ error: 'Invalid or expired token' });
//   }
// };

// // All routes require authentication
// router.use(authenticate);

// // POST /api/v1/saved-jobs/:jobId - Save a job
// router.post('/:jobId', ctrl.saveJob);

// // GET /api/v1/saved-jobs - Get all saved jobs
// router.get('/', ctrl.listSaved);

// // DELETE /api/v1/saved-jobs/:jobId - Remove saved job
// router.delete('/:jobId', ctrl.removeSaved);

// module.exports = router;


const router = require('express').Router();
const ctrl = require('../controllers/savedJobs.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(requireAuth);

// POST /api/v1/saved-jobs/:jobId - Save a job
router.post('/:jobId', ctrl.saveJob);

// GET /api/v1/saved-jobs - Get all saved jobs
router.get('/', ctrl.listSaved);

// DELETE /api/v1/saved-jobs/:jobId - Remove saved job
router.delete('/:jobId', ctrl.removeSaved);

module.exports = router;