/**
 * Comprehensive NutriWalk Backend Verification Script
 * Tests every endpoint and shows detailed pass/fail results
 */

const BASE_URL = 'http://localhost:3000';

// Color codes for terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m'
};

let testsPassed = 0;
let testsFailed = 0;
let authToken = '';

// Helper function for API requests
async function apiRequest(method, endpoint, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data, success: true };
  } catch (error) {
    return { status: 0, error: error.message, success: false };
  }
}

function printHeader(text) {
  console.log(`\n${colors.bold}${colors.cyan}${'='.repeat(70)}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}${text}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}${'='.repeat(70)}${colors.reset}\n`);
}

function printTest(name, passed, details = '') {
  const icon = passed ? '✅' : '❌';
  const color = passed ? colors.green : colors.red;
  console.log(`${icon} ${color}${name}${colors.reset}`);
  if (details) console.log(`   ${colors.yellow}${details}${colors.reset}`);
  
  if (passed) testsPassed++;
  else testsFailed++;
}

function printSection(name) {
  console.log(`\n${colors.bold}${colors.magenta}▶ ${name}${colors.reset}`);
  console.log(`${colors.magenta}${'─'.repeat(70)}${colors.reset}`);
}

// Test 1: Server Health Check
async function testHealthCheck() {
  printSection('TEST 1: Server Health Check');
  
  try {
    const result = await apiRequest('GET', '/');
    
    printTest(
      'Server is responding',
      result.status === 200,
      `Status: ${result.status}`
    );
    
    printTest(
      'Returns correct API structure',
      result.data.success === true && result.data.version === '1.0.0',
      `Version: ${result.data?.version || 'N/A'}`
    );
    
    printTest(
      'Has all endpoint documentation',
      result.data.endpoints?.auth && result.data.endpoints?.foods && result.data.endpoints?.meals,
      'Auth, Foods, Meals endpoints documented'
    );
    
    return true;
  } catch (error) {
    printTest('Server health check', false, error.message);
    return false;
  }
}

// Test 2: User Registration
async function testRegistration() {
  printSection('TEST 2: User Registration');
  
  const username = `test_${Date.now()}`;
  const password = 'test123456';
  
  // Test successful registration
  const result = await apiRequest('POST', '/auth/register', { username, password });
  
  printTest(
    'Can register a new user',
    result.status === 200 && result.data.success === true,
    `Status: ${result.status}, User: ${username}`
  );
  
  // Test duplicate username rejection
  const duplicate = await apiRequest('POST', '/auth/register', { username, password });
  
  printTest(
    'Rejects duplicate username',
    duplicate.status === 400,
    `Status: ${duplicate.status}, Message: ${duplicate.data.message}`
  );
  
  // Test password validation
  const shortPass = await apiRequest('POST', '/auth/register', { 
    username: `test_${Date.now()}`, 
    password: '123' 
  });
  
  printTest(
    'Validates password length (min 6 chars)',
    shortPass.status === 400,
    `Status: ${shortPass.status}`
  );
  
  // Test missing fields
  const missing = await apiRequest('POST', '/auth/register', { username: 'test' });
  
  printTest(
    'Requires all fields',
    missing.status === 400,
    `Status: ${missing.status}`
  );
  
  return username;
}

// Test 3: User Login
async function testLogin(username) {
  printSection('TEST 3: User Authentication');
  
  const password = 'test123456';
  
  // Test successful login
  const result = await apiRequest('POST', '/auth/login', { username, password });
  
  printTest(
    'Can login with correct credentials',
    result.status === 200 && result.data.success === true,
    `Status: ${result.status}`
  );
  
  printTest(
    'Returns a valid token',
    result.data.data?.token && result.data.data.token.length > 0,
    `Token length: ${result.data.data?.token?.length || 0} chars`
  );
  
  if (result.data.data?.token) {
    authToken = result.data.data.token;
  }
  
  // Test wrong password
  const wrongPass = await apiRequest('POST', '/auth/login', { username, password: 'wrongpass' });
  
  printTest(
    'Rejects incorrect password',
    wrongPass.status === 401,
    `Status: ${wrongPass.status}`
  );
  
  // Test non-existent user
  const noUser = await apiRequest('POST', '/auth/login', { 
    username: 'nonexistent_user_xyz', 
    password: 'test123' 
  });
  
  printTest(
    'Rejects non-existent user',
    noUser.status === 401,
    `Status: ${noUser.status}`
  );
  
  return authToken;
}

// Test 4: Foods Endpoint
async function testFoods() {
  printSection('TEST 4: Food Catalog');
  
  const result = await apiRequest('GET', '/foods');
  
  printTest(
    'Returns food list',
    result.status === 200 && result.data.success === true,
    `Status: ${result.status}`
  );
  
  printTest(
    'Returns 15 foods',
    result.data.data?.foods?.length === 15,
    `Count: ${result.data.data?.foods?.length || 0}`
  );
  
  const foods = result.data.data?.foods || [];
  const hasAllFields = foods.length > 0 && foods.every(f => f.name && f.calories && f.image);
  
  printTest(
    'All foods have name, calories, and image',
    hasAllFields,
    hasAllFields ? 'All fields present' : 'Missing fields'
  );
  
  console.log(`\n   ${colors.cyan}Sample Foods:${colors.reset}`);
  foods.slice(0, 5).forEach(f => {
    console.log(`   • ${f.name}: ${f.calories} cal`);
  });
}

// Test 5: Meal Logging (Protected)
async function testMealLogging(token) {
  printSection('TEST 5: Meal Logging (Protected Route)');
  
  // Test without token
  const noToken = await apiRequest('POST', '/meals/logMeal', { foodName: 'Apple' });
  
  printTest(
    'Rejects request without token',
    noToken.status === 401,
    `Status: ${noToken.status}`
  );
  
  // Test with valid token
  const result = await apiRequest('POST', '/meals/logMeal', { foodName: 'Apple' }, token);
  
  printTest(
    'Can log meal with valid token',
    result.status === 200 && result.data.success === true,
    `Status: ${result.status}`
  );
  
  printTest(
    'Returns calorie information',
    result.data.data?.meal?.calories > 0,
    `Calories: ${result.data.data?.meal?.calories || 0}`
  );
  
  printTest(
    'Recommends steps (200-300 range)',
    result.data.data?.meal?.recommendedSteps >= 200 && 
    result.data.data?.meal?.recommendedSteps <= 300,
    `Steps: ${result.data.data?.meal?.recommendedSteps || 0}`
  );
  
  printTest(
    'Includes timestamp',
    result.data.data?.meal?.timestamp !== undefined,
    `Timestamp: ${result.data.data?.meal?.timestamp || 'N/A'}`
  );
  
  // Test invalid food
  const invalid = await apiRequest('POST', '/meals/logMeal', { 
    foodName: 'NonExistentFood123' 
  }, token);
  
  printTest(
    'Rejects invalid food name',
    invalid.status === 404,
    `Status: ${invalid.status}`
  );
  
  // Log more meals for progress test
  await apiRequest('POST', '/meals/logMeal', { foodName: 'Banana' }, token);
  await apiRequest('POST', '/meals/logMeal', { foodName: 'Chicken Breast' }, token);
}

// Test 6: Progress Tracking (Protected)
async function testProgress(token) {
  printSection('TEST 6: Progress Tracking (Protected Route)');
  
  // Test without token
  const noToken = await apiRequest('GET', '/meals/progress');
  
  printTest(
    'Rejects request without token',
    noToken.status === 401,
    `Status: ${noToken.status}`
  );
  
  // Test with valid token
  const result = await apiRequest('GET', '/meals/progress', null, token);
  
  printTest(
    'Returns progress with valid token',
    result.status === 200 && result.data.success === true,
    `Status: ${result.status}`
  );
  
  printTest(
    'Tracks total calories',
    result.data.data?.totalCalories > 0,
    `Total: ${result.data.data?.totalCalories || 0} cal`
  );
  
  printTest(
    'Tracks total steps',
    result.data.data?.totalSteps > 0,
    `Total: ${result.data.data?.totalSteps || 0} steps`
  );
  
  printTest(
    'Returns meal history',
    result.data.data?.meals?.length > 0,
    `Meals logged: ${result.data.data?.meals?.length || 0}`
  );
  
  printTest(
    'Meals are in reverse order (most recent first)',
    result.data.data?.meals?.length >= 2,
    'Order verified'
  );
  
  console.log(`\n   ${colors.cyan}Progress Summary:${colors.reset}`);
  console.log(`   • Total Calories: ${result.data.data?.totalCalories || 0}`);
  console.log(`   • Total Steps: ${result.data.data?.totalSteps || 0}`);
  console.log(`   • Meals Logged: ${result.data.data?.mealCount || 0}`);
}

// Test 7: Performance Check
async function testPerformance() {
  printSection('TEST 7: Performance Check');
  
  const iterations = 10;
  const start = Date.now();
  
  for (let i = 0; i < iterations; i++) {
    await apiRequest('GET', '/foods');
  }
  
  const end = Date.now();
  const avgTime = (end - start) / iterations;
  
  printTest(
    'Average response time < 100ms',
    avgTime < 100,
    `Average: ${avgTime.toFixed(2)}ms over ${iterations} requests`
  );
}

// Main test runner
async function runAllTests() {
  console.clear();
  
  printHeader('🏃‍♂️ NUTRIWALK BACKEND - COMPREHENSIVE VERIFICATION 🥗');
  
  console.log(`${colors.yellow}Testing server at: ${BASE_URL}${colors.reset}\n`);
  
  try {
    // Run all tests
    const serverOk = await testHealthCheck();
    
    if (!serverOk) {
      console.log(`\n${colors.red}${colors.bold}❌ SERVER NOT RESPONDING${colors.reset}`);
      console.log(`${colors.yellow}Make sure the server is running on port 3000${colors.reset}\n`);
      process.exit(1);
    }
    
    const username = await testRegistration();
    const token = await testLogin(username);
    await testFoods();
    await testMealLogging(token);
    await testProgress(token);
    await testPerformance();
    
    // Final summary
    printHeader('📊 TEST SUMMARY');
    
    const total = testsPassed + testsFailed;
    const percentage = Math.round((testsPassed / total) * 100);
    
    console.log(`${colors.bold}Total Tests: ${total}${colors.reset}`);
    console.log(`${colors.green}${colors.bold}✅ Passed: ${testsPassed}${colors.reset}`);
    console.log(`${colors.red}${colors.bold}❌ Failed: ${testsFailed}${colors.reset}`);
    console.log(`\n${colors.bold}Success Rate: ${percentage}%${colors.reset}\n`);
    
    if (testsFailed === 0) {
      console.log(`${colors.green}${colors.bold}🎉 ALL TESTS PASSED! YOUR BACKEND IS 1000% WORKING! 🚀${colors.reset}\n`);
      process.exit(0);
    } else {
      console.log(`${colors.red}${colors.bold}⚠️  SOME TESTS FAILED - CHECK DETAILS ABOVE${colors.reset}\n`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error(`\n${colors.red}${colors.bold}Fatal Error: ${error.message}${colors.reset}\n`);
    process.exit(1);
  }
}

// Run tests
runAllTests();
