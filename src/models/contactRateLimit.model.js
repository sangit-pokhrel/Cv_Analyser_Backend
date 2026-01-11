const mongoose = require('mongoose');

const contactRateLimitSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: String, 
    required: true,
    index: true
  },
  count: {
    type: Number,
    default: 0
  },
  lastInquiryAt: {
    type: Date,
    default: null
  },
  inquiryTimestamps: [{
    type: Date
  }]
}, {
  timestamps: true
});

// Compound index for efficient lookups
contactRateLimitSchema.index({ ip: 1, date: 1 }, { unique: true });

// TTL index to auto-delete records after 7 days
contactRateLimitSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

// Static method to get today's date string
contactRateLimitSchema.statics.getTodayString = function() {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
};

// Static method to check rate limit status for an IP
contactRateLimitSchema.statics.checkRateLimit = async function(ip, maxPerDay = 3, cooldownMinutes = 5) {
  const today = this.getTodayString();
  const record = await this.findOne({ ip, date: today });
  
  if (!record) {
    return {
      allowed: true,
      remainingToday: maxPerDay,
      nextAllowedAt: null
    };
  }
  
  // Check daily limit
  if (record.count >= maxPerDay) {
    return {
      allowed: false,
      reason: 'daily_limit',
      remainingToday: 0,
      count: record.count,
      message: `You have reached the maximum of ${maxPerDay} inquiries per day. Please try again tomorrow.`
    };
  }
  
  // Check cooldown period (5 minutes between inquiries)
  if (record.lastInquiryAt) {
    const timeSinceLastInquiry = Date.now() - new Date(record.lastInquiryAt).getTime();
    const cooldownMs = cooldownMinutes * 60 * 1000;
    
    if (timeSinceLastInquiry < cooldownMs) {
      const remainingSeconds = Math.ceil((cooldownMs - timeSinceLastInquiry) / 1000);
      return {
        allowed: false,
        reason: 'cooldown',
        remainingToday: maxPerDay - record.count,
        retryAfter: remainingSeconds,
        nextAllowedAt: new Date(record.lastInquiryAt.getTime() + cooldownMs),
        message: `Please wait ${Math.ceil(remainingSeconds / 60)} minutes before submitting another inquiry.`
      };
    }
  }
  
  return {
    allowed: true,
    remainingToday: maxPerDay - record.count,
    nextAllowedAt: null
  };
};

// Static method to record an inquiry
contactRateLimitSchema.statics.recordInquiry = async function(ip) {
  const today = this.getTodayString();
  const now = new Date();
  
  const record = await this.findOneAndUpdate(
    { ip, date: today },
    {
      $inc: { count: 1 },
      $set: { lastInquiryAt: now },
      $push: { inquiryTimestamps: now }
    },
    { 
      upsert: true, 
      new: true,
      setDefaultsOnInsert: true
    }
  );
  
  return record;
};

// Static method to get stats for an IP
contactRateLimitSchema.statics.getStats = async function(ip) {
  const today = this.getTodayString();
  const record = await this.findOne({ ip, date: today });
  
  if (!record) {
    return {
      todayCount: 0,
      lastInquiryAt: null,
      inquiryTimestamps: []
    };
  }
  
  return {
    todayCount: record.count,
    lastInquiryAt: record.lastInquiryAt,
    inquiryTimestamps: record.inquiryTimestamps
  };
};

const ContactRateLimit = mongoose.model('ContactRateLimit', contactRateLimitSchema);

module.exports = ContactRateLimit;