const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String },
  message: { type: String },
  inquiryType: { type: String, enum: ['general','support','partnership','feedback','sales'], default: 'general' },
  status: { type: String, enum: ['new','contacted','resolved'], default: 'new' },
  attachmentUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ContactInquiry', contactSchema);
