// const mongoose = require('mongoose');

// const ticketSchema = new mongoose.Schema({
//   ticketNumber: { type: String, unique: true },
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   subject: String,
//   description: String,
//   category: { type: String, enum: ['technical','account','billing','general'] },
//   priority: { type: String, enum: ['low','medium','high','urgent'], default: 'low' },
//   status: { type: String, enum: ['open','in_progress','resolved','closed'], default: 'open' },
//   assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   attachmentUrl: String,
//   resolvedAt: Date
// }, { timestamps: true });

// module.exports = mongoose.model('SupportTicket', ticketSchema);

const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketNumber: { 
    type: String, 
    unique: true, 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  subject: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  description: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 5000
  },
  category: { 
    type: String, 
    enum: ['technical', 'account', 'billing', 'general', 'cv_analysis', 'job_application', 'feature_request'],
    default: 'general',
    index: true
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'], 
    default: 'medium',
    index: true
  },
  status: { 
    type: String, 
    enum: ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'], 
    default: 'open',
    index: true
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    index: true
  },
  tags: [{ 
    type: String,
    trim: true 
  }],
  lastMessageAt: { 
    type: Date,
    default: Date.now,
    index: true
  },
  resolvedAt: Date,
  closedAt: Date,
  reopenedCount: { 
    type: Number, 
    default: 0 
  },
  messageCount: { 
    type: Number, 
    default: 0 
  },
  // Customer satisfaction
  rating: { 
    type: Number, 
    min: 1, 
    max: 5 
  },
  feedback: String,
  // SLA tracking
  firstResponseAt: Date,
  responseTime: Number, // in minutes
  resolutionTime: Number, // in minutes
  // Internal notes
  internalNotes: String,
  // Related tickets
  relatedTickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportTicket'
  }]
}, { 
  timestamps: true 
});

// Auto-increment ticket number
ticketSchema.pre('save', async function(next) {
  if (this.isNew && !this.ticketNumber) {
    const count = await mongoose.model('SupportTicket').countDocuments();
    this.ticketNumber = `TKT-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Update lastMessageAt when status changes
ticketSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.lastMessageAt = new Date();
  }
  
  // Set resolved/closed timestamps
  if (this.isModified('status')) {
    if (this.status === 'resolved' && !this.resolvedAt) {
      this.resolvedAt = new Date();
      // Calculate resolution time
      this.resolutionTime = Math.floor((this.resolvedAt - this.createdAt) / 60000); // minutes
    }
    if (this.status === 'closed' && !this.closedAt) {
      this.closedAt = new Date();
    }
  }
  
  next();
});

// Indexes for common queries
ticketSchema.index({ user: 1, status: 1 });
ticketSchema.index({ assignedTo: 1, status: 1 });
ticketSchema.index({ status: 1, priority: 1 });
ticketSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SupportTicket', ticketSchema);