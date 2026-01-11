// const mongoose = require('mongoose');

// const savedSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
//   savedAt: { type: Date, default: Date.now }
// });

// savedSchema.index({ user: 1, job: 1 }, { unique: true });
// module.exports = mongoose.model('SavedJob', savedSchema);


const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const savedSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  job: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  },
  savedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate saves
savedSchema.index({ user: 1, job: 1 }, { unique: true });

// Index for faster queries
savedSchema.index({ user: 1, savedAt: -1 });

// Add pagination plugin
savedSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('SavedJob', savedSchema);