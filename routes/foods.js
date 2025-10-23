/**
 * Foods Routes
 * Handles food catalog endpoints
 */

import express from 'express';
import { getAllFoods } from '../data/foods.js';

const router = express.Router();

/**
 * GET /foods
 * Return all preloaded foods with calories and image URLs
 */
router.get('/', (req, res, next) => {
  try {
    const foods = getAllFoods();

    res.status(200).json({
      success: true,
      message: 'Foods retrieved successfully',
      data: {
        foods,
        count: foods.length
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
