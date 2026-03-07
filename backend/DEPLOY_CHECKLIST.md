# Quick Deployment Checklist ✅

## Before Deployment

- [ ] Code is working locally
- [ ] `.env` file is in `.gitignore`
- [ ] All dependencies are in `package.json`
- [ ] MongoDB Atlas is set up and accessible
- [ ] Cloudinary credentials are valid
- [ ] Code is pushed to GitHub

## Render Setup

- [ ] Create Render account (https://render.com)
- [ ] Connect GitHub repository
- [ ] Create new Web Service
- [ ] Configure settings:
  - Name: `your-backend-name`
  - Runtime: Node
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Instance Type: Free

## Environment Variables (Add in Render)

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## After Deployment

- [ ] Check deployment logs (no errors)
- [ ] Test API endpoint: `https://your-app.onrender.com/api/products`
- [ ] Create admin account (use Render Shell: `npm run seed-admin`)
- [ ] Update frontend API URL
- [ ] Test all features:
  - [ ] Login/Signup
  - [ ] Product listing
  - [ ] Add to cart
  - [ ] Place order
  - [ ] Add review
  - [ ] Admin dashboard
  - [ ] Image upload

## MongoDB Atlas Network Access

- [ ] Go to MongoDB Atlas
- [ ] Network Access → Add IP Address
- [ ] Allow access from anywhere: `0.0.0.0/0`
- [ ] Save

## Frontend Update

Update `frontend/src/utils/api.js`:
```javascript
export const API_URL = import.meta.env.PROD 
  ? "https://your-backend.onrender.com"
  : "http://localhost:5000";
```

## Security (Important!)

- [ ] Regenerate JWT_SECRET
- [ ] Rotate MongoDB password
- [ ] Regenerate Cloudinary API credentials
- [ ] Update all secrets in Render

## Final Tests

- [ ] Login works
- [ ] Signup works
- [ ] Products load
- [ ] Images display
- [ ] Cart works
- [ ] Checkout works
- [ ] Orders work
- [ ] Reviews work
- [ ] Admin panel works

## 🎉 Done!

Your backend is live at: `https://your-app.onrender.com`
