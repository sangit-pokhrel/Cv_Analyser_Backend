// routes
const router = require('express').Router();
const ctrl = require('../controllers/savedJobs.controller');
const { requireAuth } = require('../middlewares/auth.middleware');
router.post('/:jobId', requireAuth, ctrl.saveJob);
router.get('/', requireAuth, ctrl.listSaved);
router.delete('/:jobId', requireAuth, ctrl.removeSaved);
module.exports = router;