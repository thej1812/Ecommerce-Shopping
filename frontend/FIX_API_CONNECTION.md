# Fix API Connection Issue - Quick Guide

## 🐛 Problem
Your deployed frontend is trying to connect to `localhost:5000` instead of the deployed backend.

## ✅ Solution Applied

I've updated the API configuration to automatically detect the environment.

---

## 🔧 What I Fixed

### 1. Updated `frontend/src/utils/api.js`
Now uses hostname detection to automatically choose the correct API URL:
- **localhost** → `http://localhost:5000`
- **Vercel domain** → `https://ecommerce-shopping-k3bk.onrender.com`

### 2. Created Environment Files
- `.env.production` - For production builds
- `.env.development` - For local development

---

## 🚀 How to Fix Your Deployment

### Option 1: Redeploy to Vercel (Recommended)

#### Step 1: Push Changes to GitHub
```bash
cd frontend
git add .
git commit -m "Fix API URL for production"
git push origin main
```

#### Step 2: Vercel Will Auto-Deploy
- Vercel detects the push
- Automatically rebuilds and redeploys
- Wait 2-3 minutes

#### Step 3: Test Your Site
Open your Vercel URL and check browser console:
```
🔗 API URL: https://ecommerce-shopping-k3bk.onrender.com
📍 Environment: Production
```

---

### Option 2: Manual Redeploy in Vercel

1. Go to: https://vercel.com/dashboard
2. Click on your project
3. Click "Deployments" tab
4. Click "..." on latest deployment
5. Click "Redeploy"
6. Wait 2-3 minutes

---

### Option 3: Add Environment Variable in Vercel

1. Go to Vercel dashboard
2. Click on your project
3. Go to "Settings" → "Environment Variables"
4. Add:
   ```
   Name: VITE_API_URL
   Value: https://ecommerce-shopping-k3bk.onrender.com
   ```
5. Click "Save"
6. Redeploy

---

## 🧪 Verify the Fix

### Step 1: Open Your Deployed Site
```
https://your-project.vercel.app
```

### Step 2: Open Browser Console (F12)
You should see:
```
🔗 API URL: https://ecommerce-shopping-k3bk.onrender.com
📍 Environment: Production
🌐 Hostname: your-project.vercel.app
```

### Step 3: Test Signup
- Try creating an account
- Should work now!

---

## 🔍 Debugging

### Check Console Logs
Open browser console (F12) and look for:
```
🔗 API URL: https://ecommerce-shopping-k3bk.onrender.com
```

If you see `localhost:5000`, the fix didn't apply yet.

### Check Network Tab
1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Try to signup
4. Look at the request URL
5. Should be: `https://ecommerce-shopping-k3bk.onrender.com/api/auth/signup`

---

## ⚠️ Important Notes

### Backend CORS
Make sure your backend allows your Vercel URL!

**File:** `backend/server.js`
```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
  "https://ecommerce-shopping-theta.vercel.app",
  "https://your-vercel-url.vercel.app" // Add your actual URL
];
```

If you haven't added it yet:
1. Add your Vercel URL to `allowedOrigins`
2. Push to GitHub
3. Wait for Render to redeploy (2-3 minutes)

### Backend Sleeping (Free Tier)
- Render free tier sleeps after 15 min
- First request takes 30-60 seconds
- This is normal

---

## 📋 Quick Checklist

- [ ] Push changes to GitHub
- [ ] Vercel auto-deploys (or manual redeploy)
- [ ] Check browser console for correct API URL
- [ ] Test signup/login
- [ ] Verify backend CORS includes Vercel URL
- [ ] Test all features

---

## 🎯 Expected Result

After the fix:
- ✅ Signup works
- ✅ Login works
- ✅ Products load
- ✅ Images display
- ✅ Cart works
- ✅ Checkout works
- ✅ No more `localhost:5000` errors

---

## 💡 Why This Happened

Vite's `import.meta.env.PROD` sometimes doesn't work reliably in all build configurations. The new solution uses:

1. **Environment variables** (most reliable)
2. **Hostname detection** (fallback)
3. **Hardcoded URLs** (last resort)

This ensures it works in all scenarios!

---

## 🚀 Next Steps

1. Push changes to GitHub
2. Wait for Vercel to redeploy
3. Test your site
4. Enjoy your live e-commerce platform!

---

Need help? Check the browser console for the API URL logs!
