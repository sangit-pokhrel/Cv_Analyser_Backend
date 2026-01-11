const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  createdByIp: { type: String },
  revokedAt: { type: Date },
  replacedByToken: { type: String },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });


refreshTokenSchema.virtual('isActive').get(function() {
  return !this.revokedAt && new Date() < this.expiresAt;
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
module.exports = RefreshToken;
