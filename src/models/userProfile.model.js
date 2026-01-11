const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: String,
  skills: [{ type: String }],
  experienceYears: Number,
  education: String,
  location: String,
  resumeUrl: String,
  cvFileUrl: String,
  linkedinUrl: String,
  portfolioUrl: String,
  preferences: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', profileSchema);
