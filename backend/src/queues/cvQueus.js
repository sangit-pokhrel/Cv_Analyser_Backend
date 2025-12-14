// const Queue = require('bull');
// const cvQueue = new Queue('cv-analysis', {
//   redis: { host: process.env.REDIS_HOST || '127.0.0.1', port: process.env.REDIS_PORT || 6379 }
// });

// module.exports = cvQueue;
const Queue = require('bull');
const processCVAnalysis = require('../workers/cvWorkers');

// Create queue
const cvQueue = new Queue('cv-analysis', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined
  }
});

// Process jobs
cvQueue.process(async (job) => {
  return await processCVAnalysis(job);
});

// Event listeners
cvQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed successfully`);
});

cvQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

cvQueue.on('stalled', (job) => {
  console.warn(`Job ${job.id} stalled`);
});

module.exports = cvQueue;