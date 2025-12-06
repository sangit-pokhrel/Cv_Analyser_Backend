const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // hashed
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String, enum: ['job_seeker', 'employer', 'admin'], default: 'job_seeker' },
  status: { type: String, enum: ['active', 'pending_verification', 'disabled'], default: 'pending_verification' }
}, {
  timestamps: true
});


userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
