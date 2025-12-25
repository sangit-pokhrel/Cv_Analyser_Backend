const mongoose = require('mongoose');

/**
 * Job Model (Enhanced for Recruiter)
 * Job postings created by recruiters
 */

const jobSchema = new mongoose.Schema({
  // Posted by recruiter
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Company info
  companyName: {
    type: String,
    required: true
  },
  companyLogo: String,
  companyWebsite: String,
  
  // Job details
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Requirements
  requiredSkills: [{
    type: String
  }],
  
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead'],
    required: true
  },
  
  minExperience: Number, // years
  maxExperience: Number,
  
  // Education
  education: {
    type: String,
    enum: ['high-school', 'bachelors', 'masters', 'phd', 'any'],
    default: 'bachelors'
  },
  
  // Employment details
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true
  },
  
  workMode: {
    type: String,
    enum: ['onsite', 'remote', 'hybrid'],
    default: 'onsite'
  },
  
  location: {
    type: String,
    required: true
  },
  
  // Salary
  salaryMin: Number,
  salaryMax: Number,
  salaryCurrency: {
    type: String,
    default: 'NPR'
  },
  
  // Dates
  postedDate: {
    type: Date,
    default: Date.now
  },
  deadline: Date,
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'filled'],
    default: 'active'
  },
  
  // Application settings
  maxApplicants: {
    type: Number,
    default: 100
  },
  
  applicationCount: {
    type: Number,
    default: 0
  },
  
  // Visibility
  isPublic: {
    type: Boolean,
    default: true
  },
  
  // Featured
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Additional info
  benefits: [String],
  responsibilities: [String],
  
  // Contact
  contactEmail: String,
  contactPhone: String,
  
  // Soft delete
  isDeleted: {
    type: Boolean,
    default: false
  }
  
}, {
  timestamps: true
});

// Indexes
jobSchema.index({ postedBy: 1, status: 1 });
jobSchema.index({ status: 1, isPublic: 1 });
jobSchema.index({ requiredSkills: 1 });
jobSchema.index({ experienceLevel: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ createdAt: -1 });

// Check if job is expired
jobSchema.virtual('isExpired').get(function() {
  return this.deadline && new Date() > this.deadline;
});

// Check if accepting applications
jobSchema.virtual('acceptingApplications').get(function() {
  return (
    this.status === 'active' &&
    !this.isExpired &&
    this.applicationCount < this.maxApplicants
  );
});

module.exports = mongoose.model('Job', jobSchema);
