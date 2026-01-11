const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['email_verify', 'password_reset', 'two_factor'],
    default: 'email_verify'
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index - auto delete when expired
  },
  attempts: {
    type: Number,
    default: 0
  },
  maxAttempts: {
    type: Number,
    default: 5
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient lookups
otpSchema.index({ user: 1, type: 1 });
otpSchema.index({ email: 1, type: 1 });

// Check if OTP is still valid
otpSchema.methods.isValid = function() {
  return !this.isUsed && 
         this.expiresAt > new Date() && 
         this.attempts < this.maxAttempts;
};

// Check if OTP matches
otpSchema.methods.verify = async function(inputOtp) {
  if (!this.isValid()) {
    return { valid: false, reason: this.isUsed ? 'already_used' : this.expiresAt <= new Date() ? 'expired' : 'max_attempts' };
  }
  
  this.attempts += 1;
  
  if (this.otp === inputOtp) {
    this.isUsed = true;
    await this.save();
    return { valid: true };
  }
  
  await this.save();
  
  const attemptsLeft = this.maxAttempts - this.attempts;
  return { 
    valid: false, 
    reason: 'invalid_otp',
    attemptsLeft
  };
};

// Static method to generate 6-digit OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Static method to create new OTP for user
otpSchema.statics.createOTP = async function(userId, email, type = 'email_verify', expiryMinutes = 10) {
  // Invalidate any existing OTPs for this user and type
  await this.updateMany(
    { user: userId, type, isUsed: false },
    { isUsed: true }
  );
  
  const otp = this.generateOTP();
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
  
  const otpDoc = await this.create({
    user: userId,
    email,
    otp,
    type,
    expiresAt
  });
  
  return { otp, otpDoc };
};

// Static method to verify OTP
otpSchema.statics.verifyOTP = async function(userId, inputOtp, type = 'email_verify') {
  const otpDoc = await this.findOne({
    user: userId,
    type,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  }).sort({ createdAt: -1 });
  
  if (!otpDoc) {
    return { valid: false, reason: 'no_otp_found' };
  }
  
  return otpDoc.verify(inputOtp);
};

// Static method to check if user can request new OTP (rate limiting)
otpSchema.statics.canRequestNewOTP = async function(userId, type = 'email_verify', cooldownSeconds = 60) {
  const recentOTP = await this.findOne({
    user: userId,
    type,
    createdAt: { $gt: new Date(Date.now() - cooldownSeconds * 1000) }
  });
  
  if (recentOTP) {
    const waitTime = Math.ceil((recentOTP.createdAt.getTime() + cooldownSeconds * 1000 - Date.now()) / 1000);
    return { canRequest: false, waitTime };
  }
  
  return { canRequest: true };
};

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;