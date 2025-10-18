# NutriWalk Prototype 🏃‍♂️🥗

A clean, optimized, and hackathon-ready Node.js backend for the NutriWalk Prototype application. This backend provides authentication, food catalog, and meal logging functionality with step recommendations.

## 🚀 Features

- **Secure Authentication**: Token-based auth with bcrypt password hashing
- **Fast Food Lookups**: O(1) lookup performance using Maps
- **Meal Logging**: Automatic calorie tracking with step recommendations
- **Progress Tracking**: View total calories, steps, and meal history
- **In-Memory Storage**: Rapid prototyping without database setup
- **CORS Enabled**: Ready for frontend integration
- **Modular Architecture**: Easy to expand and maintain
- **Production Ready**: Deploy to Render, Railway, or Heroku

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🛠️ Installation

1. **Install dependencies:**
  ```bash
  npm install
  ```

2. **Start the server:**
  ```bash
  npm start
  ```

  For development with auto-reload:
  ```bash
  npm run dev
  ```

3. **Server will be running at:**
  ```
  http://localhost:3000
  ```

## 📚 API Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "username": "john_doe"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "uuid-token-here",
    "username": "john_doe"
  }
}
```

### Foods

#### Get All Foods
```http
GET /foods
```

**Response:**
```json
{
  "success": true,
  "message": "Foods retrieved successfully",
  "data": {
    "foods": [
      {
        "name": "Apple",
        "calories": 95,
        "image": "https://..."
      }
    ],
    "count": 15
  }
}
```

### Meals (Protected - Requires Authentication)

#### Log Meal
```http
POST /meals/logMeal
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "foodName": "Apple"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Meal logged successfully",
  "data": {
    "meal": {
      "id": "meal_1234567890_abc123",
      "foodName": "Apple",
      "calories": 95,
      "image": "https://...",
      "recommendedSteps": 250,
      "timestamp": "2025-10-17T12:00:00.000Z"
    },
    "summary": {
      "totalCalories": 95,
      "totalSteps": 250
    }
  }
}
```

#### Get Progress
```http
GET /meals/progress
Authorization: Bearer <your-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Progress retrieved successfully",
  "data": {
    "totalCalories": 450,
    "totalSteps": 750,
    "mealCount": 3,
    "meals": [...]
  }
}
```

## 🏗️ Project Structure

```
nutriwalk-backend/
├── index.js                 # Main server file
├── package.json             # Dependencies and scripts
├── data/
│   └── foods.js            # Food catalog with O(1) lookup
├── routes/
│   ├── auth.js             # Authentication endpoints
│   ├── foods.js            # Food catalog endpoints
│   └── meals.js            # Meal logging endpoints
├── middleware/
│   └── authMiddleware.js   # Token validation
└── utils/
    └── hash.js             # Password hashing utilities
```

## 🔒 Security Features

- **Password Hashing**: All passwords encrypted with bcryptjs
- **Token Authentication**: UUID-based session tokens
- **Protected Routes**: Middleware validation for sensitive endpoints
- **Input Validation**: Request validation on all endpoints

## 🎯 Step Recommendation

The backend automatically recommends 200-300 steps for each meal logged, encouraging users to walk before eating!

## 🚢 Deployment

### Deploy to Render/Railway/Heroku

1. Push code to GitHub
2. Connect repository to hosting platform
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Deploy!

The PORT environment variable is automatically set by hosting platforms.

## 🧪 Testing

You can test the API using:
- **Postman**: Import endpoints and test
- **cURL**: Command-line testing
- **Thunder Client** (VS Code): Built-in API testing

Example cURL:
```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# Get Foods
curl http://localhost:3000/foods

# Log Meal (replace TOKEN)
curl -X POST http://localhost:3000/meals/logMeal \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"foodName":"Apple"}'
```

## 📝 Future Enhancements

- [ ] Persistent database (MongoDB/PostgreSQL)
- [ ] User profiles with dietary preferences
- [ ] AI-powered food recognition
- [ ] Social features and leaderboards
- [ ] Mobile push notifications
- [ ] Analytics dashboard
- [ ] Export meal history

## 📄 License

MIT License - Feel free to use for your hackathon!

## 🤝 Contributing

This is a hackathon project, but contributions are welcome! Feel free to fork and improve.

---

Built with ❤️ for NutriWalk Hackathon
