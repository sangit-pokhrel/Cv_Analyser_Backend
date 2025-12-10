// server.cjs

const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
// Changed the variable name to 'app' for clarity
const app = require("./src/app.js"); 
const {connectDB, disconnectDB} = require("./src/config/db.js")


const PORT = parseInt(process.env.PORT, 10) || 3000;
const MONGO_URI = process.env.MONGO_URI;

function assertEnv() {
  const required = ["MONGO_URI", "JWT_ACCESS_SECRET"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length)
    throw new Error(`Missing env vars: ${missing.join(", ")}`);
}

async function start() {
  try {
    assertEnv();

    // 1. Database Connection Logic (Handled here)
    await connectDB(MONGO_URI);

    // 2. The Express app object is imported directly. 
    //    NO FUNCTION CALL IS MADE: const app = createApp(); is removed
    //    The imported 'app' is used directly below.
    
    const server = http.createServer(app); // Uses the imported 'app' object

    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} (pid ${process.pid})`);
    });

    // ... (Your original graceful shutdown logic remains the same below)
    
    const shutdown = (signal, err) => {
      console.log(`\nReceived ${signal}. Closing server...`);
      if (err) console.error("Signal error:", err);

      server.close(async (closeErr) => {
        if (closeErr) {
          console.error("Error closing server:", closeErr);
          process.exit(1);
        }
        try {
          await disconnectDB();
          console.log("Shutdown complete.");
          process.exit(0);
        } catch (e) {
          console.error("Error during DB disconnect:", e);
          process.exit(1);
        }
      });

      setTimeout(() => {
        console.warn("Forcing shutdown after timeout.");
        process.exit(1);
      }, 30_000).unref();
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGUSR2", () => {
      shutdown("SIGUSR2");
    });
    process.on("uncaughtException", (err) => {
      console.error("Uncaught exception:", err);
      shutdown("uncaughtException", err);
    });
    process.on("unhandledRejection", (reason) => {
      console.error("Unhandled Rejection:", reason);
      shutdown(
        "unhandledRejection",
        reason instanceof Error ? reason : undefined
      );
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();

module.exports = start;