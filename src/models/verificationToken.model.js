const mongoose = require('mongoose');

const verificationTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  type: { type: String, enum: ['email_verify','password_reset'], required: true },
  expiresAt: { type: Date, required: true },
  consumed: { type: Boolean, default: false }
}, { timestamps: true });

const VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema);
module.exports = VerificationToken;
