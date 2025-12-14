
// const dotenv = require("dotenv");
// dotenv.config();

// const http = require("http");
// const app = require("./src/app.js"); 
// const { connectDB, disconnectDB } = require("./src/config/db.js");

// const PORT = parseInt(process.env.PORT, 10) || 5000;
// const MONGO_URI = process.env.MONGO_URI;

// function assertEnv() {
//   const required = ["MONGO_URI", "JWT_ACCESS_SECRET", "GEMINI_API_KEY", "CLOUDINARY_CLOUD_NAME"];
//   const missing = required.filter((k) => !process.env[k]);
//   if (missing.length) {
//     throw new Error(`Missing env vars: ${missing.join(", ")}`);
//   }
// }

// async function start() {
//   try {
//     assertEnv();

//     // 1. Database Connection
//     console.log("📦 Connecting to MongoDB...");
//     await connectDB(MONGO_URI);
//     console.log("✅ MongoDB connected");

//     // 2. Setup Bull Queue Worker for CV Analysis
//     console.log("🔧 Setting up CV Analysis Queue...");
//     let cvQueue;
//     try {
//       cvQueue = require("./src/queues/cvQueus");
//       const processCVAnalysis = require("./src/workers/cvWorkers");
      
//       // Start processing CV analysis jobs (1 job at a time)
//       cvQueue.process("analyze-cv", 1, processCVAnalysis);
//       console.log("✅ CV Analysis Worker started (processing 1 job at a time)");
//     } catch (queueError) {
//       console.warn("⚠️  CV Analysis Queue could not start:", queueError.message);
//       console.warn("⚠️  CV analysis feature will be disabled");
//       cvQueue = null;
//     }

//     // 3. Create HTTP Server
//     const server = http.createServer(app);

//     server.listen(PORT, () => {
//       console.log(`✅ Server listening on port ${PORT} (pid ${process.pid})`);
//       console.log(`\n🚀 API Ready at: http://localhost:${PORT}/api/v1`);
//       console.log(`📊 Health Check: http://localhost:${PORT}/health\n`);
//     });

//     // 4. Graceful Shutdown Handler
//     const shutdown = async (signal, err) => {
//       console.log(`\n${signal} received. Closing server gracefully...`);
//       if (err) console.error("Signal error:", err);

//       server.close(async (closeErr) => {
//         if (closeErr) {
//           console.error("❌ Error closing server:", closeErr);
//           process.exit(1);
//         }

//         try {
//           // Close Bull Queue
//           if (cvQueue) {
//             console.log("🔄 Closing CV Analysis Queue...");
//             await cvQueue.close();
//             console.log("✅ Queue closed");
//           }

//           // Disconnect from MongoDB
//           console.log("🔄 Disconnecting from MongoDB...");
//           await disconnectDB();
//           console.log("✅ MongoDB disconnected");

//           console.log("✅ Shutdown complete");
//           process.exit(0);
//         } catch (e) {
//           console.error("❌ Error during shutdown:", e);
//           process.exit(1);
//         }
//       });

//       // Force shutdown after 30 seconds
//       setTimeout(() => {
//         console.warn("⚠️  Forcing shutdown after timeout");
//         process.exit(1);
//       }, 30_000).unref();
//     };

//     // 5. Process Signal Handlers
//     process.on("SIGINT", () => shutdown("SIGINT"));
//     process.on("SIGTERM", () => shutdown("SIGTERM"));
//     process.on("SIGUSR2", () => shutdown("SIGUSR2"));
    
//     process.on("uncaughtException", (err) => {
//       console.error("❌ Uncaught exception:", err);
//       shutdown("uncaughtException", err);
//     });
    
//     process.on("unhandledRejection", (reason) => {
//       console.error("❌ Unhandled Rejection:", reason);
//       shutdown(
//         "unhandledRejection",
//         reason instanceof Error ? reason : undefined
//       );
//     });

//   } catch (err) {
//     console.error("❌ Failed to start server:", err);
//     process.exit(1);
//   }
// }

// start();

// module.exports = start;



// server.cjs

const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const socketIo = require("socket.io");
const app = require("./src/app.js"); 
const { connectDB, disconnectDB } = require("./src/config/db.js");

const PORT = parseInt(process.env.PORT, 10) || 5000;
const MONGO_URI = process.env.MONGO_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

function assertEnv() {
  const required = ["MONGO_URI", "JWT_ACCESS_SECRET", "GEMINI_API_KEY", "CLOUDINARY_CLOUD_NAME"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing env vars: ${missing.join(", ")}`);
  }
}

async function start() {
  try {
    assertEnv();

    // 1. Database Connection
    console.log("📦 Connecting to MongoDB...");
    await connectDB(MONGO_URI);
    console.log("✅ MongoDB connected");

    // 2. Create HTTP Server
    const server = http.createServer(app);

    // 3. Setup Socket.IO
    console.log("🔌 Setting up Socket.IO...");
    const io = socketIo(server, {
      cors: {
        origin: FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    // Socket.IO connection handling
    io.on('connection', (socket) => {
      console.log(`✅ Client connected: ${socket.id}`);

      // Listen for analysis subscription
      socket.on('subscribe-analysis', (analysisId) => {
        socket.join(`analysis-${analysisId}`);
        console.log(`📡 Client ${socket.id} subscribed to analysis: ${analysisId}`);
        
        // Send initial acknowledgment
        socket.emit('subscribed', { analysisId, message: 'Subscribed to analysis updates' });
      });

      // Listen for unsubscribe
      socket.on('unsubscribe-analysis', (analysisId) => {
        socket.leave(`analysis-${analysisId}`);
        console.log(`📴 Client ${socket.id} unsubscribed from analysis: ${analysisId}`);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
      });
    });

    // Make io globally available
    global.io = io;
    console.log("✅ Socket.IO ready");

    // 4. Setup Bull Queue Worker
    console.log("🔧 Setting up CV Analysis Queue...");
    let cvQueue;
    try {
      cvQueue = require("./src/queues/cvQueus");
      const processCVAnalysis = require("./src/workers/cvWorkers");
      
      cvQueue.process("analyze-cv", 1, processCVAnalysis);
      console.log("✅ CV Analysis Worker started (processing 1 job at a time)");
    } catch (queueError) {
      console.warn("⚠️  CV Analysis Queue could not start:", queueError.message);
      console.warn("⚠️  CV analysis feature will be disabled");
      cvQueue = null;
    }

    // 5. Start Server
    server.listen(PORT, () => {
      console.log(`✅ Server listening on port ${PORT} (pid ${process.pid})`);
      console.log(`\n🚀 API Ready at: http://localhost:${PORT}/api/v1`);
      console.log(`📊 Health Check: http://localhost:${PORT}/health`);
      console.log(`🔌 WebSocket: ws://localhost:${PORT}\n`);
    });

    // 6. Graceful Shutdown
    const shutdown = async (signal, err) => {
      console.log(`\n${signal} received. Closing server gracefully...`);
      if (err) console.error("Signal error:", err);

      server.close(async (closeErr) => {
        if (closeErr) {
          console.error("❌ Error closing server:", closeErr);
          process.exit(1);
        }

        try {
          // Close Socket.IO
          if (io) {
            console.log("🔄 Closing Socket.IO...");
            io.close();
            console.log("✅ Socket.IO closed");
          }

          // Close Bull Queue
          if (cvQueue) {
            console.log("🔄 Closing CV Analysis Queue...");
            await cvQueue.close();
            console.log("✅ Queue closed");
          }

          // Disconnect from MongoDB
          console.log("🔄 Disconnecting from MongoDB...");
          await disconnectDB();
          console.log("✅ MongoDB disconnected");

          console.log("✅ Shutdown complete");
          process.exit(0);
        } catch (e) {
          console.error("❌ Error during shutdown:", e);
          process.exit(1);
        }
      });

      setTimeout(() => {
        console.warn("⚠️  Forcing shutdown after timeout");
        process.exit(1);
      }, 30_000).unref();
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGUSR2", () => shutdown("SIGUSR2"));
    
    process.on("uncaughtException", (err) => {
      console.error("❌ Uncaught exception:", err);
      shutdown("uncaughtException", err);
    });
    
    process.on("unhandledRejection", (reason) => {
      console.error("❌ Unhandled Rejection:", reason);
      shutdown(
        "unhandledRejection",
        reason instanceof Error ? reason : undefined
      );
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();

module.exports = start;