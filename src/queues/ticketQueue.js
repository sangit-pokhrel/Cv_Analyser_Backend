// const Queue = require("bull");

// const ticketQueue = new Queue("ticket-emails", {
//   redis: {
//     host: process.env.REDIS_HOST,
//     port: Number(process.env.REDIS_PORT),
//     password: process.env.REDIS_PASSWORD,
//     tls: {},

//     // 🔴 REQUIRED FOR UPSTASH
//     maxRetriesPerRequest: null,
//     enableReadyCheck: false
//   },

//   defaultJobOptions: {
//     attempts: 3,
//     backoff: {
//       type: "exponential",
//       delay: 2000
//     },
//     removeOnComplete: 50,
//     removeOnFail: 50
//   }
// });

// module.exports = ticketQueue;



const Queue = require("bull");

let ticketQueue = null;

// Only create queue if Redis is configured
if (process.env.REDIS_DISABLED !== 'true' && process.env.REDIS_HOST && process.env.REDIS_HOST !== 'localhost') {
  try {
    ticketQueue = new Queue("ticket-emails", {
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        tls: process.env.REDIS_HOST.includes('upstash') ? {} : undefined,
        maxRetriesPerRequest: 3, // CRITICAL: Limit retries
        enableReadyCheck: false,
        retryStrategy: (times) => {
          if (times > 3) return null; // Stop retrying
          return Math.min(times * 100, 2000);
        }
      },

      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000
        },
        removeOnComplete: 50,
        removeOnFail: 50
      }
    });

    ticketQueue.on('error', (err) => {
      console.error('❌ Ticket Queue error:', err.message);
    });
  } catch (error) {
    console.warn('⚠️ Ticket Queue initialization failed:', error.message);
    ticketQueue = null;
  }
} else {
  console.log('ℹ️ Ticket Queue disabled - Redis not configured');
}

module.exports = ticketQueue;