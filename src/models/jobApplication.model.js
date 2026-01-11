const mongoose = require('mongoose');

/**
 * JobApplication Model
 * Tracks job applications from users to jobs
 */

const jobApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Application details
  coverLetter: String,
  resumeUrl: String,
  
  // Application status
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'interview', 'offered', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  
  // Interview details (if scheduled)
  interviewScheduled: {
    type: Boolean,
    default: false
  },
  interviewDate: Date,
  interviewTime: String,
  interviewLocation: String,
  interviewNotes: String,
  
  // Recruiter review
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  recruiterNotes: String,
  
  // Dates
  appliedAt: {
    type: Date,
    default: Date.now
  },
  
  // Additional info
  expectedSalary: Number,
  availableFrom: Date,
  noticePeriod: String,
  
  // Tracking
  source: {
    type: String,
    enum: ['direct', 'recommendation', 'referral'],
    default: 'direct'
  },
  
  isDeleted: {
    type: Boolean,
    default: false
  }
  
}, {
  timestamps: true
});

// Indexes
jobApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true }); // One application per user per job
jobApplicationSchema.index({ job: 1, status: 1 });
jobApplicationSchema.index({ applicant: 1, status: 1 });
jobApplicationSchema.index({ appliedAt: -1 });

// Update job application count when new application is created
jobApplicationSchema.post('save', async function(doc) {
  const Job = mongoose.model('Job');
  const count = await mongoose.model('JobApplication').countDocuments({ job: doc.job });
  await Job.findByIdAndUpdate(doc.job, { applicationCount: count });
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
