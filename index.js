/**
 * CaloriCatcher Backend Server
 * A production-ready, secure, and optimized Node.js backend
 * 
 * Features:
 * - Token-based authentication with bcrypt password hashing and session expiration
 * - O(1) food lookups for optimal performance
 * - In-memory storage for rapid prototyping
 * - Modular architecture for easy expansion
 * - CORS enabled for frontend integration
 * - Comprehensive error handling with custom error classes
 * - Input validation and sanitization
 * - Rate limiting for security
 * - Security headers with Helmet
 * - Structured logging
 * - Environment configuration
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config/config.js';
import logger from './utils/logger.js';
import { ApiError } from './utils/errors.js';
import authRoutes from './routes/auth.js';
import foodsRoutes from './routes/foods.js';
import mealsRoutes from './routes/meals.js';

// Initialize Express app
const app = express();
const PORT = config.port;

// ===========================
// Security Middleware
// ===========================

// Helmet - Security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));

// Rate limiting - Prevent abuse
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/auth/', limiter); // Apply to auth routes
app.use('/meals/', limiter); // Apply to meal routes

// ===========================
// General Middleware
// ===========================

// CORS - Enable cross-origin requests from frontend
app.use(cors({
  origin: config.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON body parser with size limit
app.use(express.json({ limit: '10mb' }));

// URL-encoded parser
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.request(req);
  next();
});

// ===========================
// Routes
// ===========================

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: `${config.appName} is running! 🚀`,
    version: config.appVersion,
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login',
        logout: 'POST /auth/logout [Protected]'
      },
      foods: {
        list: 'GET /foods'
      },
      meals: {
        log: 'POST /meals/logMeal [Protected]',
        progress: 'GET /meals/progress [Protected]'
      }
    }
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/foods', foodsRoutes);
app.use('/meals', mealsRoutes);

// ===========================
// Error Handling
// ===========================

// 404 handler - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  // Log error
  if (err.isOperational) {
    logger.warn(`Operational error: ${err.message}`);
  } else {
    logger.error('Unhandled error:', err);
  }
  
  // Handle ApiError instances
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || undefined,
      ...(config.isDevelopment && { stack: err.stack })
    });
  }
  
  // Handle other errors
  res.status(500).json({
    success: false,
    message: config.isDevelopment ? err.message : 'Internal server error',
    ...(config.isDevelopment && { stack: err.stack })
  });
});

// ===========================
// Server Start
// ===========================

const server = app.listen(PORT, () => {
  logger.success('\n🚀 CaloriCatcher Backend Server Started!');
  logger.info(`📡 Server running on port ${PORT}`);
  logger.info(`🌐 API URL: http://localhost:${PORT}`);
  logger.info(`📚 Documentation: http://localhost:${PORT}/`);
  logger.info(`🔒 Environment: ${config.nodeEnv}`);
  logger.info(`⏱️  Session expiry: ${config.sessionExpiryHours} hours`);
  logger.success('\n✅ Ready for requests!\n');
});

// Graceful shutdown handler
function gracefulShutdown(signal) {
  logger.info(`\n👋 ${signal} received. Shutting down gracefully...`);
  
  server.close(() => {
    logger.success('✅ Server closed successfully');
    process.exit(0);
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('❌ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

export default app;
