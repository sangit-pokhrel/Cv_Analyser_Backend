
const SavedJob = require('../models/savedJobs.model');
async function saveJob(req, res) {
  try {
    const jobId = req.params.jobId;
    const obj = { user: req.user._id, job: jobId };
    const saved = await SavedJob.findOneAndUpdate(obj, obj, { upsert: true, new: true, setDefaultsOnInsert: true });
    return res.status(201).json({ saved });
  } catch (e) { console.error(e); return res.status(500).json({ error: 'Failed' }); }
}
async function listSaved(req, res) {
  const list = await SavedJob.find({ user: req.user._id }).populate('job');
  return res.json({ data: list });
}
async function removeSaved(req, res) {
  await SavedJob.deleteOne({ user: req.user._id, job: req.params.jobId });
  return res.json({ message: 'Removed' });
}
module.exports = { saveJob, listSaved, removeSaved };