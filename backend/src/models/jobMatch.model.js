const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  matchScore: Number,
  matchingCriteria: mongoose.Schema.Types.Mixed,
  status: { type: String, enum: ['recommended','viewed','applied','dismissed'], default: 'recommended' }
}, { timestamps: true });

module.exports = mongoose.model('JobMatch', matchSchema);
