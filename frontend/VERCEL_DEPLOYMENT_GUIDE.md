# Frontend Deployment to Vercel - Step by Step

## 🎯 Goal
Deploy your React + Vite frontend to Vercel (Free Tier)

---

## ✅ Prerequisites

- [x] Backend deployed at: `https://ecommerce-shopping-k3bk.onrender.com`
- [x] Frontend API URL updated in `src/utils/api.js`
- [x] Code pushed to GitHub
- [ ] Vercel account (we'll create this)

---

## 🚀 Step 1: Sign Up for Vercel

1. Go to: **https://vercel.com**
2. Click: **"Start Deploying"** or **"Sign Up"**
3. Choose: **"Continue with GitHub"** (easiest option)
4. Authorize Vercel to access your repositories

---

## 📦 Step 2: Import Your Project

### 2.1 Click "Add New..."
- Location: Top right corner
- Select: **"Project"**

### 2.2 Import Git Repository
- Find your repository in the list
- Click **"Import"** next to it
- If you don't see it, click "Adjust GitHub App Permissions"

---

## ⚙️ Step 3: Configure Project

### Framework Preset
```
Vite
```
(Should auto-detect)

### Root Directory
```
frontend
```
⚠️ **Important:** Since your frontend is in a subfolder, click "Edit" and select `frontend`

### Build and Output Settings

**Build Command:**
```
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```
npm install
```

### Environment Variables (Optional)
You can add these if needed:
```
VITE_API_URL=https://ecommerce-shopping-k3bk.onrender.com
```

But since we're using `import.meta.env.PROD`, you don't need this.

---

## 🎉 Step 4: Deploy!

1. Click **"Deploy"** button
2. Wait 2-5 minutes for build and deployment
3. Watch the build logs

### What You'll See:
```
Building...
✓ Cloning repository
✓ Installing dependencies
✓ Building application
✓ Deployment ready
```

---

## 🔗 Step 5: Get Your Frontend URL

After deployment:
1. You'll see: **"Congratulations! Your project has been deployed"**
2. Copy your URL: `https://your-project-name.vercel.app`
3. Click "Visit" to see your live site

---

## 🔒 Step 6: Update Backend CORS

### 6.1 Add Your Vercel URL to Backend

**File:** `backend/server.js`

**Find this:**
```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
  "https://ecommerce-shopping-theta.vercel.app"
];
```

**Add your new URL:**
```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
  "https://ecommerce-shopping-theta.vercel.app",
  "https://your-project-name.vercel.app" // Add this line
];
```

### 6.2 Push to GitHub
```bash
cd backend
git add .
git commit -m "Add Vercel URL to CORS"
git push origin main
```

Render will automatically redeploy your backend!

---

## ✅ Step 7: Test Your Deployed Frontend

### Test 1: Open Your Site
```
https://your-project-name.vercel.app
```

### Test 2: Check Products Load
- Products should display
- Images should load from Cloudinary

### Test 3: Test Authentication
- Try signup
- Try login
- Check browser console for errors

### Test 4: Test Full Flow
- Browse products
- Add to cart
- Checkout
- View orders
- Add review

---

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to fetch" or CORS Error

**Cause:** Backend CORS not updated

**Solution:**
1. Add your Vercel URL to `allowedOrigins` in `backend/server.js`
2. Push to GitHub
3. Wait for Render to redeploy (2-3 minutes)
4. Clear browser cache and retry

### Issue 2: 404 on Page Refresh

**Cause:** Vercel needs routing configuration

**Solution:** Create `vercel.json` in frontend folder:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Then redeploy.

### Issue 3: Images Not Loading

**Cause:** Cloudinary URLs or API issue

**Solution:**
1. Check browser console for errors
2. Verify Cloudinary credentials in Render
3. Test image URLs directly in browser

### Issue 4: Backend Sleeping (Free Tier)

**Cause:** Render free tier sleeps after 15 min

**Solution:**
- First request takes 30-60 seconds
- This is normal for free tier
- Consider upgrading for always-on service

---

## 🔄 Step 8: Continuous Deployment

### Auto-Deploy on Git Push

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes to frontend
cd frontend
# ... make your changes ...

git add .
git commit -m "Update frontend"
git push origin main

# Vercel will automatically deploy
```

### View Deployments
1. Go to Vercel dashboard
2. Click on your project
3. See all deployments and their status

---

## 📊 Step 9: Custom Domain (Optional)

### Add Your Own Domain

1. Go to Vercel dashboard
2. Click on your project
3. Go to "Settings" → "Domains"
4. Click "Add"
5. Enter your domain
6. Follow DNS configuration instructions

---

## 🎨 Step 10: Vercel Configuration File

### Create vercel.json (Recommended)

**File:** `frontend/vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

This ensures:
- React Router works correctly
- Security headers are set
- All routes redirect to index.html

---

## 📋 Post-Deployment Checklist

### Frontend
- [ ] Deployed to Vercel
- [ ] Custom domain configured (optional)
- [ ] vercel.json created
- [ ] All pages load correctly
- [ ] No console errors

### Backend
- [ ] CORS updated with Vercel URL
- [ ] Backend redeployed
- [ ] API endpoints accessible

### Testing
- [ ] Homepage loads
- [ ] Products display
- [ ] Images load
- [ ] Login works
- [ ] Signup works
- [ ] Cart works
- [ ] Checkout works
- [ ] Orders work
- [ ] Reviews work
- [ ] Admin panel works

### Performance
- [ ] Images load fast (Cloudinary)
- [ ] API responses are quick
- [ ] No broken links
- [ ] Mobile responsive

---

## 🎯 Your Complete Setup

### URLs
- **Frontend:** `https://your-project-name.vercel.app`
- **Backend:** `https://ecommerce-shopping-k3bk.onrender.com`
- **Database:** MongoDB Atlas
- **Images:** Cloudinary

### Dashboards
- **Vercel:** https://vercel.com/dashboard
- **Render:** https://dashboard.render.com
- **MongoDB:** https://cloud.mongodb.com
- **Cloudinary:** https://cloudinary.com/console

---

## 💡 Vercel Features

### Analytics (Free)
- View page views
- Track performance
- Monitor errors

### Preview Deployments
- Every branch gets a preview URL
- Test before merging to main
- Share with team

### Environment Variables
- Set different values for production/preview
- Secure secret management
- Easy to update

---

## 🚀 Performance Tips

### 1. Enable Vercel Analytics
```bash
npm install @vercel/analytics
```

Add to `main.jsx`:
```javascript
import { Analytics } from '@vercel/analytics/react';

// In your App component
<Analytics />
```

### 2. Optimize Images
- Already using Cloudinary ✅
- Images are optimized automatically

### 3. Enable Caching
Vercel automatically caches static assets

---

## 🔐 Security Best Practices

### 1. Environment Variables
- Never commit secrets to Git
- Use Vercel environment variables
- Rotate secrets regularly

### 2. CORS Configuration
- Only allow specific origins
- Don't use wildcard (*) in production

### 3. HTTPS
- Vercel provides free SSL ✅
- All traffic is encrypted

---

## 📞 Need Help?

### Vercel Support
- Documentation: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions
- Support: support@vercel.com

### Check Logs
1. Go to Vercel dashboard
2. Click on your project
3. Click on a deployment
4. View build logs and runtime logs

---

## 🎉 Congratulations!

Your full-stack e-commerce application is now live!

### Share Your Site
- **Frontend:** `https://your-project-name.vercel.app`
- **Backend:** `https://ecommerce-shopping-k3bk.onrender.com`

### Next Steps
1. Test everything thoroughly
2. Share with friends/users
3. Monitor performance
4. Collect feedback
5. Keep improving!

---

Good luck! 🚀
