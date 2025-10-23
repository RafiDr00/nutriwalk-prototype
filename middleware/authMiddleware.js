/**
 * Authentication Middleware
 * Validates user tokens for protected routes with session expiration
 */

import config from '../config/config.js';
import { UnauthorizedError } from '../utils/errors.js';

// In-memory session storage (Map for O(1) lookup)
export const sessions = new Map();

/**
 * Check if session is expired
 * @param {Date} createdAt - Session creation time
 * @returns {boolean} True if expired
 */
function isSessionExpired(createdAt) {
  const expiryMs = config.sessionExpiryHours * 60 * 60 * 1000;
  const now = new Date().getTime();
  const sessionTime = new Date(createdAt).getTime();
  return (now - sessionTime) > expiryMs;
}

/**
 * Clean up expired sessions (run periodically)
 */
export function cleanupExpiredSessions() {
  let cleanedCount = 0;
  
  for (const [token, session] of sessions.entries()) {
    if (isSessionExpired(session.createdAt)) {
      sessions.delete(token);
      cleanedCount++;
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned up ${cleanedCount} expired session(s)`);
  }
}

// Run cleanup every hour
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);

/**
 * Authentication middleware to protect routes
 * Validates token from Authorization header
 */
export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('Authorization header missing');
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    const session = sessions.get(token);

    if (!session) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    // Check if session is expired
    if (isSessionExpired(session.createdAt)) {
      sessions.delete(token);
      throw new UnauthorizedError('Session expired. Please login again.');
    }

    // Attach user info to request
    req.user = {
      username: session.username,
      token: token
    };

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new session
 * @param {string} token - Session token
 * @param {string} username - Username
 */
export function createSession(token, username) {
  sessions.set(token, {
    username,
    createdAt: new Date(),
    lastActivity: new Date()
  });
}

/**
 * Delete a session (logout)
 * @param {string} token - Session token
 */
export function deleteSession(token) {
  return sessions.delete(token);
}

/**
 * Get active sessions count
 * @returns {number} Number of active sessions
 */
export function getActiveSessionsCount() {
  return sessions.size;
}

export default {
  authenticate,
  createSession,
  deleteSession,
  cleanupExpiredSessions,
  getActiveSessionsCount,
  sessions
};
