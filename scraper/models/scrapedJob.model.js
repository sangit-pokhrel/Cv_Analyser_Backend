// scraper/models/scrapedJob.model.js
const mongoose = require('mongoose');

const scrapedJobSchema = new mongoose.Schema({
  source: { type: String, required: true },
  externalJobId: { type: String, required: true },
  title: String,
  company: String,
  location: String,
  description: String,
  url: String,
  postedText: String,
  raw: mongoose.Schema.Types.Mixed,
  insertedAt: { type: Date, default: Date.now }
}, { timestamps: true });

scrapedJobSchema.index({ source: 1, externalJobId: 1 }, { unique: true });

module.exports = mongoose.model('ScrapedJob', scrapedJobSchema);
