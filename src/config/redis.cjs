const IORedis = require("ioredis");

let redis;

if (!redis) {
  redis = new IORedis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    tls: {},

    // 🔴 REQUIRED for Upstash
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    keepAlive: 30000,

    retryStrategy(times) {
      return Math.min(times * 100, 2000);
    }
  });

  redis.on("connect", () => {
    console.log("✅ Redis connected");
  });

  redis.on("error", (err) => {
    console.error("❌ Redis error:", err.message);
  });
}

module.exports = redis;
