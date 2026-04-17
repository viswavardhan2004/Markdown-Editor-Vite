const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const blogRoutes = require('./routes/blogs');

const app = express();

// Database connection optimized for serverless
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false, // Disable buffering to catch connection issues immediately
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Advanced CORS configuration for Vercel/Production
app.use(cors({
  origin: function (origin, callback) {
    // Allow local development and Vercel subdomains
    if (!origin || 
        origin.includes('localhost') || 
        origin.includes('127.0.0.1') || 
        origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Explicitly handle pre-flight requests
app.options('*', cors());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} | ${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms`);
  });
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/blogs', blogRoutes);

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Handle local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// CRITICAL for Vercel deployment: Export the app instance
module.exports = app;