# Deployment Documentation

## 🚀 Deployment Guide

### Frontend Deployment (Vercel)

#### Option 1: Root Directory Configuration (Recommended)
1. In Vercel dashboard → Settings → General → Build & Development Settings
2. Set **Root Directory** to `frontend`
3. Framework will auto-detect as Next.js
4. Deploy

#### Option 2: Using vercel.json (Current Setup)
The project includes `vercel.json` with proper configuration for monorepo setup.

### Backend Deployment Options

#### Option 1: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Option 2: Render
1. Connect GitHub repository
2. Select "Web Service"
3. Root Directory: `backend`
4. Build Command: `go build -o main`
5. Start Command: `./main`

#### Option 3: Google Cloud Run
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT-ID/tidysnips-backend backend/
gcloud run deploy --image gcr.io/PROJECT-ID/tidysnips-backend --platform managed
```

#### Option 4: Docker on any VPS
```bash
# Build backend image
docker build -t tidysnips-backend ./backend

# Run with environment variables
docker run -p 8080:8080 \
  -e PORT=8080 \
  -e GIN_MODE=release \
  -e ALLOWED_ORIGINS=https://tidy-snips.vercel.app \
  tidysnips-backend
```

### Environment Variables

#### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://tidysnips.onrender.com
```

#### Backend
```env
PORT=8080
GIN_MODE=release
ALLOWED_ORIGINS=https://tidy-snips.vercel.app
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=3600
LOG_LEVEL=info
```

### CORS Configuration
Update backend CORS settings in `config.go` to include your Vercel domain:
```go
AllowedOrigins: []string{
    "https://tidy-snips.vercel.app",
},
```

### Health Check Endpoints
- Frontend: `https://tidy-snips.vercel.app`
- Backend: `https://tidysnips.onrender.com/api/v1/health`

### SSL/TLS
Both Vercel and most backend platforms provide automatic HTTPS certificates.
