# Test Backend Connection

## Your Backend URL
```
https://ecommerce-shopping-k3bk.onrender.com
```

## Quick Tests

### Test 1: Check if Backend is Running
Open this URL in your browser:
```
https://ecommerce-shopping-k3bk.onrender.com/api/products
```

**Expected Result:** JSON array of products

---

### Test 2: Check Categories
```
https://ecommerce-shopping-k3bk.onrender.com/api/categories
```

**Expected Result:** JSON array of categories

---

### Test 3: Test from Frontend (Local Development)

1. Start your frontend:
```bash
cd frontend
npm run dev
```

2. Open: `http://localhost:5173`

3. Check browser console for any errors

4. Try:
   - View products
   - Login/Signup
   - Add to cart

---

## ⚠️ Important Notes

### Free Tier Sleep Mode
- Render free tier sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- This is normal behavior

### If Backend is Sleeping:
1. Open: `https://ecommerce-shopping-k3bk.onrender.com/api/products`
2. Wait 30-60 seconds
3. Refresh the page
4. Backend should wake up and respond

---

## 🔧 Current Configuration

### Frontend API URL (Updated)
**File:** `frontend/src/utils/api.js`

```javascript
export const API_URL = import.meta.env.PROD 
  ? "https://ecommerce-shopping-k3bk.onrender.com"
  : "http://localhost:5000";
```

**What this means:**
- **Development (npm run dev):** Uses `http://localhost:5000`
- **Production (deployed):** Uses `https://ecommerce-shopping-k3bk.onrender.com`

---

## 🚀 Next Steps

### 1. Test Backend (Do this now!)
```
https://ecommerce-shopping-k3bk.onrender.com/api/products
```

### 2. Create Admin Account
You need to create an admin account on the deployed backend.

**Option A: Using Render Shell**
1. Go to: https://dashboard.render.com
2. Click on your service: `ecommerce-shopping-k3bk`
3. Click "Shell" tab
4. Run: `npm run seed-admin`

**Option B: Using MongoDB Compass**
1. Connect to your MongoDB Atlas
2. Go to `users` collection
3. Insert admin document manually

**Default Admin Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

### 3. Update CORS (If you deploy frontend)
When you deploy your frontend to Vercel, add the URL to backend CORS:

**File:** `backend/server.js`
```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
  "https://ecommerce-shopping-theta.vercel.app",
  "https://your-new-frontend.vercel.app" // Add your new URL here
];
```

Then push to GitHub (Render will auto-deploy).

### 4. Deploy Frontend to Vercel
1. Go to: https://vercel.com
2. Import your frontend repository
3. Deploy
4. Get your frontend URL
5. Update CORS in backend (step 3)

---

## ✅ Verification Checklist

- [ ] Backend responds at: `https://ecommerce-shopping-k3bk.onrender.com/api/products`
- [ ] Products API returns JSON data
- [ ] Categories API returns JSON data
- [ ] Admin account created
- [ ] Frontend connects to backend (local dev)
- [ ] Login works
- [ ] Signup works
- [ ] Products display
- [ ] Images load
- [ ] Cart works
- [ ] Checkout works

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch" or "Network Error"
**Possible Causes:**
1. Backend is sleeping (wait 60 seconds and retry)
2. CORS error (check browser console)
3. Backend is down (check Render dashboard)

**Solution:**
1. Open backend URL in browser to wake it up
2. Check Render logs for errors
3. Verify CORS settings

### Issue: "CORS Error"
**Solution:**
Add your frontend URL to `allowedOrigins` in `backend/server.js`

### Issue: Images not loading
**Solution:**
1. Check Cloudinary credentials in Render environment variables
2. Verify images exist in Cloudinary dashboard
3. Check browser console for errors

---

## 📊 Monitor Your Backend

### Render Dashboard
https://dashboard.render.com

**Check:**
- Deployment status
- Logs
- Metrics (CPU, Memory)
- Environment variables

### MongoDB Atlas
https://cloud.mongodb.com

**Check:**
- Database connection
- Collections (users, products, orders, reviews)
- Network access (should allow 0.0.0.0/0)

### Cloudinary
https://cloudinary.com/console

**Check:**
- Image uploads
- Storage usage
- API usage

---

## 🎉 Success Indicators

✅ Backend URL responds with JSON
✅ No CORS errors in browser console
✅ Products load on frontend
✅ Images display correctly
✅ Login/Signup works
✅ Cart functionality works
✅ Orders can be placed
✅ Admin panel accessible

---

## 📞 Need Help?

1. Check Render logs
2. Check browser console
3. Test API with Postman
4. Verify environment variables
5. Check MongoDB connection

---

Good luck! 🚀
