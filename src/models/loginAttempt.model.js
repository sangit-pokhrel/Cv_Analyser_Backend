const mongoose = require('mongoose');

const loginAttemptSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  attemptCount: {
    type: Number,
    default: 1
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedUntil: {
    type: Date,
    default: null
  },
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  lastAttemptAt: {
    type: Date,
    default: Date.now
  },
  userAgent: String,
  attempts: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: String,
    userAgent: String,
    success: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Compound index for faster queries
loginAttemptSchema.index({ email: 1, ipAddress: 1 });

// Index for cleanup of old records
loginAttemptSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 }); // Auto-delete after 7 days

// Method to check if blocked
loginAttemptSchema.methods.isCurrentlyBlocked = function() {
  if (!this.isBlocked) return false;
  if (!this.blockedUntil) return true; // Permanent block
  return new Date() < this.blockedUntil;
};

// Method to reset attempts
loginAttemptSchema.methods.resetAttempts = function() {
  this.attemptCount = 0;
  this.isBlocked = false;
  this.blockedUntil = null;
  this.attempts = [];
  return this.save();
};

// Static method to clean expired blocks
loginAttemptSchema.statics.cleanExpiredBlocks = async function() {
  const now = new Date();
  return this.updateMany(
    { isBlocked: true, blockedUntil: { $lt: now } },
    { $set: { isBlocked: false, blockedUntil: null, attemptCount: 0 } }
  );
};

module.exports = mongoose.model('LoginAttempt', loginAttemptSchema);