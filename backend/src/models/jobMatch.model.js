// const mongoose = require('mongoose');

// const matchSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
//   matchScore: Number,
//   matchingCriteria: mongoose.Schema.Types.Mixed,
//   status: { type: String, enum: ['recommended','viewed','applied','dismissed'], default: 'recommended' }
// }, { timestamps: true });

// module.exports = mongoose.model('JobMatch', matchSchema);
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  cvAnalysis: { type: mongoose.Schema.Types.ObjectId, ref: 'CVAnalysis' }, // Link to CV analysis
  
  // Matching score and details
  matchScore: { type: Number, min: 0, max: 100, required: true },
  matchingCriteria: {
    skillsMatch: { type: Number, min: 0, max: 100 },
    experienceMatch: { type: Number, min: 0, max: 100 },
    locationMatch: { type: Number, min: 0, max: 100 },
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }]
  },
  
  // User interaction
  status: { 
    type: String, 
    enum: ['recommended','viewed','applied','dismissed','saved'], 
    default: 'recommended' 
  },
  viewedAt: { type: Date },
  dismissedAt: { type: Date },
  
  // Ranking (for sorting recommendations)
  rank: { type: Number }
  
}, { timestamps: true });

// Indexes
matchSchema.index({ user: 1, matchScore: -1 });
matchSchema.index({ user: 1, status: 1 });
matchSchema.index({ job: 1 });
matchSchema.index({ cvAnalysis: 1 });

module.exports = mongoose.model('JobMatch', matchSchema);