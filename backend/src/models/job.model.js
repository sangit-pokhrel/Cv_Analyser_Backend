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
  
  // Fields for handling both manual and scraped jobs
  jobSource: { 
    type: String, 
    enum: ['manual', 'linkedin', 'indeed', 'merojob', 'kumarijob', 'other'], 
    default: 'manual',
    required: true
  },
  externalUrl: { type: String }, // Required for scraped jobs
  externalId: { type: String }, // Original job ID from source
  applicationMethod: {
    type: String,
    enum: ['internal', 'external_redirect'],
    default: 'internal'
  },
  
  // Skills required for matching
  requiredSkills: [{ type: String }],
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Analytics
  viewCount: { type: Number, default: 0 },
  applicationCount: { type: Number, default: 0 },
  externalClickCount: { type: Number, default: 0 } // For tracking external redirects
  
}, { timestamps: true });

// Indexes for better performance
jobSchema.index({ jobSource: 1, status: 1 });
jobSchema.index({ requiredSkills: 1 });
jobSchema.index({ category: 1, status: 1 });
jobSchema.index({ externalId: 1, jobSource: 1 }, { unique: true, sparse: true });

jobSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Job', jobSchema);




// const mongoose = require('mongoose');
// const mongoosePaginate = require('mongoose-paginate-v2');

// const jobSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   companyName: String,
//   companyLogoUrl: String,
//   description: String,
//   requirements: mongoose.Schema.Types.Mixed,
//   category: { type: mongoose.Schema.Types.ObjectId, ref: 'JobCategory' },
//   location: String,
//   jobType: { type: String, enum: ['full-time','part-time','contract','remote'], default: 'full-time' },
//   salaryMin: Number,
//   salaryMax: Number,
//   experienceLevel: { type: String, enum: ['entry','mid','senior'] },
//   status: { type: String, enum: ['active','closed','draft'], default: 'active' },
//   postedDate: { type: Date, default: Date.now },
//   deadline: Date,
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// }, { timestamps: true });

// jobSchema.plugin(mongoosePaginate);
// module.exports = mongoose.model('Job', jobSchema);
