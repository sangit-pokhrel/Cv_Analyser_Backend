const express = require('express');
const router = express.Router();
const controller = require('../controllers/jobs.controller');
const { requireAuth, permit } = require('../middlewares/auth.middleware');

router.get('/', controller.listJobs);
router.get('/:id', controller.getJob);
router.post('/', requireAuth, permit('admin','user'), controller.createJob);
router.put('/:id', requireAuth, permit('admin','user'), controller.updateJob);
router.delete('/:id', requireAuth, permit('admin','user'), controller.deleteJob);

module.exports = router;
