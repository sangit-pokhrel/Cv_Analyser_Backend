
const mongoose = require('mongoose');

const assignedAgentSchema = new mongoose.Schema({
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  role: {
    type: String,
    enum: ['primary', 'collaborator'],
    default: 'collaborator'
  },
  assignedAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: Date
}, { _id: false });

const ticketSchema = new mongoose.Schema({
  ticketNumber: { 
    type: String, 
    unique: true
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
    enum: ['open', 'pending_assignment', 'in_progress', 'waiting_customer', 'resolved', 'closed'], 
    default: 'open',
    index: true
  },
  // Multi-agent support
  assignedAgents: [assignedAgentSchema],
  primaryAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  pendingAgents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
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
  }],
  // Email notifications sent
  emailsSent: [{
    type: {
      type: String,
      enum: ['ticket_created', 'agent_assigned', 'agent_accepted', 'new_message', 'status_changed', 'ticket_resolved', 'ticket_closed']
    },
    sentTo: String,
    sentAt: Date,
    success: Boolean
  }]
}, { 
  timestamps: true 
});

// Auto-generate ticket number
ticketSchema.pre('save', async function() {
  if (this.isNew && !this.ticketNumber) {
    const SupportTicket = mongoose.model('SupportTicket');
    const count = await SupportTicket.countDocuments();
    this.ticketNumber = `TKT-${String(count + 1).padStart(6, '0')}`;
    console.log(`📋 Generated ticket number: ${this.ticketNumber}`);
  }
  
  // Update lastMessageAt when status changes
  if (this.isModified('status') && !this.isNew) {
    this.lastMessageAt = new Date();
  }
  
  // Set resolved/closed timestamps
  if (this.isModified('status')) {
    if (this.status === 'resolved' && !this.resolvedAt) {
      this.resolvedAt = new Date();
      this.resolutionTime = Math.floor((this.resolvedAt - this.createdAt) / 60000);
    }
    if (this.status === 'closed' && !this.closedAt) {
      this.closedAt = new Date();
    }
  }
});

// Indexes
ticketSchema.index({ user: 1, status: 1 });
ticketSchema.index({ 'assignedAgents.agent': 1, status: 1 });
ticketSchema.index({ primaryAgent: 1, status: 1 });
ticketSchema.index({ status: 1, priority: 1 });
ticketSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SupportTicket', ticketSchema);