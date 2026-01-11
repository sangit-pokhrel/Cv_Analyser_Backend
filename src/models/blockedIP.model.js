const mongoose = require('mongoose');

const blockedIPSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  reason: {
    type: String,
    default: 'Exceeded daily rate limit'
  },
  blockedAt: {
    type: Date,
    default: Date.now
  },
  blockedUntil: {
    type: Date,
    default: null // null means permanently blocked until manually unblocked
  },
  violationCount: {
    type: Number,
    default: 1
  },
  lastViolation: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to check if IP is currently blocked
blockedIPSchema.methods.isCurrentlyBlocked = function() {
  if (!this.blockedUntil) {
    return true; // Permanently blocked
  }
  return new Date() < this.blockedUntil;
};

// Static method to check if an IP is blocked
blockedIPSchema.statics.isBlocked = async function(ip) {
  const record = await this.findOne({ ip });
  if (!record) return { blocked: false };
  
  if (record.isCurrentlyBlocked()) {
    return { 
      blocked: true, 
      reason: record.reason,
      blockedUntil: record.blockedUntil
    };
  }
  
  // If block has expired, remove the record
  await this.findByIdAndDelete(record._id);
  return { blocked: false };
};

// Static method to block an IP
blockedIPSchema.statics.blockIP = async function(ip, reason = 'Exceeded daily rate limit', durationHours = null) {
  const blockedUntil = durationHours ? new Date(Date.now() + durationHours * 60 * 60 * 1000) : null;
  
  const existing = await this.findOne({ ip });
  if (existing) {
    existing.violationCount += 1;
    existing.lastViolation = new Date();
    existing.reason = reason;
    existing.blockedUntil = blockedUntil;
    await existing.save();
    return existing;
  }
  
  return await this.create({
    ip,
    reason,
    blockedUntil
  });
};

// Static method to unblock an IP
blockedIPSchema.statics.unblockIP = async function(ip) {
  return await this.findOneAndDelete({ ip });
};

const BlockedIP = mongoose.model('BlockedIP', blockedIPSchema);

module.exports = BlockedIP;