# Lifestyle Habit Tracker - Deployment Guide

This guide covers how to deploy both the frontend (React Native Web) and backend (Node.js + Express + MongoDB) to production.

## Prerequisites

- Node.js 18+ installed locally
- Git repository with your code
- MongoDB Atlas account (for cloud database)

## Backend Deployment

### Option 1: Deploy to Render

1. **Create a MongoDB Atlas Database**
   ```
   - Go to https://cloud.mongodb.com
   - Create a new cluster
   - Get your connection string
   ```

2. **Deploy to Render**
   ```
   - Go to https://render.com
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Set the following:
     - Name: habit-tracker-api
     - Root Directory: backend
     - Build Command: npm install
     - Start Command: npm start
   ```

3. **Set Environment Variables in Render**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/habit-tracker
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_random
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., https://habit-tracker-api.onrender.com)

### Option 2: Deploy to Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy**
   ```bash
   cd backend
   railway login
   railway new
   railway up
   ```

3. **Set Environment Variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/habit-tracker
   railway variables set JWT_SECRET=your_super_secret_jwt_key_here
   railway variables set FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

## Frontend Deployment

### Update API Configuration

1. **Update the API base URL in `src/services/api.js`**
   ```javascript
   const API_BASE_URL = __DEV__ 
     ? (Platform.OS === 'web' ? 'http://localhost:5000' : 'http://10.0.2.2:5000')
     : 'https://your-backend-url.onrender.com'; // Update this line
   ```

### Option 1: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Build and Deploy**
   ```bash
   # Build the web version
   npm run build:web
   
   # Deploy to Vercel
   vercel --prod
   ```

3. **Or Deploy via Git Integration**
   ```
   - Go to https://vercel.com
   - Import your GitHub repository
   - Set build command: expo export:web
   - Set output directory: web-build
   - Deploy
   ```

### Option 2: Deploy to Netlify

1. **Build the Project**
   ```bash
   npm run build:web
   ```

2. **Deploy via Drag & Drop**
   ```
   - Go to https://netlify.com
   - Drag and drop your web-build folder
   ```

3. **Or Deploy via Git Integration**
   ```
   - Go to https://netlify.com
   - Import your GitHub repository
   - Set build command: expo export:web
   - Set publish directory: web-build
   - Deploy
   ```

## Database Setup (MongoDB Atlas)

1. **Create Database**
   ```
   - Go to https://cloud.mongodb.com
   - Create account and new project
   - Create a cluster (free tier is fine)
   - Create database user with readWrite permissions
   - Whitelist your IP (or 0.0.0.0/0 for all IPs in production)
   ```

2. **Get Connection String**
   ```
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace <username>, <password>, and <dbname>
   ```

## Environment Variables Summary

### Backend Environment Variables
```
NODE_ENV=production
PORT=10000 (for Render) or auto-assigned (for Railway)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/habit-tracker
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_random
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Frontend Environment Variables
- Update `API_BASE_URL` in `src/services/api.js` with your backend URL

## Testing the Deployment

1. **Test Backend API**
   ```bash
   curl https://your-backend-url.onrender.com/health
   ```

2. **Test Frontend**
   ```
   - Visit your frontend URL
   - Try signing up with a new account
   - Create a habit and toggle completion
   - Verify data persists after refresh
   ```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure FRONTEND_URL environment variable is set correctly in backend
   - Check that your frontend URL matches exactly

2. **Database Connection Errors**
   - Verify MONGODB_URI is correct
   - Check that database user has proper permissions
   - Ensure IP whitelist includes your deployment platform

3. **JWT Errors**
   - Ensure JWT_SECRET is set and is a long, random string
   - Check that token is being sent properly from frontend

4. **Build Errors**
   - Ensure all dependencies are installed
   - Check Node.js version compatibility
   - Clear cache and reinstall dependencies if needed

## Monitoring and Maintenance

1. **Monitor Logs**
   - Render: Check application logs in dashboard
   - Railway: Use `railway logs` command
   - Netlify/Vercel: Check function logs in dashboard

2. **Database Monitoring**
   - Monitor MongoDB Atlas metrics
   - Set up alerts for connection issues

3. **Regular Updates**
   - Keep dependencies updated
   - Monitor security vulnerabilities
   - Regular backups of database

## Custom Domain (Optional)

1. **For Vercel/Netlify Frontend**
   ```
   - Add custom domain in dashboard
   - Update DNS records
   - SSL certificate is automatically provided
   ```

2. **For Render/Railway Backend**
   ```
   - Add custom domain in dashboard  
   - Update DNS records
   - Update CORS settings with new domain
   ```

Your habit tracker application is now deployed and ready for production use!