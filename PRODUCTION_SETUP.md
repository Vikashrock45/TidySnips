# 🚀 Production Deployment Configuration

## Live Endpoints
- **Frontend**: https://tidy-snips.vercel.app
- **Backend**: https://tidysnips.onrender.com

## 🔧 Vercel Environment Variables Setup

To connect your frontend to the backend, you need to set environment variables in Vercel:

### Step 1: Go to Vercel Dashboard
1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your `tidy-snips` project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Environment Variables
Add the following environment variable:

```
Name: NEXT_PUBLIC_API_URL
Value: https://tidysnips.onrender.com
Environment: Production, Preview, Development
```

### Step 3: Redeploy
After adding the environment variable:
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Select **Redeploy**
4. Choose **Use existing Build Cache** for faster deployment

## 🔒 Backend CORS Configuration

Your backend needs to allow requests from your Vercel frontend. Make sure your Render deployment has these environment variables:

```env
ALLOWED_ORIGINS=https://tidy-snips.vercel.app
PORT=8080
GO_ENV=production
GIN_MODE=release
```

## 🧪 Testing the Connection

Once both are deployed and configured:

### Test Backend Health
```bash
curl https://tidysnips.onrender.com/api/v1/health
```

### Test Frontend API Call
Visit https://tidy-snips.vercel.app and try formatting some code. The browser network tab should show requests going to `tidysnips.onrender.com`.

### Test CORS
```bash
curl -H "Origin: https://tidy-snips.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://tidysnips.onrender.com/api/v1/format
```

## 🚨 Troubleshooting

### Frontend showing "Connection Error"
1. Check if `NEXT_PUBLIC_API_URL` is set in Vercel
2. Verify the backend URL is accessible
3. Check browser console for CORS errors

### CORS Errors
1. Verify `ALLOWED_ORIGINS` in backend includes your Vercel domain
2. Check that backend is running with production environment
3. Ensure all required headers are allowed

### Backend Not Responding
1. Check Render logs for your backend service
2. Verify environment variables are set correctly
3. Test health endpoint directly

## 📊 Monitoring

### Vercel Analytics
- Enable Web Analytics in Vercel dashboard
- Monitor page load times and user interactions

### Render Metrics
- Check CPU and memory usage in Render dashboard
- Monitor response times and error rates

### Health Checks
Set up monitoring for:
- Frontend: https://tidy-snips.vercel.app
- Backend: https://tidysnips.onrender.com/api/v1/health

## 🔄 Deployment Pipeline

### Frontend (Automatic)
- Push to GitHub main branch
- Vercel automatically rebuilds and deploys
- Environment variables are preserved

### Backend (Manual on Render Free Tier)
- Push to GitHub main branch
- Render automatically rebuilds and deploys
- Monitor deployment logs for any issues

## 📈 Performance Optimization

### Frontend (Vercel)
- Automatic CDN and edge caching
- Image optimization enabled
- Gzip compression enabled

### Backend (Render)
- Use production build optimizations
- Enable HTTP/2 
- Monitor cold start times (free tier limitation)

Your TidySnips application is now fully production-ready! 🎉
