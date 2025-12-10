const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  status: { type: String, enum: ['pending','under_review','accepted','rejected','interview_scheduled'], default: 'pending' },
  coverLetter: String,
  resumeUrl: String,
  appliedDate: { type: Date, default: Date.now },
  reviewedDate: Date,
  notes: String
}, { timestamps: true });

applicationSchema.index({ user: 1, job: 1 }, { unique: true }); // one application per user per job
module.exports = mongoose.model('JobApplication', applicationSchema);
