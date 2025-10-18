/**
 * NutriWalk Food Database
 * Preloaded foods with calories and image URLs for O(1) lookup
 */

const foodsArray = [
  {
    name: 'Apple',
    calories: 95,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400'
  },
  {
    name: 'Banana',
    calories: 105,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'
  },
  {
    name: 'Orange',
    calories: 62,
    image: 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400'
  },
  {
    name: 'Chicken Breast',
    calories: 165,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400'
  },
  {
    name: 'Salmon',
    calories: 206,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400'
  },
  {
    name: 'Brown Rice',
    calories: 216,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'
  },
  {
    name: 'Avocado',
    calories: 234,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400'
  },
  {
    name: 'Greek Yogurt',
    calories: 100,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'
  },
  {
    name: 'Almonds',
    calories: 164,
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400'
  },
  {
    name: 'Oatmeal',
    calories: 154,
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400'
  },
  {
    name: 'Broccoli',
    calories: 55,
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400'
  },
  {
    name: 'Sweet Potato',
    calories: 112,
    image: 'https://images.unsplash.com/photo-1557844352-761f2565b576?w=400'
  },
  {
    name: 'Eggs (2)',
    calories: 140,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400'
  },
  {
    name: 'Pasta',
    calories: 220,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400'
  },
  {
    name: 'Pizza Slice',
    calories: 285,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
  }
];

// Create a Map for O(1) lookup by food name (case-insensitive)
const foodsMap = new Map();
foodsArray.forEach(food => {
  foodsMap.set(food.name.toLowerCase(), food);
});

/**
 * Get all foods
 * @returns {Array} Array of all food items
 */
export function getAllFoods() {
  return foodsArray;
}

/**
 * Get food by name (O(1) lookup)
 * @param {string} name - Food name
 * @returns {Object|null} Food object or null if not found
 */
export function getFoodByName(name) {
  return foodsMap.get(name.toLowerCase()) || null;
}

/**
 * Check if food exists
 * @param {string} name - Food name
 * @returns {boolean} True if food exists
 */
export function foodExists(name) {
  return foodsMap.has(name.toLowerCase());
}

export default {
  getAllFoods,
  getFoodByName,
  foodExists
};
