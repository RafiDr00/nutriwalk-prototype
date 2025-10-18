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
router.get('/', (req, res) => {
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
    console.error('Error fetching foods:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching foods'
    });
  }
});

export default router;
