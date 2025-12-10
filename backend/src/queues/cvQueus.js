const Queue = require('bull');
const cvQueue = new Queue('cv-analysis', {
  redis: { host: process.env.REDIS_HOST || '127.0.0.1', port: process.env.REDIS_PORT || 6379 }
});

module.exports = cvQueue;
