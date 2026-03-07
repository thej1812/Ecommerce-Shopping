# Backend Deployment Guide - Step by Step

## 🚀 Deploying to Render (Recommended - Free Tier Available)

This guide will help you deploy your Node.js + Express backend to Render.

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ GitHub account
- ✅ Your code pushed to GitHub repository
- ✅ MongoDB Atlas account (you already have this)
- ✅ Cloudinary account (you already have this)

---

## 🔧 Step 1: Prepare Your Backend for Deployment

### 1.1 Update server.js for Production

Your server.js needs to use environment variable for PORT:

**Current:**
```javascript
app.listen(5000, () =>
  console.log("Server running on port 5000")
);
```

**Should be:**
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
```

### 1.2 Verify package.json

Make sure your `package.json` has:
```json
{
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 1.3 Update CORS for Production

Add your production frontend URL to allowed origins in `server.js`:
```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
  "https://ecommerce-shopping-theta.vercel.app",
  "https://your-frontend-url.vercel.app" // Add your actual frontend URL
];
```

---

## 📦 Step 2: Push Code to GitHub

### 2.1 Initialize Git (if not already done)
```bash
cd backend
git init
```

### 2.2 Create .gitignore (already exists)
Make sure `.gitignore` includes:
```
node_modules/
.env
*.log
.DS_Store
```

### 2.3 Commit and Push
```bash
git add .
git commit -m "Prepare backend for deployment"
git push origin main
```

---

## 🌐 Step 3: Deploy to Render

### 3.1 Create Render Account
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub

### 3.2 Create New Web Service
1. Click "New +" button
2. Select "Web Service"
3. Connect your GitHub repository
4. Select your backend repository

### 3.3 Configure Web Service

**Basic Settings:**
- **Name:** `your-ecommerce-backend` (or any name you want)
- **Region:** Choose closest to you
- **Branch:** `main` (or your default branch)
- **Root Directory:** `backend` (if backend is in a subfolder)
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Instance Type:**
- Select **Free** (or paid if you prefer)

### 3.4 Add Environment Variables

Click "Advanced" and add these environment variables:

```
PORT=5000
MONGO_URI=mongodb+srv://thejashwini1800_db_user:5GJZZURSZqHaI3J5@cluster0.sdggx56.mongodb.net/?appName=Cluster0
JWT_SECRET=2t72xKKassyyyy
CLOUDINARY_CLOUD_NAME=dpln3xsrg
CLOUDINARY_API_KEY=613441746788743
CLOUDINARY_API_SECRET=uZIF2mM3E6NErW_M5Gi-D6OQDyA
```

⚠️ **IMPORTANT:** Use your actual values from `.env` file

### 3.5 Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. You'll get a URL like: `https://your-app-name.onrender.com`

---

## ✅ Step 4: Verify Deployment

### 4.1 Test API Endpoints

Open these URLs in your browser:

1. **Health Check:**
   ```
   https://your-app-name.onrender.com/api/products
   ```
   Should return list of products

2. **Categories:**
   ```
   https://your-app-name.onrender.com/api/categories
   ```
   Should return list of categories

### 4.2 Check Logs
1. Go to Render dashboard
2. Click on your service
3. Click "Logs" tab
4. Look for "Server running on port 5000"

---

## 🔗 Step 5: Update Frontend

### 5.1 Update API URL in Frontend

In `frontend/src/utils/api.js`:

**Change from:**
```javascript
export const API_URL = "http://localhost:5000";
```

**To:**
```javascript
export const API_URL = import.meta.env.PROD 
  ? "https://your-app-name.onrender.com"
  : "http://localhost:5000";
```

### 5.2 Create .env file in frontend (optional)
```
VITE_API_URL=https://your-app-name.onrender.com
```

Then use:
```javascript
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
```

---

## 🎯 Step 6: Create First Admin Account

### 6.1 SSH into Render (or use Render Shell)
1. Go to Render dashboard
2. Click on your service
3. Click "Shell" tab
4. Run:
```bash
npm run seed-admin
```

### 6.2 Or Use MongoDB Compass
1. Connect to your MongoDB Atlas
2. Go to `users` collection
3. Manually insert admin document (see ADMIN_SETUP.md)

---

## 🔒 Step 7: Security Best Practices

### 7.1 Regenerate Secrets
Since your `.env` was in Git history:
1. **MongoDB:** Rotate password in MongoDB Atlas
2. **JWT_SECRET:** Generate new secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. **Cloudinary:** Regenerate API credentials in Cloudinary dashboard

### 7.2 Update Environment Variables
Update all secrets in Render dashboard:
1. Go to your service
2. Click "Environment"
3. Update variables
4. Click "Save Changes"
5. Service will auto-redeploy

---

## 📊 Step 8: Monitor Your Deployment

### 8.1 Check Metrics
- Go to Render dashboard
- View CPU, Memory, and Request metrics

### 8.2 Set Up Alerts (Optional)
- Configure email alerts for downtime
- Set up health checks

---

## 🐛 Troubleshooting

### Issue 1: "Application failed to respond"
**Solution:**
- Check if PORT is from environment variable
- Verify `npm start` command in package.json
- Check logs for errors

### Issue 2: "Cannot connect to MongoDB"
**Solution:**
- Verify MONGO_URI in environment variables
- Check MongoDB Atlas network access (allow all IPs: 0.0.0.0/0)
- Verify database user credentials

### Issue 3: "CORS Error"
**Solution:**
- Add your frontend URL to allowedOrigins in server.js
- Redeploy backend

### Issue 4: "Cloudinary upload failed"
**Solution:**
- Verify Cloudinary credentials in environment variables
- Check Cloudinary dashboard for API limits

### Issue 5: "Service keeps sleeping (Free tier)"
**Solution:**
- Render free tier sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Consider upgrading to paid tier for always-on service

---

## 🔄 Step 9: Continuous Deployment

### Auto-Deploy on Git Push
Render automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update backend"
git push origin main

# Render will automatically deploy
```

---

## 📝 Step 10: Post-Deployment Checklist

- [ ] Backend is accessible at Render URL
- [ ] All API endpoints working
- [ ] MongoDB connection successful
- [ ] Cloudinary uploads working
- [ ] Admin account created
- [ ] Frontend updated with backend URL
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Logs show no errors
- [ ] Test login/signup
- [ ] Test product creation
- [ ] Test image upload
- [ ] Test order placement
- [ ] Test review system

---

## 🎉 Success!

Your backend is now deployed and running on Render!

**Your Backend URL:**
```
https://your-app-name.onrender.com
```

**Next Steps:**
1. Deploy your frontend to Vercel
2. Update frontend API URL
3. Test the entire application
4. Share with users!

---

## 💡 Alternative Deployment Options

### Option 2: Railway
- Similar to Render
- Free tier available
- Easy deployment
- https://railway.app

### Option 3: Heroku
- Popular platform
- No free tier anymore
- $5/month minimum
- https://heroku.com

### Option 4: DigitalOcean App Platform
- $5/month minimum
- More control
- https://www.digitalocean.com/products/app-platform

### Option 5: AWS Elastic Beanstalk
- More complex setup
- Free tier for 12 months
- Scalable
- https://aws.amazon.com/elasticbeanstalk

---

## 📞 Need Help?

If you encounter issues:
1. Check Render logs
2. Verify environment variables
3. Test API endpoints with Postman
4. Check MongoDB Atlas connection
5. Review CORS settings

---

## 🔗 Useful Links

- Render Documentation: https://render.com/docs
- MongoDB Atlas: https://cloud.mongodb.com
- Cloudinary Dashboard: https://cloudinary.com/console
- Your Backend Repo: [Add your GitHub URL]

---

Good luck with your deployment! 🚀
