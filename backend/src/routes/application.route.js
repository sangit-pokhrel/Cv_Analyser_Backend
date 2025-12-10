const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/applicationController');
const { requireAuth, permit } = require('../middleware/authMiddleware');

router.post('/', requireAuth, permit('user'), ctrl.submitApplication);
router.get('/', requireAuth, ctrl.listUserApplications);
router.get('/:id', requireAuth, ctrl.getApplication);
router.delete('/:id', requireAuth, ctrl.withdrawApplication);

module.exports = router;
