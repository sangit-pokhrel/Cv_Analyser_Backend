const Queue = require('bull');

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false
};

console.log(`🔧 Ticket Queue connecting to Redis: ${redisConfig.host}:${redisConfig.port}`);

// Create ticket email queue
const ticketQueue = new Queue('ticket-emails', {
  redis: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: 50,
    removeOnFail: 50
  }
});

// Test connection
ticketQueue.isReady()
  .then(() => {
    console.log('✅ Ticket Email Queue connected to Redis');
  })
  .catch(err => {
    console.error('❌ Ticket Queue Redis connection failed:', err.message);
  });

// Event listeners
ticketQueue.on('waiting', (jobId) => {
  console.log(`⏳ Email job ${jobId} is waiting`);
});

ticketQueue.on('active', (job) => {
  console.log(`📧 Email job ${job.id} started: ${job.data.type}`);
});

ticketQueue.on('completed', (job, result) => {
  console.log(`✅ Email sent: ${job.data.type} to ${job.data.to}`);
});

ticketQueue.on('failed', (job, err) => {
  console.error(`❌ Email job ${job.id} failed:`, err.message);
});

ticketQueue.on('error', (error) => {
  console.error('❌ Ticket Queue error:', error.message);
});

module.exports = ticketQueue;