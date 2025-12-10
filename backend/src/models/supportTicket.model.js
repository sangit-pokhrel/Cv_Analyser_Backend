const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: String,
  description: String,
  category: { type: String, enum: ['technical','account','billing','general'] },
  priority: { type: String, enum: ['low','medium','high','urgent'], default: 'low' },
  status: { type: String, enum: ['open','in_progress','resolved','closed'], default: 'open' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attachmentUrl: String,
  resolvedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', ticketSchema);