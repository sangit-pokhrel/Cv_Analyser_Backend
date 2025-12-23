
const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  url: { type: String, required: true },
  filename: String,
  fileType: String,
  fileSize: Number
}, { _id: false });

const supportMessageSchema = new mongoose.Schema({
  ticket: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SupportTicket', 
    required: true,
    index: true
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  senderRole: {
    type: String,
    enum: ['job_seeker', 'employer', 'admin', 'csr', 'sales', 'user'],
    required: true
  },
  message: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 5000
  },
  attachments: [attachmentSchema],
  isInternal: { 
    type: Boolean, 
    default: false 
  }, // Internal notes visible only to staff
  isRead: { 
    type: Boolean, 
    default: false 
  },
  readAt: Date,
  editedAt: Date,
  isEdited: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true 
});

// Index for efficient queries
supportMessageSchema.index({ ticket: 1, createdAt: -1 });
supportMessageSchema.index({ sender: 1 });

// Update ticket's lastMessageAt when new message is created
supportMessageSchema.post('save', async function() {
  const SupportTicket = mongoose.model('SupportTicket');
  await SupportTicket.findByIdAndUpdate(
    this.ticket,
    { 
      lastMessageAt: new Date(),
      $inc: { messageCount: 1 }
    }
  );
  
  // Set first response time for agent's first reply
  if (['admin', 'csr', 'sales'].includes(this.senderRole)) {
    const ticket = await SupportTicket.findById(this.ticket);
    if (!ticket.firstResponseAt) {
      const responseTime = Math.floor((new Date() - ticket.createdAt) / 60000); // minutes
      await SupportTicket.findByIdAndUpdate(
        this.ticket,
        { 
          firstResponseAt: new Date(),
          responseTime: responseTime
        }
      );
    }
  }
});

module.exports = mongoose.model('SupportMessage', supportMessageSchema);