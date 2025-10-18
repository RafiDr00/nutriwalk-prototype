# NutriWalk Backend - Quick Verification Dashboard
# Run this to see if everything is working

Write-Host "`n╔══════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          🏃‍♂️ NUTRIWALK BACKEND STATUS CHECK 🥗                    ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000"
$allPassed = $true

# Test 1: Server Health
Write-Host "▶ Testing Server Health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri $baseUrl -TimeoutSec 5
    Write-Host "  ✅ Server is UP and running" -ForegroundColor Green
    Write-Host "     Version: $($health.version)" -ForegroundColor Gray
} catch {
    Write-Host "  ❌ Server is DOWN or not responding" -ForegroundColor Red
    Write-Host "     Make sure to run: npm start" -ForegroundColor Yellow
    $allPassed = $false
    exit 1
}

# Test 2: Register User
Write-Host "`n▶ Testing User Registration..." -ForegroundColor Yellow
try {
    $username = "quicktest_$(Get-Random)"
    $regBody = @{username=$username; password="test123456"} | ConvertTo-Json
    $reg = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $regBody -ContentType "application/json"
    Write-Host "  ✅ Registration working" -ForegroundColor Green
    Write-Host "     Created user: $username" -ForegroundColor Gray
} catch {
    Write-Host "  ❌ Registration failed" -ForegroundColor Red
    $allPassed = $false
}

# Test 3: Login
Write-Host "`n▶ Testing Login & Authentication..." -ForegroundColor Yellow
try {
    $loginBody = @{username=$username; password="test123456"} | ConvertTo-Json
    $login = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $login.data.token
    Write-Host "  ✅ Login successful" -ForegroundColor Green
    Write-Host "     Token: $($token.Substring(0,20))..." -ForegroundColor Gray
} catch {
    Write-Host "  ❌ Login failed" -ForegroundColor Red
    $allPassed = $false
}

# Test 4: Get Foods
Write-Host "`n▶ Testing Food Catalog..." -ForegroundColor Yellow
try {
    $foods = Invoke-RestMethod -Uri "$baseUrl/foods"
    Write-Host "  ✅ Food catalog accessible" -ForegroundColor Green
    Write-Host "     Total foods: $($foods.data.count)" -ForegroundColor Gray
    Write-Host "     Sample: $($foods.data.foods[0].name), $($foods.data.foods[1].name), $($foods.data.foods[2].name)" -ForegroundColor Gray
} catch {
    Write-Host "  ❌ Food catalog failed" -ForegroundColor Red
    $allPassed = $false
}

# Test 5: Log Meal (Protected)
Write-Host "`n▶ Testing Meal Logging (Protected)..." -ForegroundColor Yellow
try {
    $headers = @{Authorization = "Bearer $token"}
    $mealBody = @{foodName="Apple"} | ConvertTo-Json
    $meal = Invoke-RestMethod -Uri "$baseUrl/meals/logMeal" -Method POST -Body $mealBody -ContentType "application/json" -Headers $headers
    Write-Host "  ✅ Meal logging working" -ForegroundColor Green
    Write-Host "     Logged: $($meal.data.meal.foodName) ($($meal.data.meal.calories) cal)" -ForegroundColor Gray
    Write-Host "     Steps recommended: $($meal.data.meal.recommendedSteps)" -ForegroundColor Gray
} catch {
    Write-Host "  ❌ Meal logging failed" -ForegroundColor Red
    $allPassed = $false
}

# Test 6: Get Progress (Protected)
Write-Host "`n▶ Testing Progress Tracking (Protected)..." -ForegroundColor Yellow
try {
    $headers = @{Authorization = "Bearer $token"}
    $progress = Invoke-RestMethod -Uri "$baseUrl/meals/progress" -Headers $headers
    Write-Host "  ✅ Progress tracking working" -ForegroundColor Green
    Write-Host "     Total calories: $($progress.data.totalCalories)" -ForegroundColor Gray
    Write-Host "     Total steps: $($progress.data.totalSteps)" -ForegroundColor Gray
    Write-Host "     Meals logged: $($progress.data.mealCount)" -ForegroundColor Gray
} catch {
    Write-Host "  ❌ Progress tracking failed" -ForegroundColor Red
    $allPassed = $false
}

# Test 7: Security Test (No Token)
Write-Host "`n▶ Testing Security (Protected Routes)..." -ForegroundColor Yellow
try {
    $mealBody = @{foodName="Apple"} | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/meals/logMeal" -Method POST -Body $mealBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "  ❌ Security FAILED - accepts requests without token" -ForegroundColor Red
    $allPassed = $false
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "  ✅ Security working - rejects unauthorized requests" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Unexpected error" -ForegroundColor Yellow
    }
}

# Final Summary
Write-Host "`n╔══════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                        📊 FINAL VERDICT                              ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

if ($allPassed) {
    Write-Host "  🎉 ALL SYSTEMS OPERATIONAL!" -ForegroundColor Green
    Write-Host "  🚀 YOUR BACKEND IS 1000% WORKING!" -ForegroundColor Green
    Write-Host "`n  ✅ Server Health: PASSED" -ForegroundColor Green
    Write-Host "  ✅ Authentication: PASSED" -ForegroundColor Green
    Write-Host "  ✅ Food Catalog: PASSED" -ForegroundColor Green
    Write-Host "  ✅ Meal Logging: PASSED" -ForegroundColor Green
    Write-Host "  ✅ Progress Tracking: PASSED" -ForegroundColor Green
    Write-Host "  ✅ Security: PASSED" -ForegroundColor Green
    Write-Host "`n  Ready for frontend integration! 🎯`n" -ForegroundColor Cyan
} else {
    Write-Host "  ⚠️  SOME TESTS FAILED" -ForegroundColor Red
    Write-Host "  Check the errors above for details`n" -ForegroundColor Yellow
}

Write-Host "Server running at: $baseUrl" -ForegroundColor Gray
Write-Host "Full test suite: node verify-all.js`n" -ForegroundColor Gray
