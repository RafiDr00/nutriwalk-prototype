# 🚀 NutriWalk Prototype Deployment Guide

Complete guide for deploying your NutriWalk Prototype backend to various platforms.

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Deploy to Render](#deploy-to-render)
- [Deploy to Railway](#deploy-to-railway)
- [Deploy to Heroku](#deploy-to-heroku)
- [Environment Variables](#environment-variables)
- [Testing Deployment](#testing-deployment)

---

## 🏃 Quick Start

### Local Development

1. **Clone and Install:**
   ```bash
   cd nutriwalk-prototype
   npm install
   ```

2. **Start Server:**
   ```bash
   npm start
   ```

3. **Test API:**
   - Open http://localhost:3000 in your browser
   - Use the Postman collection: `NutriWalk-API.postman_collection.json`
   - Or run the test script: `node test-api.js`

---

## 🌐 Deploy to Render

[Render](https://render.com) - Free tier available, automatic HTTPS, easy setup.

### Steps:

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Create Render Account:**
   - Go to https://render.com
   - Sign up with GitHub

3. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** nutriwalk-backend
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Plan:** Free

4. **Deploy:**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Your API will be available at: `https://nutriwalk-backend.onrender.com`

### Environment Variables (Optional):
```
NODE_ENV=production
```

---

## 🚂 Deploy to Railway

[Railway](https://railway.app) - $5 free credit, instant deployments.

### Steps:

1. **Push to GitHub** (same as Render)

2. **Create Railway Account:**
   - Go to https://railway.app
   - Sign up with GitHub

3. **Deploy Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway auto-detects Node.js and deploys

4. **Configure:**
   - Click on your service
   - Go to "Settings" → "Generate Domain"
   - Your API will be available at: `https://nutriwalk-backend.up.railway.app`

### Environment Variables (Optional):
Railway auto-sets PORT, but you can add:
```
NODE_ENV=production
```

---

## 🟣 Deploy to Heroku

[Heroku](https://heroku.com) - Popular platform, easy CLI.

### Prerequisites:
- Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

### Steps:

1. **Login to Heroku:**
   ```bash
   heroku login
   ```

2. **Create Heroku App:**
   ```bash
   heroku create nutriwalk-backend
   ```

3. **Add Procfile:**
   Create a file named `Procfile` (no extension) with:
   ```
   web: node index.js
   ```

4. **Deploy:**
   ```bash
   git add .
   git commit -m "Add Procfile for Heroku"
   git push heroku main
   ```

5. **Open App:**
   ```bash
   heroku open
   ```
   Your API will be at: `https://nutriwalk-backend.herokuapp.com`

### Environment Variables:
```bash
heroku config:set NODE_ENV=production
```

---

## 🔧 Environment Variables

Your backend works without environment variables, but for production you can set:

### Required:
- `PORT` - Automatically set by hosting platforms

### Optional:
- `NODE_ENV=production` - For production mode

### How to Set:

**Render:**
- Dashboard → Environment → Add Environment Variable

**Railway:**
- Dashboard → Variables → New Variable

**Heroku:**
```bash
heroku config:set KEY=VALUE
```

---

## 🧪 Testing Deployment

After deployment, test your endpoints:

### 1. Health Check:
```bash
curl https://YOUR_DOMAIN.com/
```

### 2. Register User:
```bash
curl -X POST https://YOUR_DOMAIN.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'
```

### 3. Login:
```bash
curl -X POST https://YOUR_DOMAIN.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'
```

### 4. Get Foods:
```bash
curl https://YOUR_DOMAIN.com/foods
```

### 5. Log Meal (replace TOKEN):
```bash
curl -X POST https://YOUR_DOMAIN.com/meals/logMeal \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"foodName":"Apple"}'
```

---

## 🔒 CORS Configuration

The backend allows all origins by default for hackathon ease. For production:

Edit `index.js`:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

---

## 📊 Monitoring

### Render:
- Dashboard shows logs and metrics
- Access logs: Dashboard → Logs tab

### Railway:
- Real-time logs in dashboard
- Deployment history available

### Heroku:
```bash
heroku logs --tail
```

---

## 🐛 Troubleshooting

### Server Not Starting:
- Check logs for errors
- Verify `package.json` has correct start script
- Ensure PORT is not hardcoded

### Module Errors:
- Run `npm install` locally first
- Ensure `"type": "module"` is in package.json
- Check Node.js version (v14+ required)

### API Not Responding:
- Verify deployment completed
- Check domain/URL is correct
- Test health endpoint first

### Authentication Issues:
- Ensure Authorization header format: `Bearer TOKEN`
- Check token is valid (from login response)

---

## 🎉 Success Checklist

- [ ] Local server runs: `npm start`
- [ ] All endpoints tested locally
- [ ] Code pushed to GitHub
- [ ] Deployed to hosting platform
- [ ] Health check returns 200
- [ ] Can register and login
- [ ] Protected routes work with token
- [ ] Frontend connected to backend

---

## 📚 Additional Resources

- **Render Docs:** https://render.com/docs
- **Railway Docs:** https://docs.railway.app
- **Heroku Docs:** https://devcenter.heroku.com
- **Express.js:** https://expressjs.com
- **Node.js:** https://nodejs.org

---

## 🤝 Support

Having issues? Check:
1. Server logs on your hosting platform
2. Console errors in browser
3. Network tab in DevTools
4. API response messages

---

**Built for NutriWalk Hackathon** 🏃‍♂️🥗

Good luck with your demo! 🚀
