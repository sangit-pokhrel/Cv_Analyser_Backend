
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.route');
const apiV1 = require('./routes/index.route');

const adminRoutes = require('./routes/admin.route');


const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.APP_URL || 'http://localhost:3000',
  credentials: true
}));



app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', apiV1);

app.use('/api/v1/admin', adminRoutes);

const { requireAuth } = require('./middlewares/auth.middleware');
app.get('/protected', requireAuth, (req, res) => {
  return res.json({ message: 'You are authenticated', user: req.user.toJSON() });
});

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
app.get("/ready", (req, res) => res.status(200).json({ ready: true }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;