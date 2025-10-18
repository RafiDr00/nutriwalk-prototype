/**
 * NutriWalk Backend Server
 * A clean, optimized, and hackathon-ready Node.js backend
 * 
 * Features:
 * - Token-based authentication with bcrypt password hashing
 * - O(1) food lookups for optimal performance
 * - In-memory storage for rapid prototyping
 * - Modular architecture for easy expansion
 * - CORS enabled for frontend integration
 * - Comprehensive error handling
 */

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import foodsRoutes from './routes/foods.js';
import mealsRoutes from './routes/meals.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ===========================
// Middleware Configuration
// ===========================

// CORS - Enable cross-origin requests from frontend
app.use(cors({
  origin: '*', // Allow all origins for hackathon (customize for production)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// JSON body parser
app.use(express.json());

// Request logging middleware (for debugging)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ===========================
// Routes
// ===========================

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'NutriWalk Backend API is running! 🚀',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login'
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
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ===========================
// Server Start
// ===========================

app.listen(PORT, () => {
  console.log('\n🚀 NutriWalk Backend Server Started!');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`📚 Documentation: http://localhost:${PORT}/`);
  console.log('\n✅ Ready for requests!\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});

export default app;
