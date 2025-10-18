/**
 * Authentication Routes
 * Handles user registration and login
 */

import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { createSession } from '../middleware/authMiddleware.js';

const router = express.Router();

// In-memory user storage (Map for O(1) lookup)
const users = new Map();

/**
 * POST /auth/register
 * Register a new user with username and password
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters long'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    if (users.has(username.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Store user
    users.set(username.toLowerCase(), {
      username,
      password: hashedPassword,
      createdAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'User registered successfully',
      data: {
        username
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

/**
 * POST /auth/login
 * Authenticate user and return session token
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find user
    const user = users.get(username.toLowerCase());

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Validate password
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Generate session token
    const token = uuidv4();

    // Create session
    createSession(token, user.username);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

export default router;
