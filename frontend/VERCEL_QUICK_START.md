# Vercel Deployment - Quick Start Guide

## 🚀 Deploy in 5 Minutes!

---

## Step 1: Go to Vercel
```
https://vercel.com
```
Click "Sign Up" → Choose "Continue with GitHub"

---

## Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Find your repository
3. Click **"Import"**

---

## Step 3: Configure

### Root Directory
```
frontend
```
⚠️ Click "Edit" and select `frontend` folder

### Framework
```
Vite
```
(Auto-detected)

### Build Settings
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

## Step 4: Deploy

Click **"Deploy"** button

Wait 2-5 minutes ⏳

---

## Step 5: Get Your URL

Copy your URL:
```
https://your-project-name.vercel.app
```

---

## Step 6: Update Backend CORS

### Edit backend/server.js

Add your Vercel URL:
```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
  "https://ecommerce-shopping-theta.vercel.app",
  "https://your-project-name.vercel.app" // Add this
];
```

### Push to GitHub
```bash
cd backend
git add .
git commit -m "Add Vercel URL to CORS"
git push origin main
```

Wait 2-3 minutes for Render to redeploy.

---

## Step 7: Test Your Site! ✅

Open: `https://your-project-name.vercel.app`

Test:
- [ ] Products load
- [ ] Images display
- [ ] Login works
- [ ] Signup works
- [ ] Cart works
- [ ] Checkout works

---

## 🎉 Done!

Your e-commerce site is live!

### Your URLs:
- **Frontend:** `https://your-project-name.vercel.app`
- **Backend:** `https://ecommerce-shopping-k3bk.onrender.com`

---

## 🐛 Issues?

### CORS Error?
1. Make sure you added Vercel URL to backend CORS
2. Push to GitHub
3. Wait for Render to redeploy
4. Clear browser cache

### 404 on Refresh?
- `vercel.json` file is already created ✅
- Redeploy if needed

### Backend Sleeping?
- First request takes 30-60 seconds (free tier)
- This is normal

---

## 📚 Full Guide

See `VERCEL_DEPLOYMENT_GUIDE.md` for complete details.

---

Good luck! 🚀
