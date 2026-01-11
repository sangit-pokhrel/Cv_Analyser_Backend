// // src/models/user.model.js
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const { v4: uuidv4 } = require('uuid');

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//   password: { type: String, required: true }, // hashed
//   firstName: { type: String },
//   lastName: { type: String },
//   role: { type: String, enum: ['job_seeker', 'employer', 'admin', 'user', 'csr', 'sales','agent'], default: 'job_seeker' },
//   status: { type: String, enum: ['active', 'pending_verification', 'rejected', 'deactivated', 'verified'], default: 'pending_verification' },
//   resumeUrl: { type: String },
//   skills: [{ type: String }],
//   location: { type: String },
//   headline: { type: String },
//   isEmailVerified: { type: Boolean, default: false },
//   twoFactorEnabled: { type: Boolean, default: false },
//   twoFactorSecret: { type: String },
//   lastLoginAt: { type: Date },
//   failedLoginAttempts: { type: Number, default: 0 },
//   lockUntil: { type: Date },
//   tokenVersion: { type: Number, default: 0 },
//   phoneNumber: { type: String },
//   profilePictureUrl: { type: String },
//   passwordResetToken: { type: String },
//   passwordResetExpires: { type: Date },
// }, {
//   timestamps: true
// });

// // Recommended: async pre-save without next()
// // Mongoose treats async function as returning a Promise and will wait on it.
// userSchema.pre('save', async function() {
//   // `this` is the document being saved
//   if (!this.isModified('password')) return;

//   const salt = await bcrypt.genSalt(12);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // helper to compare password
// userSchema.methods.comparePassword = function(candidate) {
//   return bcrypt.compare(candidate, this.password);
// };

// userSchema.methods.incrementTokenVersion = function() {
//   this.tokenVersion += 1;
//   return this.save();
// };

// // Hide sensitive fields when converting to JSON
// userSchema.methods.toJSON = function() {
//   const obj = this.toObject();
//   delete obj.password;
//   delete obj.twoFactorSecret;
//   delete obj.failedLoginAttempts;
//   delete obj.lockUntil;
//   return obj;
// };

// const User = mongoose.model('User', userSchema);
// module.exports = User;


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String, enum: ['job_seeker', 'employer', 'admin', 'user', 'csr', 'sales', 'student', 'career_coach', 'recruiter'], default: 'job_seeker' },
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
  tokenVersion: { type: Number, default: 0 },
  phoneNumber: { type: String },
  profilePictureUrl: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  
  // ==================== AGENT RATING SYSTEM ====================
  agentRatings: [{
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SupportTicket'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    feedback: String,
    ratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    ratedAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before save
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.incrementTokenVersion = function() {
  this.tokenVersion += 1;
  return this.save();
};

// Calculate average rating whenever ratings change
userSchema.methods.calculateAverageRating = function() {
  if (this.agentRatings.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
  } else {
    const sum = this.agentRatings.reduce((acc, curr) => acc + curr.rating, 0);
    this.averageRating = Math.round((sum / this.agentRatings.length) * 10) / 10; // Round to 1 decimal
    this.totalRatings = this.agentRatings.length;
  }
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

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;

// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   // ==================== BASIC INFO ====================
//   email: { 
//     type: String, 
//     required: true, 
//     unique: true, 
//     lowercase: true, 
//     trim: true,
//     index: true
//   },
//   password: { 
//     type: String, 
//     required: true 
//   },
//   firstName: { 
//     type: String,
//     trim: true
//   },
//   lastName: { 
//     type: String,
//     trim: true
//   },
  
//   // ==================== ROLE & STATUS ====================
//   role: { 
//     type: String, 
//     enum: [
//       'job_seeker',
//       'employer', 
//       'admin', 
//       'user',
//       'csr',
//       'sales', 
//       'student',
//       'career_coach',
//       'recruiter'
//     ], 
//     default: 'job_seeker',
//     index: true
//   },
//   status: { 
//     type: String, 
//     enum: ['active', 'pending_verification', 'rejected', 'deactivated', 'verified', 'inactive', 'suspended'], 
//     default: 'pending_verification',
//     index: true
//   },
  
//   // ==================== PROFILE INFO ====================
//   resumeUrl: { type: String },
//   skills: [{ type: String }],
//   location: { type: String },
//   headline: { type: String },
//   phoneNumber: { type: String },
//   profilePictureUrl: { type: String },
  
//   // ==================== SECURITY ====================
//   isEmailVerified: { 
//     type: Boolean, 
//     default: false 
//   },
//   twoFactorEnabled: { 
//     type: Boolean, 
//     default: false 
//   },
//   twoFactorSecret: { 
//     type: String 
//   },
//   lastLoginAt: { 
//     type: Date 
//   },
//   failedLoginAttempts: { 
//     type: Number, 
//     default: 0 
//   },
//   lockUntil: { 
//     type: Date 
//   },
//   tokenVersion: { 
//     type: Number, 
//     default: 0 
//   },
//   passwordResetToken: { 
//     type: String 
//   },
//   passwordResetExpires: { 
//     type: Date 
//   },
  
//   // ==================== PREMIUM SYSTEM ====================
//   isPremium: {
//     type: Boolean,
//     default: false,
//     index: true
//   },
//   premiumActivatedAt: {
//     type: Date
//   },
//   premiumExpiresAt: {
//     type: Date
//   },
//   premiumPlan: {
//     type: String,
//     enum: ['basic', 'standard', 'premium', 'enterprise'],
//     default: 'basic'
//   },
//   premiumFeatures: [{
//     feature: String,
//     enabled: Boolean,
//     enabledAt: Date
//   }],
  
//   // ==================== COACH ASSIGNMENT ====================
//   assignedCoach: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     index: true
//   },
//   coachAssignedAt: {
//     type: Date
//   },
//   coachAssignedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
  
//   studentsCount: {
//     type: Number,
//     default: 0
//   },
  
//   // ==================== RECRUITER ASSIGNMENT ====================
//   assignedRecruiter: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     index: true
//   },
//   recruiterAssignedAt: {
//     type: Date
//   },
  
//   candidatesCount: {
//     type: Number,
//     default: 0
//   },
  
//   // ==================== AGENT RATING SYSTEM ====================
//   agentRatings: [{
//     ticket: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'SupportTicket'
//     },
//     rating: {
//       type: Number,
//       min: 1,
//       max: 5,
//       required: true
//     },
//     feedback: String,
//     ratedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     ratedAt: {
//       type: Date,
//       default: Date.now
//     }
//   }],
//   averageRating: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 5
//   },
//   totalRatings: {
//     type: Number,
//     default: 0
//   },
  
//   // ==================== COACH-SPECIFIC FIELDS ====================
//   coachProfile: {
//     specialization: [String],
//     yearsOfExperience: Number,
//     certifications: [String],
//     bio: String,
//     availability: {
//       monday: { available: Boolean, hours: String },
//       tuesday: { available: Boolean, hours: String },
//       wednesday: { available: Boolean, hours: String },
//       thursday: { available: Boolean, hours: String },
//       friday: { available: Boolean, hours: String },
//       saturday: { available: Boolean, hours: String },
//       sunday: { available: Boolean, hours: String }
//     },
//     hourlyRate: Number,
//     totalSessions: { type: Number, default: 0 },
//     totalStudents: { type: Number, default: 0 }
//   },
  
//   // ==================== RECRUITER-SPECIFIC FIELDS ====================
//   recruiterProfile: {
//     company: String,
//     department: String,
//     specialization: [String],
//     yearsOfExperience: Number,
//     bio: String,
//     totalJobPosts: { type: Number, default: 0 },
//     totalHires: { type: Number, default: 0 }
//   },
  
//   // ==================== SUBSCRIPTION & BILLING ====================
//   subscription: {
//     plan: {
//       type: String,
//       enum: ['free', 'basic', 'premium', 'enterprise'],
//       default: 'free'
//     },
//     status: {
//       type: String,
//       enum: ['free', 'active', 'cancelled', 'expired', 'trial'],
//       default: 'free'
//     },
//     startDate: Date,
//     endDate: Date,
//     autoRenew: { type: Boolean, default: false },
//     paymentMethod: String,
//     lastPaymentDate: Date,
//     nextBillingDate: Date
//   },
  
//   // ==================== ACTIVITY TRACKING ====================
//   stats: {
//     totalLogins: { type: Number, default: 0 },
//     totalJobApplications: { type: Number, default: 0 },
//     totalInterviewsCompleted: { type: Number, default: 0 },
//     totalAssignmentsCompleted: { type: Number, default: 0 },
//     totalJobsPosted: { type: Number, default: 0 },
//     totalAssessmentsCreated: { type: Number, default: 0 }
//   },
  
//   // ==================== PREFERENCES ====================
//   preferences: {
//     emailNotifications: { type: Boolean, default: true },
//     smsNotifications: { type: Boolean, default: false },
//     jobAlerts: { type: Boolean, default: true },
//     marketingEmails: { type: Boolean, default: false },
//     language: { type: String, default: 'en' },
//     timezone: { type: String, default: 'UTC' }
//   },
  
//   // ==================== SOFT DELETE ====================
//   isDeleted: {
//     type: Boolean,
//     default: false
//   },
//   deletedAt: {
//     type: Date
//   },
//   deletedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }
  
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // ==================== INDEXES ====================
// userSchema.index({ email: 1 });
// userSchema.index({ role: 1, status: 1 });
// userSchema.index({ isPremium: 1, role: 1 });
// userSchema.index({ assignedCoach: 1 });
// userSchema.index({ assignedRecruiter: 1 });
// userSchema.index({ 'subscription.status': 1 });
// userSchema.index({ isDeleted: 1 });
// userSchema.index({ createdAt: -1 });

// // ==================== VIRTUALS ====================
// userSchema.virtual('fullName').get(function() {
//   return `${this.firstName || ''} ${this.lastName || ''}`.trim();
// });

// userSchema.virtual('isPremiumActive').get(function() {
//   if (!this.isPremium) return false;
//   if (!this.premiumExpiresAt) return true;
//   return new Date() < this.premiumExpiresAt;
// });

// userSchema.virtual('isLocked').get(function() {
//   return !!(this.lockUntil && this.lockUntil > Date.now());
// });

// // ==================== PRE-SAVE HOOKS ====================
// // ⚠️ ONLY ONE PRE-SAVE HOOK - PASSWORD HASHING
// userSchema.pre('save', async function(next) {
//   // Only hash password if it's modified
//   if (!this.isModified('password')) {
//     return next();
//   }

//   try {
//     const salt = await bcrypt.genSalt(12);
//     this.password = await bcrypt.hash(this.password, salt);
//     return next();
//   } catch (error) {
//     return next(error);
//   }
// });

// // ==================== METHODS ====================
// userSchema.methods.comparePassword = function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// userSchema.methods.incrementTokenVersion = function() {
//   this.tokenVersion += 1;
//   return this.save();
// };

// userSchema.methods.calculateAverageRating = function() {
//   if (this.agentRatings.length === 0) {
//     this.averageRating = 0;
//     this.totalRatings = 0;
//   } else {
//     const sum = this.agentRatings.reduce((acc, curr) => acc + curr.rating, 0);
//     this.averageRating = Math.round((sum / this.agentRatings.length) * 10) / 10;
//     this.totalRatings = this.agentRatings.length;
//   }
//   return this.save();
// };

// userSchema.methods.activatePremium = function(plan = 'premium', durationDays = 30) {
//   this.isPremium = true;
//   this.premiumActivatedAt = new Date();
//   this.premiumExpiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
//   this.premiumPlan = plan;
//   this.subscription.plan = plan;
//   this.subscription.status = 'active';
//   this.subscription.startDate = new Date();
//   this.subscription.endDate = this.premiumExpiresAt;
//   return this.save();
// };

// userSchema.methods.deactivatePremium = function() {
//   this.isPremium = false;
//   this.premiumExpiresAt = new Date();
//   this.subscription.status = 'expired';
//   return this.save();
// };

// userSchema.methods.checkPremiumExpiry = function() {
//   if (this.isPremium && this.premiumExpiresAt && new Date() > this.premiumExpiresAt) {
//     return this.deactivatePremium();
//   }
//   return Promise.resolve(this);
// };

// userSchema.methods.assignToCoach = function(coachId, assignedBy = null) {
//   this.assignedCoach = coachId;
//   this.coachAssignedAt = new Date();
//   if (assignedBy) this.coachAssignedBy = assignedBy;
//   return this.save();
// };

// userSchema.methods.removeCoachAssignment = function() {
//   this.assignedCoach = null;
//   this.coachAssignedAt = null;
//   this.coachAssignedBy = null;
//   return this.save();
// };

// userSchema.methods.softDelete = function(deletedBy = null) {
//   this.isDeleted = true;
//   this.deletedAt = new Date();
//   if (deletedBy) this.deletedBy = deletedBy;
//   this.status = 'deactivated';
//   return this.save();
// };

// userSchema.methods.restore = function() {
//   this.isDeleted = false;
//   this.deletedAt = null;
//   this.deletedBy = null;
//   this.status = 'active';
//   return this.save();
// };

// userSchema.methods.recordLogin = function() {
//   this.lastLoginAt = new Date();
//   if (!this.stats) {
//     this.stats = {};
//   }
//   this.stats.totalLogins = (this.stats.totalLogins || 0) + 1;
//   this.failedLoginAttempts = 0;
//   return this.save();
// };

// userSchema.methods.recordFailedLogin = function() {
//   this.failedLoginAttempts += 1;
  
//   if (this.failedLoginAttempts >= 5) {
//     this.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
//   }
  
//   return this.save();
// };

// userSchema.methods.unlock = function() {
//   this.failedLoginAttempts = 0;
//   this.lockUntil = null;
//   return this.save();
// };

// // ==================== STATICS ====================
// userSchema.statics.findActivePremium = function() {
//   return this.find({
//     isPremium: true,
//     status: 'active',
//     isDeleted: false,
//     $or: [
//       { premiumExpiresAt: null },
//       { premiumExpiresAt: { $gte: new Date() } }
//     ]
//   });
// };

// userSchema.statics.findCoachStudents = function(coachId) {
//   return this.find({
//     assignedCoach: coachId,
//     role: 'job_seeker',
//     isPremium: true,
//     status: 'active',
//     isDeleted: false
//   });
// };

// userSchema.statics.findByRole = function(role, filters = {}) {
//   return this.find({
//     role,
//     isDeleted: false,
//     ...filters
//   });
// };

// // ==================== QUERY HELPERS ====================
// userSchema.query.notDeleted = function() {
//   return this.where({ isDeleted: false });
// };

// userSchema.query.active = function() {
//   return this.where({ status: 'active', isDeleted: false });
// };

// userSchema.query.premium = function() {
//   return this.where({ isPremium: true, isDeleted: false });
// };

// // ==================== JSON TRANSFORMATION ====================
// userSchema.methods.toJSON = function() {
//   const obj = this.toObject();
  
//   delete obj.password;
//   delete obj.twoFactorSecret;
//   delete obj.failedLoginAttempts;
//   delete obj.lockUntil;
//   delete obj.tokenVersion;
//   delete obj.passwordResetToken;
//   delete obj.passwordResetExpires;
  
//   return obj;
// };

// userSchema.methods.toPublicJSON = function() {
//   return {
//     _id: this._id,
//     firstName: this.firstName,
//     lastName: this.lastName,
//     fullName: this.fullName,
//     email: this.email,
//     role: this.role,
//     profilePictureUrl: this.profilePictureUrl,
//     headline: this.headline,
//     location: this.location,
//     isPremium: this.isPremium,
//     averageRating: this.averageRating,
//     totalRatings: this.totalRatings
//   };
// };

// const User = mongoose.models.User || mongoose.model('User', userSchema);

// module.exports = User;