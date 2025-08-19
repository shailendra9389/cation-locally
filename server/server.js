import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import { testConnection } from './db.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    res.json({ 
      status: 'OK', 
      message: 'Server is running',
      database: dbConnected ? 'Connected' : 'Disconnected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR',
      message: 'Server health check failed',
      error: error.message
    });
  }
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Cation API is running',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      users: {
        getAll: 'GET /api/users',
        getById: 'GET /api/users/:id',
        create: 'POST /api/users',
        update: 'PUT /api/users/:id',
        delete: 'DELETE /api/users/:id',
        login: 'POST /api/users/login'
      }
    }
  });
});

// Routes
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Database connection retry mechanism
const MAX_DB_CONNECT_RETRIES = 5;
const DB_CONNECT_RETRY_DELAY = 5000; // 5 seconds

const connectToDatabase = async (retryCount = 0) => {
  try {
    console.log(`🔍 Testing database connection (attempt ${retryCount + 1}/${MAX_DB_CONNECT_RETRIES})...`);
    const dbConnected = await testConnection();
    
    if (dbConnected) {
      console.log('✅ Successfully connected to database');
      return true;
    } else {
      throw new Error('Database connection test returned false');
    }
  } catch (error) {
    console.error(`❌ Database connection attempt ${retryCount + 1} failed:`, error.message);
    
    if (retryCount < MAX_DB_CONNECT_RETRIES - 1) {
      console.log(`⏱️ Retrying in ${DB_CONNECT_RETRY_DELAY / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, DB_CONNECT_RETRY_DELAY));
      return connectToDatabase(retryCount + 1);
    } else {
      console.error('❌ Maximum database connection retry attempts reached');
      return false;
    }
  }
};

// Start server
const startServer = async () => {
  try {
    // Test database connection before starting server with retry mechanism
    const dbConnected = await connectToDatabase();
    
    if (!dbConnected) {
      console.error('❌ Failed to connect to database after multiple attempts. Starting server anyway, but some features may not work.');
      // Instead of exiting, we'll start the server but log a warning
      // This allows the server to start and potentially connect to the database later
    }

    const server = app.listen(PORT, () => {
      console.log('🚀 Server is running on port', PORT);
      console.log('📊 Health check: http://localhost:' + PORT + '/health');
      console.log('🔗 API base URL: http://localhost:' + PORT + '/api');
      console.log('🌐 Frontend URL: ' + (process.env.CORS_ORIGIN || 'http://localhost:5173'));
    });
    
    // Handle server errors
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });
    
    process.on('SIGINT', () => {
      console.log('🛑 SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;