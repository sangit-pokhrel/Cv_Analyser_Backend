
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const apiV1 = require('./routes/index.route');


const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration - allows multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://careersync-five.vercel.app',
  'https://cv-analyser-backend-six.vercel.app/',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));




app.use('/api/v1', apiV1);


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