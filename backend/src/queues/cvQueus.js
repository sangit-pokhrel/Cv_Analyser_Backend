
// const Queue = require("bull");
// const redis = require("../config/redis.cjs");

// // Create CV analysis queue (REUSE Redis)
// const cvQueue = new Queue("cv-analysis", {
//   createClient: () => redis,

//   defaultJobOptions: {
//     attempts: 3,
//     backoff: {
//       type: "exponential",
//       delay: 5000
//     },
//     removeOnComplete: 100,
//     removeOnFail: 100
//   }
// });

// // Event listeners
// cvQueue.on("waiting", (jobId) => {
//   console.log(`⏳ CV job ${jobId} waiting`);
// });

// cvQueue.on("active", (job) => {
//   console.log(`🔄 CV job ${job.id} started`);
// });

// cvQueue.on("completed", (job) => {
//   console.log(`✅ CV job ${job.id} completed`);
// });

// cvQueue.on("failed", (job, err) => {
//   console.error(`❌ CV job ${job?.id} failed:`, err.message);
// });

// cvQueue.on("stalled", (job) => {
//   console.warn(`⚠️ CV job ${job.id} stalled`);
// });

// cvQueue.on("error", (err) => {
//   console.error("❌ CV Queue error:", err.message);
// });

// module.exports = cvQueue;



const Queue = require("bull");

const cvQueue = new Queue("cv-analysis", {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    tls: {},

    maxRetriesPerRequest: null,
    enableReadyCheck: false
  },

  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000
    },
    removeOnComplete: 100,
    removeOnFail: 100
  }
});

module.exports = cvQueue;
