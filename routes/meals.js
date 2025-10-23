/**
 * Meals Routes
 * Handles meal logging and progress tracking
 */

import express from 'express';
import { getFoodByName, foodExists } from '../data/foods.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateMealLog } from '../middleware/validation.js';
import { NotFoundError } from '../utils/errors.js';
import logger from '../utils/logger.js';

const router = express.Router();

// In-memory meal logs storage (Map for O(1) lookup by username)
const mealLogs = new Map();

/**
 * Initialize meal log for a user if not exists
 * @param {string} username - Username
 */
function initializeMealLog(username) {
  if (!mealLogs.has(username)) {
    mealLogs.set(username, {
      totalCalories: 0,
      totalSteps: 0,
      meals: []
    });
  }
}

/**
 * Generate random step recommendation (200-300 steps)
 * @returns {number} Random steps between 200-300
 */
function generateStepRecommendation() {
  return Math.floor(Math.random() * 101) + 200; // 200-300 inclusive
}

/**
 * POST /meals/logMeal
 * Log a user's meal with automatic calorie lookup
 * Protected route - requires authentication
 */
router.post('/logMeal', authenticate, validateMealLog, (req, res, next) => {
  try {
    const { foodName } = req.body;
    const username = req.user.username;

    // Check if food exists
    if (!foodExists(foodName)) {
      throw new NotFoundError(`Food "${foodName}" not found in database`);
    }

    // Get food details (O(1) lookup)
    const food = getFoodByName(foodName);

    // Generate step recommendation
    const recommendedSteps = generateStepRecommendation();

    // Initialize meal log for user if needed
    initializeMealLog(username);

    // Create meal entry
    const mealEntry = {
      id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      foodName: food.name,
      calories: food.calories,
      image: food.image,
      recommendedSteps,
      timestamp: new Date().toISOString()
    };

    // Get user's meal log
    const userLog = mealLogs.get(username);

    // Update totals
    userLog.totalCalories += food.calories;
    userLog.totalSteps += recommendedSteps;
    userLog.meals.push(mealEntry);

    logger.info(`🍽️  Meal logged for ${username}: ${food.name} (${food.calories} cal)`);

    res.status(201).json({
      success: true,
      message: 'Meal logged successfully',
      data: {
        meal: mealEntry,
        summary: {
          totalCalories: userLog.totalCalories,
          totalSteps: userLog.totalSteps,
          mealCount: userLog.meals.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /meals/progress
 * Return total calories, total steps, and meal history
 * Protected route - requires authentication
 */
router.get('/progress', authenticate, (req, res, next) => {
  try {
    const username = req.user.username;

    // Initialize meal log for user if needed
    initializeMealLog(username);

    // Get user's meal log
    const userLog = mealLogs.get(username);

    res.status(200).json({
      success: true,
      message: 'Progress retrieved successfully',
      data: {
        totalCalories: userLog.totalCalories,
        totalSteps: userLog.totalSteps,
        mealCount: userLog.meals.length,
        meals: [...userLog.meals].reverse() // Most recent first (non-mutating)
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
