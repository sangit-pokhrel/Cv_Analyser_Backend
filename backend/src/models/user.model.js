// src/models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // hashed
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String, enum: ['job_seeker', 'employer', 'admin', 'user'], default: 'job_seeker' },
  status: { type: String, enum: ['active', 'pending_verification', 'rejected', 'deactivated', 'verified'], default: 'pending_verification' },
  resumeUrl: { type: String },
  skills: [{ type: String }],
  location: { type: String },
  headline: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
  lastLoginAt: { type: Date },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  tokenVersion: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Recommended: async pre-save without next()
// Mongoose treats async function as returning a Promise and will wait on it.
userSchema.pre('save', async function() {
  // `this` is the document being saved
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// helper to compare password
userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.incrementTokenVersion = function() {
  this.tokenVersion += 1;
  return this.save();
};

// Hide sensitive fields when converting to JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.twoFactorSecret;
  delete obj.failedLoginAttempts;
  delete obj.lockUntil;
  return obj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
