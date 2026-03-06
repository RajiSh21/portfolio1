const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'dev-only-insecure-secret';
  console.warn('JWT_SECRET not set. Using a local development fallback secret.');
}

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/visits', require('./routes/visits'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Connect DB and start server
const PORT = process.env.PORT || 5000;
let memoryMongo;

// Start server immediately; attempt DB connection in background
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const connectDatabase = async () => {
  const connectInMemoryMongo = async () => {
    // Fallback for local development so the project runs without external setup.
    memoryMongo = await MongoMemoryServer.create();
    const memoryUri = memoryMongo.getUri();
    await mongoose.connect(memoryUri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected (in-memory fallback)');
  };

  try {
    if (process.env.MONGO_URI) {
      try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('MongoDB connected (MONGO_URI)');
        return;
      } catch (primaryErr) {
        console.warn('Primary MONGO_URI unreachable, switching to in-memory MongoDB.');
      }
    }

    await connectInMemoryMongo();
  } catch (err) {
    console.error('MongoDB connection error (DB features unavailable):', err.message);
  }
};

const shutdown = async () => {
  try {
    await mongoose.disconnect();
    if (memoryMongo) await memoryMongo.stop();
  } finally {
    process.exit(0);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

connectDatabase();

module.exports = app;
