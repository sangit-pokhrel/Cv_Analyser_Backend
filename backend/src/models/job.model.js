const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  companyName: String,
  companyLogoUrl: String,
  description: String,
  requirements: mongoose.Schema.Types.Mixed,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'JobCategory' },
  location: String,
  jobType: { type: String, enum: ['full-time','part-time','contract','remote'], default: 'full-time' },
  salaryMin: Number,
  salaryMax: Number,
  experienceLevel: { type: String, enum: ['entry','mid','senior'] },
  status: { type: String, enum: ['active','closed','draft'], default: 'active' },
  postedDate: { type: Date, default: Date.now },
  deadline: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

jobSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Job', jobSchema);
