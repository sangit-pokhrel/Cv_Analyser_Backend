
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  
  // Application type
  applicationType: {
    type: String,
    enum: ['internal', 'external_redirect'],
    required: true
  },
  
  // For internal applications
  status: { 
    type: String, 
    enum: ['pending','under_review','accepted','rejected','interview_scheduled'], 
    default: 'pending' 
  },
  coverLetter: String,
  resumeUrl: String,
  reviewedDate: Date,
  notes: String,
  
  // For external applications (Option A)
  externalClickedAt: { type: Date }, // When user clicked "Apply on [Source]"
  externalStatus: {
    type: String,
    enum: ['clicked', 'interested'], // Simple tracking for external
    default: 'clicked'
  },
  
  appliedDate: { type: Date, default: Date.now }
  
}, { timestamps: true });

applicationSchema.index({ user: 1, job: 1 }, { unique: true });
module.exports = mongoose.model('JobApplication', applicationSchema);


// const mongoose = require('mongoose');

// const applicationSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
//   status: { type: String, enum: ['pending','under_review','accepted','rejected','interview_scheduled'], default: 'pending' },
//   coverLetter: String,
//   resumeUrl: String,
//   appliedDate: { type: Date, default: Date.now },
//   reviewedDate: Date,
//   notes: String
// }, { timestamps: true });

// applicationSchema.index({ user: 1, job: 1 }, { unique: true }); // one application per user per job
// module.exports = mongoose.model('JobApplication', applicationSchema);
