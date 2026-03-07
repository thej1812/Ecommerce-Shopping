# Force Vercel Redeploy - Fix Cached Build

## 🐛 Problem
Vercel is serving an old cached build with the wrong backend URL.

Console shows:
```
🔗 API URL: https://ecommerce-shopping-k3bk.onrender.com  ❌ OLD URL
```

Should show:
```
🔗 API URL: https://ecommerce-shopping-1-ud3h.onrender.com  ✅ NEW URL
```

---

## 🚀 Solution: Force Redeploy

### Option 1: Push to GitHub (Recommended)

```bash
cd frontend

# Make a small change to trigger rebuild
echo "# Updated $(date)" >> README.md

git add .
git commit -m "Force redeploy with new backend URL"
git push origin main
```

Wait 2-3 minutes for Vercel to redeploy.

---

### Option 2: Manual Redeploy in Vercel Dashboard

1. Go to: **https://vercel.com/dashboard**
2. Click on your project: **ecommerce-shopping-tdvj**
3. Click **"Deployments"** tab
4. Find the latest deployment
5. Click the **"..."** (three dots) menu
6. Click **"Redeploy"**
7. Check **"Use existing Build Cache"** = **OFF** (important!)
8. Click **"Redeploy"**

Wait 2-3 minutes.

---

### Option 3: Delete .vercel Cache and Redeploy

1. Go to Vercel dashboard
2. Project Settings → General
3. Scroll to "Build & Development Settings"
4. Click "Clear Build Cache"
5. Go back to Deployments
6. Redeploy latest deployment

---

## ✅ Verify the Fix

### Step 1: Wait for Deployment
Check Vercel dashboard for "Deployment Ready" status.

### Step 2: Hard Refresh Your Browser
- **Windows/Linux:** Ctrl + Shift + R
- **Mac:** Cmd + Shift + R
- **Or:** Open in Incognito/Private mode

### Step 3: Check Console
Open browser console (F12) and look for:
```
🔗 API URL: https://ecommerce-shopping-1-ud3h.onrender.com  ✅
📍 Environment: Production
🌐 Hostname: ecommerce-shopping-tdvj.vercel.app
```

### Step 4: Test Signup
Should work without CORS errors!

---

## 🔍 Debugging

### Check Current Deployment
1. Go to Vercel dashboard
2. Click on your project
3. Click "Deployments"
4. Look at the latest deployment
5. Check "Build Logs" for any errors

### Check Environment Variables
1. Go to Project Settings
2. Click "Environment Variables"
3. Verify `VITE_API_URL` is set to:
   ```
   https://ecommerce-shopping-1-ud3h.onrender.com
   ```
4. If not set or wrong, update it
5. Redeploy

---

## 📋 Complete Checklist

- [ ] Code updated in `frontend/src/utils/api.js`
- [ ] `.env.production` has correct URL
- [ ] Changes pushed to GitHub
- [ ] Vercel redeployed (check dashboard)
- [ ] Browser cache cleared (hard refresh)
- [ ] Console shows new backend URL
- [ ] Signup works without CORS errors

---

## ⏱️ Timeline

1. **Now:** Push to GitHub or manual redeploy
2. **+2 min:** Vercel builds and deploys
3. **+3 min:** Hard refresh browser
4. **+3 min:** Test - should work!

---

## 🎯 Expected Result

After successful redeploy:
```
Console Output:
🔗 API URL: https://ecommerce-shopping-1-ud3h.onrender.com
📍 Environment: Production
🌐 Hostname: ecommerce-shopping-tdvj.vercel.app

✅ No CORS errors
✅ Signup works
✅ Login works
✅ Products load
```

---

## 💡 Pro Tips

### Always Hard Refresh After Deployment
Browsers cache JavaScript files aggressively. Always do:
- Ctrl + Shift + R (hard refresh)
- Or test in incognito mode

### Check Deployment Status
Don't test until Vercel shows "Deployment Ready"

### Clear Browser Cache
If still seeing old version:
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

---

## 🚨 If Still Not Working

### 1. Check Vercel Build Logs
Look for errors during build process

### 2. Check Environment Variables
Make sure `VITE_API_URL` is set correctly

### 3. Try Different Browser
Test in a different browser or incognito mode

### 4. Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Try signup
4. Check the request URL
5. Should be: `https://ecommerce-shopping-1-ud3h.onrender.com/api/auth/signup`

---

## 📞 Quick Commands

### Push and Redeploy
```bash
cd frontend
git add .
git commit -m "Force redeploy"
git push origin main
```

### Check Vercel Status
```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Check deployments
vercel ls
```

---

Push to GitHub now and wait 3 minutes! 🚀
