/**
 * Validation Middleware
 * Input validation and sanitization using express-validator
 */

import { body, validationResult } from 'express-validator';
import { ValidationError } from '../utils/errors.js';

/**
 * Handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));
    
    throw new ValidationError('Validation failed', formattedErrors);
  }
  
  next();
};

/**
 * Registration validation rules
 */
export const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .escape(),
  
  body('password')
    .isLength({ min: 6, max: 100 })
    .withMessage('Password must be between 6 and 100 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];

/**
 * Login validation rules
 */
export const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .escape(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

/**
 * Meal logging validation rules
 */
export const validateMealLog = [
  body('foodName')
    .trim()
    .notEmpty()
    .withMessage('Food name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Food name must be between 1 and 100 characters')
    .escape(),
  
  handleValidationErrors
];

export default {
  validateRegistration,
  validateLogin,
  validateMealLog,
  handleValidationErrors
};
