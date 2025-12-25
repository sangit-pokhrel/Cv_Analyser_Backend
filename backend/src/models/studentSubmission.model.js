const mongoose = require('mongoose');

/**
 * StudentSubmission Model
 * Stores student answers to interview assessments
 */

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  questionType: {
    type: String,
    enum: ['mcq', 'written'],
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean // For MCQ only
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  // For written answers - coach evaluation
  coachNotes: String,
  coachScore: Number // For written questions
});

const studentSubmissionSchema = new mongoose.Schema({
  interviewRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewRequest',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  answers: [answerSchema],
  
  // Scoring
  totalPoints: Number,
  earnedPoints: Number,
  percentage: Number,
  
  // MCQ auto-score
  mcqScore: Number,
  mcqCorrect: Number,
  mcqTotal: Number,
  
  // Written questions (manual review)
  writtenScore: Number,
  writtenTotal: Number,
  
  // Timing
  startedAt: {
    type: Date,
    required: true
  },
  submittedAt: {
    type: Date,
    required: true
  },
  timeTaken: Number, // in minutes
  
  // IP tracking
  submittedFromIP: String,
  
  // Review status
  reviewStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  coachFeedback: {
    type: String
  },
  
  // Decision
  decision: {
    type: String,
    enum: ['pending', 'schedule-video', 'reject', 'on-hold'],
    default: 'pending'
  },
  
  decisionNotes: String,
  
  // Video interview scheduled
  videoInterviewScheduled: {
    type: Boolean,
    default: false
  },
  videoInterview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VideoInterview'
  }
  
}, {
  timestamps: true
});

// Indexes
studentSubmissionSchema.index({ interviewRequest: 1 });
studentSubmissionSchema.index({ student: 1 });
studentSubmissionSchema.index({ coach: 1, reviewStatus: 1 });
studentSubmissionSchema.index({ reviewStatus: 1 });

// Calculate scores before saving
studentSubmissionSchema.pre('save', function(next) {
  // Calculate time taken
  if (this.startedAt && this.submittedAt) {
    this.timeTaken = Math.round((this.submittedAt - this.startedAt) / (1000 * 60));
  }
  
  // Calculate MCQ score
  const mcqAnswers = this.answers.filter(a => a.questionType === 'mcq');
  if (mcqAnswers.length > 0) {
    this.mcqTotal = mcqAnswers.length;
    this.mcqCorrect = mcqAnswers.filter(a => a.isCorrect).length;
    this.mcqScore = this.mcqTotal > 0 ? Math.round((this.mcqCorrect / this.mcqTotal) * 100) : 0;
  }
  
  // Count written questions
  const writtenAnswers = this.answers.filter(a => a.questionType === 'written');
  if (writtenAnswers.length > 0) {
    this.writtenTotal = writtenAnswers.length;
  }
  
  // Calculate total earned points
  this.earnedPoints = this.answers.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);
  
  // Calculate percentage if total points available
  if (this.totalPoints > 0) {
    this.percentage = Math.round((this.earnedPoints / this.totalPoints) * 100);
  }
  
  next();
});

// Method to auto-grade MCQ
studentSubmissionSchema.methods.autoGradeMCQ = function(questions) {
  this.answers.forEach(answer => {
    if (answer.questionType === 'mcq') {
      const question = questions.find(q => q._id.toString() === answer.questionId.toString());
      if (question) {
        answer.isCorrect = (answer.answer === question.correctAnswer);
        answer.pointsEarned = answer.isCorrect ? (question.points || 1) : 0;
      }
    }
  });
};

module.exports = mongoose.model('StudentSubmission', studentSubmissionSchema);
