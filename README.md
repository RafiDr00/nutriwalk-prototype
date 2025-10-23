# CaloriCatcher Backend 🏃‍♂️🥗# CaloriCatcher Prototype 🏃‍♂️🥗



> A production-ready, secure Express.js backend for the CaloriCatcher applicationA clean, optimized, and hackathon-ready Node.js backend for the CaloriCatcher Prototype application. This backend provides authentication, food catalog, and meal logging functionality with step recommendations.



## 🚀 Quick Start## 🚀 Features



```bash- **Secure Authentication**: Token-based auth with bcrypt password hashing

# Install dependencies- **Fast Food Lookups**: O(1) lookup performance using Maps

npm install- **Meal Logging**: Automatic calorie tracking with step recommendations

- **Progress Tracking**: View total calories, steps, and meal history

# Create environment file- **In-Memory Storage**: Rapid prototyping without database setup

cp .env.example .env- **CORS Enabled**: Ready for frontend integration

- **Modular Architecture**: Easy to expand and maintain

# Start development server- **Production Ready**: Deploy to Render, Railway, or Heroku

npm run dev

## 📋 Prerequisites

# Start production server

npm start- Node.js (v14 or higher)

```- npm or yarn



Server runs on: **http://localhost:3000**## 🛠️ Installation



## 📋 Features1. **Install dependencies:**

  ```bash

- ✅ **Token-based Authentication** with bcrypt password hashing  npm install

- ✅ **Session Management** with configurable expiration  ```

- ✅ **Rate Limiting** for API security

- ✅ **Input Validation** and sanitization2. **Start the server:**

- ✅ **Security Headers** with Helmet  ```bash

- ✅ **Structured Logging** with color-coded levels  npm start

- ✅ **O(1) Food Lookups** for optimal performance  ```

- ✅ **In-memory Storage** for rapid prototyping

- ✅ **Comprehensive Error Handling** with custom error classes  For development with auto-reload:

- ✅ **Environment Configuration** with dotenv  ```bash

  npm run dev

## 📁 Project Structure  ```



```3. **Server will be running at:**

caloricatcher-backend/  ```

├── config/              # Configuration management  http://localhost:3000

│   └── config.js  ```

├── data/                # In-memory data storage

│   └── foods.js## 📚 API Endpoints

├── middleware/          # Express middleware

│   ├── authMiddleware.js### Authentication

│   └── validation.js

├── routes/              # API routes#### Register User

│   ├── auth.js```http

│   ├── foods.jsPOST /auth/register

│   └── meals.jsContent-Type: application/json

├── utils/               # Utility functions

│   ├── errors.js{

│   ├── hash.js  "username": "john_doe",

│   └── logger.js  "password": "securepassword123"

├── frontend/            # Frontend files}

│   ├── Frontend.html```

│   ├── Frontend.js

│   └── style.css**Response:**

├── tests/               # Test files & Postman collection```json

├── scripts/             # Utility scripts{

├── docs/                # Documentation  "success": true,

├── index.js             # Main server file  "message": "User registered successfully",

└── package.json         # Dependencies  "data": {

```    "username": "john_doe"

  }

## 🔌 API Endpoints}

```

### Authentication

- `POST /auth/register` - Register new user#### Login

- `POST /auth/login` - Login and get token```http

- `POST /auth/logout` - Logout (protected)POST /auth/login

Content-Type: application/json

### Foods

- `GET /foods` - Get all available foods{

  "username": "john_doe",

### Meals (Protected)  "password": "securepassword123"

- `POST /meals/logMeal` - Log a meal}

- `GET /meals/progress` - Get user's progress```



## 🔐 Environment Variables**Response:**

```json

```bash{

PORT=3000  "success": true,

NODE_ENV=development  "message": "Login successful",

SESSION_EXPIRY_HOURS=24  "data": {

RATE_LIMIT_WINDOW_MS=900000    "token": "uuid-token-here",

RATE_LIMIT_MAX_REQUESTS=100    "username": "john_doe"

CORS_ORIGIN=*  }

```}

```

## 🧪 Testing

### Foods

```bash

# Run API tests#### Get All Foods

npm test```http

GET /foods

# Run comprehensive verification```

node tests/verify-all.js

**Response:**

# Run quick status check```json

powershell -ExecutionPolicy Bypass -File scripts/quick-check.ps1{

```  "success": true,

  "message": "Foods retrieved successfully",

## 📚 Documentation  "data": {

    "foods": [

- **[Complete README](docs/README.md)** - Detailed documentation      {

- **[API Reference](docs/QUICK-REFERENCE.txt)** - Quick API reference        "name": "Apple",

- **[Refinements](docs/REFINEMENTS.md)** - Recent improvements        "calories": 95,

- **[Deployment Guide](docs/DEPLOYMENT.md)** - Deployment instructions        "image": "https://..."

- **[Project Summary](docs/PROJECT-SUMMARY.md)** - Project overview      }

    ],

## 🚢 Deployment    "count": 15

  }

The backend is ready for deployment to:}

- Render```

- Railway  

- Heroku### Meals (Protected - Requires Authentication)

- Any Node.js hosting platform

#### Log Meal

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.```http

POST /meals/logMeal

## 🛠️ Tech StackAuthorization: Bearer <your-token>

Content-Type: application/json

- **Runtime**: Node.js

- **Framework**: Express.js{

- **Authentication**: bcryptjs + UUID tokens  "foodName": "Apple"

- **Validation**: express-validator}

- **Security**: helmet + express-rate-limit```

- **Configuration**: dotenv

**Response:**

## 📝 License```json

{

MIT License - Feel free to use for your projects!  "success": true,

  "message": "Meal logged successfully",

---  "data": {

    "meal": {

Built with ❤️ for CaloriCatcher Hackathon      "id": "meal_1234567890_abc123",

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
caloricatcher-backend/
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

Built with ❤️ for CaloriCatcher Hackathon
