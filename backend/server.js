// src/server.js
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import createApp from "./src/app.js";
import { connectDB, disconnectDB } from "./src/config/db.js";

const PORT = parseInt(process.env.PORT, 10) || 3000;
const MONGO_URI = process.env.MONGO_URI;

function assertEnv() {
  const required = ["MONGO_URI", "JWT_ACCESS_SECRET"]; // add more as needed
  const missing = required.filter(k => !process.env[k]);
  if (missing.length) throw new Error(`Missing env vars: ${missing.join(", ")}`);
}

async function start() {
  try {
    assertEnv();

    // Connect to DB (returns connection or throws)
    await connectDB(MONGO_URI);

    // Create the express app
    const app = createApp();

    // Create server (allows socket.io integration later)
    const server = http.createServer(app);

    // Start listening
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} (pid ${process.pid})`);
    });

    // Graceful shutdown helper
    const shutdown = (signal, err) => {
      console.log(`\nReceived ${signal}. Closing server...`);
      if (err) console.error("Signal error:", err);

      // stop accepting new connections
      server.close(async (closeErr) => {
        if (closeErr) {
          console.error("Error closing server:", closeErr);
          process.exit(1);
        }
        try {
          // close DB connection
          await disconnectDB();
          console.log("Shutdown complete.");
          process.exit(0);
        } catch (e) {
          console.error("Error during DB disconnect:", e);
          process.exit(1);
        }
      });

      // Force exit if not closed within X ms
      setTimeout(() => {
        console.warn("Forcing shutdown after timeout.");
        process.exit(1);
      }, 30_000).unref();
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGUSR2", () => {
      // for some process managers (nodemon) — re-raise to allow restarts
      shutdown("SIGUSR2");
    });
    process.on("uncaughtException", (err) => {
      console.error("Uncaught exception:", err);
      shutdown("uncaughtException", err);
    });
    process.on("unhandledRejection", (reason) => {
      console.error("Unhandled Rejection:", reason);
      shutdown("unhandledRejection", reason instanceof Error ? reason : undefined);
    });

  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();


export default start;
