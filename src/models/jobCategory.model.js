const mongoose = require('mongoose');

const cat = new mongoose.Schema({
  name: { type: String, required: true },
  iconUrl: String,
  description: String
}, { timestamps: true });

module.exports = mongoose.model('JobCategory', cat);
