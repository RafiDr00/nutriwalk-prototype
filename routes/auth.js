/**
 * Authentication Routes
 * Handles user registration, login, and logout
 */

import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { createSession, deleteSession, authenticate } from '../middleware/authMiddleware.js';
import { validateRegistration, validateLogin } from '../middleware/validation.js';
import { BadRequestError, UnauthorizedError, ConflictError } from '../utils/errors.js';
import logger from '../utils/logger.js';

const router = express.Router();

// In-memory user storage (Map for O(1) lookup)
const users = new Map();

/**
 * POST /auth/register
 * Register a new user with username and password
 */
router.post('/register', validateRegistration, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    if (users.has(username.toLowerCase())) {
      throw new ConflictError('Username already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Store user
    users.set(username.toLowerCase(), {
      username,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    logger.success(`✅ New user registered: ${username}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        username
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /auth/login
 * Authenticate user and return session token
 */
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = users.get(username.toLowerCase());

    if (!user) {
      throw new UnauthorizedError('Invalid username or password');
    }

    // Validate password
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid username or password');
    }

    // Generate session token
    const token = uuidv4();

    // Create session
    createSession(token, user.username);

    logger.success(`✅ User logged in: ${username}`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        username: user.username
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /auth/logout
 * Logout user and invalidate session token
 * Protected route - requires authentication
 */
router.post('/logout', authenticate, (req, res, next) => {
  try {
    const { token, username } = req.user;

    // Delete session
    const deleted = deleteSession(token);

    if (!deleted) {
      throw new BadRequestError('Session not found');
    }

    logger.info(`👋 User logged out: ${username}`);

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
