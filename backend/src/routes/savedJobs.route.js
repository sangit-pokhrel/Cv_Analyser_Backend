// routes
const router = require('express').Router();
const ctrl = require('../controllers/savedJobsController');
const { requireAuth } = require('../middleware/authMiddleware');
router.post('/:jobId', requireAuth, ctrl.saveJob);
router.get('/', requireAuth, ctrl.listSaved);
router.delete('/:jobId', requireAuth, ctrl.removeSaved);
module.exports = router;