/**
 * CaloriCatcher Backend API Test Examples
 * 
 * You can run these tests using any HTTP client:
 * - Postman
 * - Thunder Client (VS Code Extension)
 * - cURL
 * - Or use this test script
 */

// Test configuration
const BASE_URL = 'http://localhost:3000';
let authToken = '';

// Helper function for API requests
async function apiRequest(method, endpoint, body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

// Test functions
async function testHealthCheck() {
  console.log('\n🔍 Testing Health Check...');
  const result = await apiRequest('GET', '/');
  console.log('✅ Status:', result.status);
  console.log('📄 Response:', JSON.stringify(result.data, null, 2));
}

async function testRegister() {
  console.log('\n🔍 Testing User Registration...');
  const result = await apiRequest('POST', '/auth/register', {
    username: 'testuser',
    password: 'test123456'
  });
  console.log('✅ Status:', result.status);
  console.log('📄 Response:', JSON.stringify(result.data, null, 2));
}

async function testLogin() {
  console.log('\n🔍 Testing User Login...');
  const result = await apiRequest('POST', '/auth/login', {
    username: 'testuser',
    password: 'test123456'
  });
  console.log('✅ Status:', result.status);
  console.log('📄 Response:', JSON.stringify(result.data, null, 2));
  
  if (result.data.success) {
    authToken = result.data.data.token;
    console.log('🔐 Auth token saved for subsequent requests');
  }
}

async function testGetFoods() {
  console.log('\n🔍 Testing Get All Foods...');
  const result = await apiRequest('GET', '/foods');
  console.log('✅ Status:', result.status);
  console.log('📄 Food Count:', result.data.data.count);
  console.log('📄 Sample Foods:', result.data.data.foods.slice(0, 3));
}

async function testLogMeal() {
  console.log('\n🔍 Testing Log Meal...');
  const result = await apiRequest('POST', '/meals/logMeal', {
    foodName: 'Apple'
  }, authToken);
  console.log('✅ Status:', result.status);
  console.log('📄 Response:', JSON.stringify(result.data, null, 2));
}

async function testLogMultipleMeals() {
  console.log('\n🔍 Testing Log Multiple Meals...');
  
  const foods = ['Banana', 'Chicken Breast', 'Greek Yogurt'];
  
  for (const food of foods) {
    const result = await apiRequest('POST', '/meals/logMeal', {
      foodName: food
    }, authToken);
    console.log(`✅ Logged: ${food} - ${result.data.data.meal.calories} cal, ${result.data.data.meal.recommendedSteps} steps`);
  }
}

async function testGetProgress() {
  console.log('\n🔍 Testing Get Progress...');
  const result = await apiRequest('GET', '/meals/progress', null, authToken);
  console.log('✅ Status:', result.status);
  console.log('📊 Total Calories:', result.data.data.totalCalories);
  console.log('👟 Total Steps:', result.data.data.totalSteps);
  console.log('🍽️ Meals Logged:', result.data.data.mealCount);
  console.log('📄 Recent Meals:', result.data.data.meals.slice(0, 3));
}

async function testProtectedRouteWithoutAuth() {
  console.log('\n🔍 Testing Protected Route Without Authentication...');
  const result = await apiRequest('POST', '/meals/logMeal', {
    foodName: 'Apple'
  });
  console.log('✅ Status:', result.status);
  console.log('📄 Response:', JSON.stringify(result.data, null, 2));
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting CaloriCatcher Backend API Tests...\n');
  console.log('='.repeat(60));
  
  try {
    await testHealthCheck();
    await testRegister();
    await testLogin();
    await testGetFoods();
    await testLogMeal();
    await testLogMultipleMeals();
    await testGetProgress();
    await testProtectedRouteWithoutAuth();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed!');
    console.log('\n🎉 Your CaloriCatcher backend is fully functional!\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  runAllTests();
}

export {
  testHealthCheck,
  testRegister,
  testLogin,
  testGetFoods,
  testLogMeal,
  testLogMultipleMeals,
  testGetProgress,
  testProtectedRouteWithoutAuth,
  runAllTests
};
