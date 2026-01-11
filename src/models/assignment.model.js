const mongoose = require('mongoose');

/**
 * Assignment Model
 * Assignments sent by coaches to eligible students
 * (Students who completed interview or are premium)
 */

const assignmentSchema = new mongoose.Schema({
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  title: {
    type: String,
    required: true
  },
  
  description: {
    type: String,
    required: true
  },
  
  // Assignment type
  type: {
    type: String,
    enum: ['project', 'task', 'reading', 'practice', 'other'],
    default: 'task'
  },
  
  // Difficulty
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  
  // Files/resources
  attachments: [{
    filename: String,
    url: String,
    fileType: String,
    uploadedAt: Date
  }],
  
  // Links
  resourceLinks: [{
    title: String,
    url: String
  }],
  
  // Deadline
  dueDate: {
    type: Date,
    required: true
  },
  
  // Points/credits
  points: {
    type: Number,
    default: 10
  },
  
  // Assigned to (multiple students)
  assignedTo: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedAt: Date,
    status: {
      type: String,
      enum: ['assigned', 'in-progress', 'submitted', 'reviewed', 'overdue'],
      default: 'assigned'
    },
    submittedAt: Date,
    submissionText: String,
    submissionFiles: [{
      filename: String,
      url: String,
      uploadedAt: Date
    }],
    grade: Number, // Out of total points
    feedback: String,
    reviewedAt: Date
  }],
  
  // Assignment settings
  allowLateSubmission: {
    type: Boolean,
    default: false
  },
  
  requiresFile: {
    type: Boolean,
    default: false
  },
  
  maxFileSize: {
    type: Number, // in MB
    default: 10
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'published', 'closed'],
    default: 'published'
  },
  
  // Statistics
  totalAssigned: {
    type: Number,
    default: 0
  },
  totalSubmitted: {
    type: Number,
    default: 0
  },
  totalReviewed: {
    type: Number,
    default: 0
  },
  
  // Soft delete
  isDeleted: {
    type: Boolean,
    default: false
  }
  
}, {
  timestamps: true
});

// Indexes
assignmentSchema.index({ coach: 1, status: 1 });
assignmentSchema.index({ 'assignedTo.student': 1 });
assignmentSchema.index({ dueDate: 1 });

// Update statistics before saving
assignmentSchema.pre('save', function(next) {
  if (this.assignedTo && this.assignedTo.length > 0) {
    this.totalAssigned = this.assignedTo.length;
    this.totalSubmitted = this.assignedTo.filter(a => a.status === 'submitted' || a.status === 'reviewed').length;
    this.totalReviewed = this.assignedTo.filter(a => a.status === 'reviewed').length;
  }
  next();
});

// Method to check if overdue
assignmentSchema.methods.isOverdue = function() {
  return new Date() > this.dueDate;
};

// Method to get student's assignment status
assignmentSchema.methods.getStudentStatus = function(studentId) {
  const assignment = this.assignedTo.find(a => a.student.toString() === studentId.toString());
  return assignment ? assignment.status : null;
};

// Static method to find eligible students
assignmentSchema.statics.findEligibleStudents = async function(coachId) {
  const User = mongoose.model('User');
  const VideoInterview = mongoose.model('VideoInterview');
  
  // Find students who:
  // 1. Completed a video interview with this coach
  // 2. OR are premium users
  
  const interviewedStudents = await VideoInterview.find({
    coach: coachId,
    status: 'completed'
  }).distinct('student');
  
  const premiumStudents = await User.find({
    role: 'job_seeker',
    isPremium: true
  }).distinct('_id');
  
  // Combine and remove duplicates
  const eligibleIds = [...new Set([...interviewedStudents, ...premiumStudents])];
  
  return User.find({ _id: { $in: eligibleIds } }).select('firstName lastName email');
};

module.exports = mongoose.model('Assignment', assignmentSchema);
