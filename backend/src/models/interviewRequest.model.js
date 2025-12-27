// const mongoose = require('mongoose');

// /**
//  * InterviewRequest Model
//  * Stores interview assessment requests sent by coaches to students
//  */

// const questionSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     enum: ['mcq', 'written'],
//     required: true
//   },
//   question: {
//     type: String,
//     required: true
//   },
//   // For MCQ questions
//   options: [{
//     type: String
//   }],
//   correctAnswer: {
//     type: String // Index of correct option (A, B, C, D) or the answer text
//   },
//   // For written questions
//   expectedLength: {
//     type: Number, // Expected word count
//     default: 200
//   },
//   points: {
//     type: Number,
//     default: 1
//   }
// });

// const interviewRequestSchema = new mongoose.Schema({
//   coach: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   student: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   title: {
//     type: String,
//     required: true
//   },
//   description: {
//     type: String
//   },
//   assessmentType: {
//     type: String,
//     enum: ['mcq', 'written', 'both'],
//     required: true
//   },
//   questions: [questionSchema],
  
//   timeLimit: {
//     type: Number, // in minutes
//     required: true,
//     default: 45
//   },
  
//   // One-time access token
//   accessToken: {
//     type: String,
//     required: true,
//     unique: true,
//     index: true
//   },
  
//   tokenStatus: {
//     type: String,
//     enum: ['unused', 'active', 'submitted', 'expired'],
//     default: 'unused'
//   },
  
//   // Security tracking
//   openedAt: Date,
//   openedByIP: String,
//   accessAttempts: {
//     type: Number,
//     default: 0
//   },
  
//   expiresAt: {
//     type: Date,
//     required: true
//   },
  
//   // Overall status
//   status: {
//     type: String,
//     enum: ['pending', 'in-progress', 'submitted', 'reviewed', 'expired'],
//     default: 'pending'
//   },
  
//   // Email tracking
//   emailSent: {
//     type: Boolean,
//     default: false
//   },
//   emailSentAt: Date,
  
//   // Metadata
//   totalPoints: Number,
  
//   // Soft delete
//   isDeleted: {
//     type: Boolean,
//     default: false
//   }
  
// }, {
//   timestamps: true
// });

// // Indexes
// interviewRequestSchema.index({ coach: 1, status: 1 });
// interviewRequestSchema.index({ student: 1, status: 1 });
// interviewRequestSchema.index({ accessToken: 1 });
// interviewRequestSchema.index({ expiresAt: 1 });

// // Calculate total points before saving
// interviewRequestSchema.pre('save', function(next) {
//   if (this.questions && this.questions.length > 0) {
//     this.totalPoints = this.questions.reduce((sum, q) => sum + (q.points || 1), 0);
//   }
//   next();
// });

// // Method to check if token is valid
// interviewRequestSchema.methods.isTokenValid = function() {
//   const now = new Date();
//   return (
//     this.tokenStatus === 'unused' &&
//     this.expiresAt > now &&
//     !this.isDeleted
//   );
// };

// // Method to mark token as used
// interviewRequestSchema.methods.markTokenUsed = function(ipAddress) {
//   this.tokenStatus = 'active';
//   this.status = 'in-progress';
//   this.openedAt = new Date();
//   this.openedByIP = ipAddress;
//   return this.save();
// };

// module.exports = mongoose.model('InterviewRequest', interviewRequestSchema);
const mongoose = require('mongoose');

/**
 * InterviewRequest Model
 * Stores interview assessment requests sent by coaches to students
 */

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mcq', 'written'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  // For MCQ questions
  options: [{
    type: String
  }],
  correctAnswer: {
    type: String // Index of correct option (A, B, C, D) or the answer text
  },
  // For written questions
  expectedLength: {
    type: Number, // Expected word count
    default: 200
  },
  points: {
    type: Number,
    default: 1
  }
});

const interviewRequestSchema = new mongoose.Schema({
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  assessmentType: {
    type: String,
    enum: ['mcq', 'written', 'both'],
    required: true
  },
  questions: [questionSchema],
  
  timeLimit: {
    type: Number, // in minutes
    required: true,
    default: 45
  },
  
  // One-time access token
  accessToken: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  tokenStatus: {
    type: String,
    enum: ['unused', 'active', 'submitted', 'expired'],
    default: 'unused'
  },
  
  // Security tracking
  openedAt: Date,
  openedByIP: String,
  accessAttempts: {
    type: Number,
    default: 0
  },
  
  expiresAt: {
    type: Date,
    required: true
  },
  
  // Overall status
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'submitted', 'reviewed', 'expired'],
    default: 'pending'
  },
  
  // Email tracking
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: Date,
  
  // Metadata
  totalPoints: Number,
  
  // Soft delete
  isDeleted: {
    type: Boolean,
    default: false
  }
  
}, {
  timestamps: true
});

// Indexes
interviewRequestSchema.index({ coach: 1, status: 1 });
interviewRequestSchema.index({ student: 1, status: 1 });
interviewRequestSchema.index({ accessToken: 1 });
interviewRequestSchema.index({ expiresAt: 1 });

// ✅ FIXED: Calculate total points before saving
interviewRequestSchema.pre('save', function(next) {
  if (this.questions && this.questions.length > 0) {
    this.totalPoints = this.questions.reduce((sum, q) => sum + (q.points || 1), 0);
  }
  next(); // ✅ CRITICAL - Must call next()
});

// Method to check if token is valid
interviewRequestSchema.methods.isTokenValid = function() {
  const now = new Date();
  return (
    this.tokenStatus === 'unused' &&
    this.expiresAt > now &&
    !this.isDeleted
  );
};

// Method to mark token as used
interviewRequestSchema.methods.markTokenUsed = function(ipAddress) {
  this.tokenStatus = 'active';
  this.status = 'in-progress';
  this.openedAt = new Date();
  this.openedByIP = ipAddress;
  return this.save();
};

module.exports = mongoose.model('InterviewRequest', interviewRequestSchema);