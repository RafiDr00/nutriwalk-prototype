/**
 * Authentication Middleware
 * Validates user tokens for protected routes
 */

// In-memory session storage (Map for O(1) lookup)
export const sessions = new Map();

/**
 * Authentication middleware to protect routes
 * Validates token from Authorization header
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header missing'
    });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  const session = sessions.get(token);

  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }

  // Attach user info to request
  req.user = {
    username: session.username,
    token: token
  };

  next();
}

/**
 * Create a new session
 * @param {string} token - Session token
 * @param {string} username - Username
 */
export function createSession(token, username) {
  sessions.set(token, {
    username,
    createdAt: new Date()
  });
}

/**
 * Delete a session
 * @param {string} token - Session token
 */
export function deleteSession(token) {
  sessions.delete(token);
}

export default {
  authenticate,
  createSession,
  deleteSession,
  sessions
};
