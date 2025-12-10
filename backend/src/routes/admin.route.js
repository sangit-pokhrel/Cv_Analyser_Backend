const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Job = require('../models/job.model');
const JobApplication = require('../models/jobApplication.model');
const { requireAuth, permit } = require('../middlewares/auth.middleware');

router.get('/users', requireAuth, permit('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const users = await User.find().select('-password').skip((page-1)*limit).limit(Math.min(200, Number(limit)));
    return res.json({ data: users });
  } catch (err) { console.error(err); return res.status(500).json({ error: 'Unable to list users' }); }
});

router.put('/users/:id/status', requireAuth, permit('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.status = req.body.status || user.status;
    await user.save();
    return res.json({ message: 'User status updated', user: user.toJSON() });
  } catch (err) { console.error(err); return res.status(500).json({ error: 'Unable to update status' }); }
});

router.get('/jobs', requireAuth, permit('admin'), async (req, res) => {
  try {
    const jobs = await Job.find().limit(200).populate('createdBy','fullName email');
    return res.json({ data: jobs });
  } catch (err) { console.error(err); return res.status(500).json({ error: 'Unable to list jobs' }); }
});

router.put('/applications/:id/status', requireAuth, permit('admin'), async (req, res) => {
  try {
    const appId = req.params.id;
    const status = req.body.status;
    if (!status) return res.status(400).json({ error: 'status required' });
    const app = await JobApplication.findById(appId);
    if (!app) return res.status(404).json({ error: 'Application not found' });
    app.status = status;
    if (req.body.reviewedDate) app.reviewedDate = req.body.reviewedDate;
    if (req.body.notes) app.notes = req.body.notes;
    await app.save();

    return res.json({ message: 'Application updated', application: app });
  } catch (err) { console.error(err); return res.status(500).json({ error: 'Unable to update application' }); }
});

module.exports = router;
