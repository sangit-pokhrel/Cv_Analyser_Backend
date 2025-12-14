
// const Queue = require('bull');
// const processCVAnalysis = require('../workers/cvWorkers');

// // Create queue
// const cvQueue = new Queue('cv-analysis', {
//   redis: {
//     host: process.env.REDIS_HOST || 'localhost',
//     port: process.env.REDIS_PORT || 6379,
//     password: process.env.REDIS_PASSWORD || undefined
//   }
// });

// // Process jobs
// cvQueue.process(async (job) => {
//   return await processCVAnalysis(job);
// });

// // Event listeners
// cvQueue.on('completed', (job, result) => {
//   console.log(`Job ${job.id} completed successfully`);
// });

// cvQueue.on('failed', (job, err) => {
//   console.error(`Job ${job.id} failed:`, err.message);
// });

// cvQueue.on('stalled', (job) => {
//   console.warn(`Job ${job.id} stalled`);
// });

// module.exports = cvQueue;


const Queue = require('bull');

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false
};

console.log(`🔧 Connecting to Redis: ${redisConfig.host}:${redisConfig.port}`);

// Create Bull queue
const cvQueue = new Queue('cv-analysis', {
  redis: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    },
    removeOnComplete: 100,
    removeOnFail: 100
  }
});

// Test Redis connection
cvQueue.isReady()
  .then(() => {
    console.log('✅ Bull Queue connected to Redis successfully');
  })
  .catch(err => {
    console.error('❌ Bull Queue Redis connection failed:', err.message);
  });

// Event listeners
cvQueue.on('waiting', (jobId) => {
  console.log(`⏳ Job ${jobId} is waiting`);
});

cvQueue.on('active', (job) => {
  console.log(`🔄 Job ${job.id} started processing`);
});

cvQueue.on('completed', (job, result) => {
  console.log(`✅ Job ${job.id} completed successfully`);
});

cvQueue.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});

cvQueue.on('stalled', (job) => {
  console.warn(`⚠️  Job ${job.id} stalled`);
});

cvQueue.on('error', (error) => {
  console.error('❌ Queue error:', error.message);
});

module.exports = cvQueue;