/**
 * Logging Utility
 * Structured logging with different levels
 */

import config from '../config/config.js';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

/**
 * Format timestamp
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Log levels
 */
const LogLevel = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
  SUCCESS: 'SUCCESS'
};

/**
 * Log message with level and color
 */
function log(level, message, data = null) {
  const timestamp = getTimestamp();
  let color = colors.reset;
  
  switch (level) {
    case LogLevel.ERROR:
      color = colors.red;
      break;
    case LogLevel.WARN:
      color = colors.yellow;
      break;
    case LogLevel.INFO:
      color = colors.blue;
      break;
    case LogLevel.DEBUG:
      color = colors.gray;
      break;
    case LogLevel.SUCCESS:
      color = colors.green;
      break;
  }
  
  const logMessage = `${color}[${timestamp}] [${level}]${colors.reset} ${message}`;
  
  console.log(logMessage);
  
  if (data && config.isDevelopment) {
    console.log(data);
  }
}

export const logger = {
  error: (message, data) => log(LogLevel.ERROR, message, data),
  warn: (message, data) => log(LogLevel.WARN, message, data),
  info: (message, data) => log(LogLevel.INFO, message, data),
  debug: (message, data) => log(LogLevel.DEBUG, message, data),
  success: (message, data) => log(LogLevel.SUCCESS, message, data),
  
  // Request logging
  request: (req) => {
    const method = req.method;
    const path = req.path;
    const ip = req.ip || req.connection.remoteAddress;
    log(LogLevel.INFO, `${method} ${path}`, config.isDevelopment ? { ip, headers: req.headers } : null);
  }
};

export default logger;
