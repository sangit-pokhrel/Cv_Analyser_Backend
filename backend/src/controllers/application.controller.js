const JobApplication = require('../models/jobApplication.model');
const Job = require('../models/job.model');

async function submitApplication(req, res) {
  try {
    const jobId = req.body.jobId || req.params.jobId;
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'active') return res.status(404).json({ error: 'Job not available' });

    const existing = await JobApplication.findOne({ user: req.user._id, job: jobId });
    if (existing) return res.status(400).json({ error: 'Already applied' });

    const app = await JobApplication.create({
      user: req.user._id,
      job: jobId,
      coverLetter: req.body.coverLetter,
      resumeUrl: req.body.resumeUrl
    });
    return res.status(201).json({ application: app });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to apply' });
  }
}

async function listUserApplications(req, res) {
  try {
    const apps = await JobApplication.find({ user: req.user._id }).populate('job');
    return res.json({ data: apps });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to list applications' });
  }
}

async function getApplication(req, res) {
  try {
    const app = await JobApplication.findById(req.params.id).populate('job user');
    if (!app) return res.status(404).json({ error: 'Not found' });
    // authorize: applicant or job owner or admin
    if (app.user._id.toString() !== req.user._id.toString()) {
      const job = await Job.findById(app.job._id);
      if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }
    return res.json({ application: app });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to fetch application' });
  }
}

async function withdrawApplication(req, res) {
  try {
    const app = await JobApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Not found' });
    if (app.user.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Forbidden' });
    await app.remove();
    return res.json({ message: 'Withdrawn' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to withdraw' });
  }
}

module.exports = { submitApplication, listUserApplications, getApplication, withdrawApplication };
