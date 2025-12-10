const express = require('express');
const router = express.Router();
const controller = require('../controllers/jobs.controller');
const { requireAuth, permit } = require('../middlewares/auth.middleware');

router.get('/', controller.listJobs);
router.get('/:id', controller.getJob);
router.post('/', requireAuth, permit('admin','user'), controller.createJob); // allow employers by role; adapt to your roles
router.put('/:id', requireAuth, controller.updateJob);
router.delete('/:id', requireAuth, controller.deleteJob);

module.exports = router;
