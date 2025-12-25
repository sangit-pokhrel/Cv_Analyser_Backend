const mongoose = require('mongoose');

/**
 * VideoInterview Model
 * Manages scheduled video interview calls between coach and student
 */

const videoInterviewSchema = new mongoose.Schema({
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
  
  // Related to assessment
  interviewRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewRequest'
  },
  submission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentSubmission',
    required: true
  },
  
  // Scheduling
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String, // "14:00"
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 30,
    enum: [30, 45, 60]
  },
  
  // Video call details
  platform: {
    type: String,
    enum: ['daily', 'zoom', 'meet'],
    default: 'daily'
  },
  roomId: {
    type: String,
    unique: true,
    sparse: true
  },
  meetingLink: {
    type: String
  },
  
  // Join tracking
  coachJoinedAt: Date,
  studentJoinedAt: Date,
  
  // Status
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  
  // Notes for student
  notesForStudent: String,
  
  // Reminder emails
  reminderSent24h: {
    type: Boolean,
    default: false
  },
  reminderSent1h: {
    type: Boolean,
    default: false
  },
  
  // Feedback after interview
  coachFeedback: String,
  studentFeedback: String,
  
  // Rating
  coachRating: {
    type: Number,
    min: 1,
    max: 5
  },
  
  // Final decision
  result: {
    type: String,
    enum: ['pass', 'fail', 'pending'],
    default: 'pending'
  },
  resultNotes: String,
  
  // Recording (if enabled)
  recordingUrl: String,
  
  // Cancellation
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: String,
  cancelledAt: Date,
  
  // Completion
  completedAt: Date,
  actualDuration: Number, // actual minutes spent
  
}, {
  timestamps: true
});

// Indexes
videoInterviewSchema.index({ coach: 1, status: 1 });
videoInterviewSchema.index({ student: 1, status: 1 });
videoInterviewSchema.index({ scheduledDate: 1, status: 1 });
videoInterviewSchema.index({ roomId: 1 });

// Virtual for full scheduled datetime
videoInterviewSchema.virtual('scheduledDateTime').get(function() {
  if (!this.scheduledDate || !this.scheduledTime) return null;
  
  const [hours, minutes] = this.scheduledTime.split(':');
  const date = new Date(this.scheduledDate);
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  return date;
});

// Method to check if interview is upcoming
videoInterviewSchema.methods.isUpcoming = function() {
  const now = new Date();
  const scheduled = this.scheduledDateTime;
  return scheduled && scheduled > now && this.status === 'scheduled';
};

// Method to check if interview is today
videoInterviewSchema.methods.isToday = function() {
  const now = new Date();
  const scheduled = new Date(this.scheduledDate);
  return (
    scheduled.getDate() === now.getDate() &&
    scheduled.getMonth() === now.getMonth() &&
    scheduled.getFullYear() === now.getFullYear()
  );
};

// Method to get time until interview
videoInterviewSchema.methods.getTimeUntil = function() {
  const now = new Date();
  const scheduled = this.scheduledDateTime;
  
  if (!scheduled) return null;
  
  const diff = scheduled - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { hours, minutes, totalMinutes: Math.floor(diff / (1000 * 60)) };
};

module.exports = mongoose.model('VideoInterview', videoInterviewSchema);
