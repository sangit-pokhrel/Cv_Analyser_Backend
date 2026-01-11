const Queue = require("bull");

const ticketQueue = new Queue("ticket-emails", {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    tls: {},

    // 🔴 REQUIRED FOR UPSTASH
    maxRetriesPerRequest: null,
    enableReadyCheck: false
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

module.exports = ticketQueue;
