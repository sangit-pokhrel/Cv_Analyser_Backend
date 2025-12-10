const Job = require('../models/Job');
const sanitizeHtml = require('sanitize-html');

async function createJob(req, res) {
  try {
    const jobData = {
      title: req.body.title,
      description: sanitizeHtml(req.body.description || '', { allowedTags: [], allowedAttributes: {} }),
      companyName: req.body.companyName,
      companyLogoUrl: req.body.companyLogoUrl,
      requirements: req.body.requirements,
      category: req.body.category,
      location: req.body.location,
      jobType: req.body.jobType,
      salaryMin: req.body.salaryMin,
      salaryMax: req.body.salaryMax,
      experienceLevel: req.body.experienceLevel,
      status: req.body.status || 'active',
      deadline: req.body.deadline,
      createdBy: req.user._id
    };
    const job = await Job.create(jobData);
    return res.status(201).json({ job });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create job' });
  }
}

async function listJobs(req, res) {
  try {
    const { page = 1, limit = 20, q, location, type, category } = req.query;
    const query = {};
    if (q) query.$or = [{ title: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }];
    if (location) query.location = new RegExp(location, 'i');
    if (type) query.jobType = type;
    if (category) query.category = category;

    const opts = { page: Number(page), limit: Math.min(100, Number(limit)), sort: { postedDate: -1 }, populate: 'createdBy category' };
    const result = await Job.paginate(query, opts);
    return res.json({ meta: { total: result.totalDocs, page: result.page, pages: result.totalPages }, data: result.docs });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to list jobs' });
  }
}

async function getJob(req, res) {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy category');
    if (!job) return res.status(404).json({ error: 'Job not found' });
    return res.json({ job });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to fetch job' });
  }
}

async function updateJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    ['title','companyName','companyLogoUrl','requirements','location','jobType','salaryMin','salaryMax','experienceLevel','status','deadline','category'].forEach(k => {
      if (req.body[k] !== undefined) job[k] = req.body[k];
    });
    if (req.body.description) job.description = sanitizeHtml(req.body.description, { allowedTags: [], allowedAttributes: {} });
    await job.save();
    return res.json({ job });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to update job' });
  }
}

async function deleteJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await job.remove();
    return res.json({ message: 'Job deleted' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to delete job' });
  }
}

module.exports = { createJob, listJobs, getJob, updateJob, deleteJob };
