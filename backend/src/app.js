// // src/app.js
// import express from "express";
// import cookieParser from "cookie-parser";
// import helmet from "helmet";
// import cors from "cors";
// import hpp from "hpp";
// import compression from "compression";
// import morgan from "morgan";
// import authRoutes from "./routes/auth.js";

// const createApp = () => {
//   const app = express();

//   // Basic security + utility middleware
//   app.use(helmet());
//   app.use(cors({
//     origin: process.env.CORS_ORIGIN || true,
//     credentials: true
//   }));
//   app.use(hpp());
//   app.use(compression());

//   // Logging (skip in test env)
//   if (process.env.NODE_ENV !== "test") {
//     app.use(morgan("combined"));
//   }

//   // Limit incoming JSON (prevent large payload DoS)
//   app.use(express.json({ limit: "10kb" }));
//   app.use(cookieParser());

//   // Health & readiness endpoints (useful for k8s / load balancers)
//   app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
//   app.get("/ready", (req, res) => res.status(200).json({ ready: true }));

//   // API routes
//   app.use("/api/v1/auth", authRoutes);

//   // 404 handler for unknown routes
//   app.use((req, res, next) => {
//     res.status(404).json({ success: false, message: "Not Found" });
//   });

//   // Global error handler (single place)
//   app.use((err, req, res, next) => {
//     console.error(err);
//     const status = err.status || 500;
//     const payload = {
//       success: false,
//       message: err.message || "Server error"
//     };
//     if (process.env.NODE_ENV === "development") payload.stack = err.stack;
//     res.status(status).json(payload);
//   });

//   return app;
// };

// export default createApp;

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.APP_URL || 'http://localhost:3000', 
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Mongo connected'))
  .catch(err => console.error('Mongo err', err));

app.use('/auth', authRoutes);


const { requireAuth } = require('./middleware/authMiddleware');
app.get('/protected', requireAuth, (req, res) => {
  return res.json({ message: 'You are authenticated', user: req.user.toJSON() });
});

  // 404 handler for unknown routes
  app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Not Found" });
  });

  app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
  app.get("/ready", (req, res) => res.status(200).json({ ready: true }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
