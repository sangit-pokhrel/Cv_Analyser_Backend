const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cvFileUrl: { type: String },
  analysisResult: { type: mongoose.Schema.Types.Mixed },
  overallScore: { type: Number },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  recommendations: [{ type: String }],
  skillsDetected: [{ type: String }],
  status: { type: String, enum: ['queued','processing','done','failed'], default: 'queued' },
  analyzedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('CVAnalysis', cvSchema);
