const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cvFileUrl: { type: String, required: true },
  
  // Analysis results
  analysisResult: { type: mongoose.Schema.Types.Mixed },
  overallScore: { type: Number, min: 0, max: 100 },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  recommendations: [{ type: String }],
  skillsDetected: [{ type: String }],
  
  // Job-related extracted info
  extractedData: {
    experience: String,
    education: [String],
    certifications: [String],
    languages: [String],
    totalYearsExperience: Number
  },
  
  // Processing status
  status: { 
    type: String, 
    enum: ['queued','processing','done','failed'], 
    default: 'queued' 
  },
  analyzedAt: { type: Date },
  errorMessage: { type: String }, // If analysis fails
  
  // Auto-matching triggered
  matchingTriggered: { type: Boolean, default: false },
  matchingTriggeredAt: { type: Date }
  
}, { timestamps: true });

// Only one active analysis per user
cvSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('CVAnalysis', cvSchema);


// const mongoose = require('mongoose');

// const cvSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   cvFileUrl: { type: String },
//   analysisResult: { type: mongoose.Schema.Types.Mixed },
//   overallScore: { type: Number },
//   strengths: [{ type: String }],
//   weaknesses: [{ type: String }],
//   recommendations: [{ type: String }],
//   skillsDetected: [{ type: String }],
//   status: { type: String, enum: ['queued','processing','done','failed'], default: 'queued' },
//   analyzedAt: { type: Date }
// }, { timestamps: true });

// module.exports = mongoose.model('CVAnalysis', cvSchema);
