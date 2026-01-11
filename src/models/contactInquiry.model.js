// const mongoose = require('mongoose');

// const contactSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
//   name: { type: String },
//   email: { type: String, required: true },
//   phone: { type: String },
//   subject: { type: String },
//   message: { type: String },
//   inquiryType: { type: String, enum: ['general','support','partnership','feedback','sales'], default: 'general' },
//   status: { type: String, enum: ['new','contacted','resolved'], default: 'new' },
//   attachmentUrl: { type: String }
// }, { timestamps: true });

// module.exports = mongoose.model('ContactInquiry', contactSchema);

const mongoose = require('mongoose');

const contactInquirySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Can be null for anonymous submissions
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [5000, 'Message cannot exceed 5000 characters']
  },
  inquiryType: {
    type: String,
    enum: ['general', 'support', 'sales', 'partnership', 'feedback', 'other'],
    default: 'general'
  },
  attachmentUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'resolved'],
    default: 'new'
  },
  ipAddress: {
    type: String,
    trim: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  deletedAt: {
    type: Date,
    default: null
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
contactInquirySchema.index({ email: 1 });
contactInquirySchema.index({ status: 1 });
contactInquirySchema.index({ inquiryType: 1 });
contactInquirySchema.index({ createdAt: -1 });
contactInquirySchema.index({ user: 1, createdAt: -1 });
contactInquirySchema.index({ ipAddress: 1, createdAt: -1 });

// Virtual for formatted date
contactInquirySchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Method to soft delete
contactInquirySchema.methods.softDelete = async function(deletedBy = null) {
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  return await this.save();
};

// Static method to find non-deleted inquiries
contactInquirySchema.statics.findActive = function(filter = {}) {
  return this.find({ ...filter, deletedAt: { $exists: false } });
};



const ContactInquiry = mongoose.model('ContactInquiry', contactInquirySchema);

module.exports = ContactInquiry;