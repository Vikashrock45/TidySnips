# 🎯 TidySnips

<div align="center">

**Enterprise-Grade Code Formatting & Minification Platform**

[![Production Ready](https://img.shields.io/badge/Production-Ready-brightgreen.svg)](https://github.com)
[![Docker](https://img.shields.io/badge/Docker-Supported-blue.svg)](https://docker.com)
[![Go](https://img.shields.io/badge/Go-1.21-00ADD8.svg)](https://golang.org)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-000000.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6.svg)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

*Professional code formatting and minification service with modern web interface*

[Features](#-features) • [Quick Start](#-quick-start) • [API Documentation](#-api-documentation) • [Deployment](#-deployment) • [Architecture](#-architecture)

</div>

---

## 🚀 Overview

TidySnips is a production-ready, full-stack code formatting and minification platform designed for enterprise environments. Built with Go backend and Next.js frontend, it provides secure, scalable, and high-performance code processing capabilities.

### ✨ Key Highlights

- 🔒 **Enterprise Security**: Rate limiting, input validation, CORS protection
- 🏗️ **Production Architecture**: Microservices, graceful shutdown, health checks
- 🐳 **Container Ready**: Docker optimized with multi-stage builds
- ⚡ **High Performance**: Go backend, optimized Next.js frontend
- 🎨 **Modern UI**: Responsive design with professional interface
- 📊 **Monitoring Ready**: Structured logging, health endpoints

---

## 🎯 Features

### 🔧 Code Processing
- **Multi-Language Support**: Go, JSON, PHP, JavaScript
- **Format & Minify**: Professional code formatting and minification
- **Input Validation**: Comprehensive security checks
- **Error Handling**: Detailed error reporting with suggestions

### 🛡️ Security & Performance
- **Rate Limiting**: Token bucket algorithm (configurable)
- **Request Validation**: Size limits, content-type verification
- **Suspicious Code Detection**: Pattern-based security scanning
- **CORS Protection**: Configurable cross-origin policies

### 🎨 User Experience
- **Responsive Design**: Mobile-first, professional interface
- **Real-time Processing**: Instant formatting feedback
- **Collapsible JSON Viewer**: Interactive JSON exploration
- **Syntax Highlighting**: Prism.js powered code display

### 🏭 Enterprise Features
- **Health Monitoring**: Comprehensive health check endpoints
- **Configuration Management**: Environment-based settings
- **Graceful Shutdown**: Production-ready lifecycle management
- **Structured Logging**: JSON/Text logging formats

---

## 🚀 Quick Start

### Prerequisites
- **Docker & Docker Compose** (recommended)
- **Go 1.21+** (for local development)
- **Node.js 20+** (for local development)

### 🐳 Docker Deployment (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd TidySnips

# Start the full stack
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# Health Check: http://localhost:8080/api/v1/health
```

### 💻 Local Development

#### Backend Setup
```bash
cd backend

# Copy environment configuration
cp .env.example .env.development

# Install dependencies and run
go mod tidy
go run .

# Backend runs on http://localhost:8080
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend runs on http://localhost:3000
```

---

## 📚 API Documentation

### Base URL
```
Production: https://your-domain.com/api/v1
Development: http://localhost:8080/api/v1
```

### Endpoints

#### 🔍 Health Check
```http
GET /api/v1/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-17T23:49:46+05:30",
  "environment": "production",
  "version": "1.0.0"
}
```

#### 🎨 Format Code
```http
POST /api/v1/format
Content-Type: application/json
```

**Request:**
```json
{
  "code": "function hello(){console.log('world');}",
  "language": "JavaScript"
}
```

**Response:**
```json
{
  "success": true,
  "code": "function hello() {\n    console.log('world');\n}",
  "timestamp": "2025-08-17T23:49:46+05:30"
}
```

#### 🗜️ Minify Code
```http
POST /api/v1/minify
Content-Type: application/json
```

**Request:**
```json
{
  "code": "function hello() {\n    console.log('world');\n}",
  "language": "JavaScript"
}
```

**Response:**
```json
{
  "success": true,
  "code": "function hello(){console.log('world');}",
  "timestamp": "2025-08-17T23:49:46+05:30"
}
```

### Supported Languages
- **Go**: Professional Go code formatting
- **JSON**: Format and minify JSON data
- **PHP**: Basic PHP code formatting
- **JavaScript**: Format and minify JavaScript code

### Error Handling
```json
{
  "success": false,
  "error": "Code field is required",
  "timestamp": "2025-08-17T23:49:46+05:30"
}
```

---

## 🏗️ Architecture

### System Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│   Load Balancer │────│    Backend      │
│   Next.js       │    │   (Optional)    │    │    Go API       │
│   TypeScript    │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### 🎯 Backend (Go)
- **Framework**: Go 1.21 + Standard Library
- **Architecture**: Clean Architecture with separation of concerns
- **Security**: Rate limiting, input validation, CORS
- **Deployment**: Docker multi-stage builds

#### ⚛️ Frontend (Next.js)
- **Framework**: Next.js 15.4.6 + React 19.1.0
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS + Custom components
- **Build**: Static generation with optimization

#### 🐳 Infrastructure
- **Containerization**: Docker with Alpine Linux
- **Orchestration**: Docker Compose
- **Networking**: Internal container network
- **Security**: Non-root containers, health checks

---

## 🚀 Deployment

### 🌐 Production Deployment

#### Environment Configuration
```bash
# Backend (.env.production)
PORT=8080
GO_ENV=production
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60
MAX_REQUEST_SIZE=1048576
ALLOWED_ORIGINS=https://yourdomain.com
ENABLE_RATE_LIMITING=true
ENABLE_LOGGING=true
LOG_LEVEL=info
LOG_FORMAT=json
```

#### Cloud Platforms

**AWS (ECS/EKS)**
```bash
# Build and push to ECR
docker build -t your-ecr-repo/tidysnips-backend ./backend
docker build -t your-ecr-repo/tidysnips-frontend ./frontend
docker push your-ecr-repo/tidysnips-backend
docker push your-ecr-repo/tidysnips-frontend
```

**Google Cloud (Cloud Run)**
```bash
# Deploy to Cloud Run
gcloud run deploy tidysnips-backend --image gcr.io/project/tidysnips-backend
gcloud run deploy tidysnips-frontend --image gcr.io/project/tidysnips-frontend
```

**Kubernetes**
```yaml
# k8s deployment example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tidysnips-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: tidysnips-backend
  template:
    metadata:
      labels:
        app: tidysnips-backend
    spec:
      containers:
      - name: backend
        image: tidysnips-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: GO_ENV
          value: "production"
```

### 🔧 Scaling Considerations

#### Horizontal Scaling
- **Stateless Design**: No server-side state
- **Load Balancer Ready**: Multiple instance support
- **Database-Free**: No database dependencies

#### Performance Optimization
- **Go Binary**: Compiled performance
- **Static Assets**: CDN-ready frontend
- **Caching**: HTTP caching headers
- **Compression**: Gzip/Brotli support

---

## 🔧 Configuration

### Backend Configuration
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | Server port |
| `GO_ENV` | `development` | Environment mode |
| `RATE_LIMIT_REQUESTS` | `100` | Requests per minute |
| `MAX_REQUEST_SIZE` | `1048576` | Max request size (bytes) |
| `ALLOWED_ORIGINS` | `*` | CORS allowed origins |
| `LOG_LEVEL` | `info` | Logging level |
| `LOG_FORMAT` | `text` | Log format (text/json) |

### Frontend Configuration
| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | Backend API URL |
| `NODE_ENV` | `development` | Node environment |

---

## 🧪 Testing

### Backend Testing
```bash
cd backend

# Run tests
go test ./...

# Run tests with coverage
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

### Frontend Testing
```bash
cd frontend

# Lint code
npm run lint

# Type checking
npx tsc --noEmit

# Build verification
npm run build
```

### API Testing
```bash
# Health check
curl -X GET http://localhost:8080/api/v1/health

# Format code
curl -X POST http://localhost:8080/api/v1/format \
  -H "Content-Type: application/json" \
  -d '{"code": "function test(){}", "language": "JavaScript"}'
```

---

## 📊 Monitoring & Observability

### Health Checks
- **Endpoint**: `/api/v1/health`
- **Docker**: Built-in container health checks
- **Kubernetes**: Readiness and liveness probes

### Logging
- **Structured Logging**: JSON format for production
- **Request Logging**: Method, path, status, duration, IP
- **Error Logging**: Detailed error information

### Metrics (Future Enhancement)
- **Prometheus**: Metrics endpoint
- **Grafana**: Dashboard templates
- **Performance**: Request duration, error rates

---

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- **Go**: Follow `gofmt` and `golint` standards
- **TypeScript**: ESLint + Prettier configuration
- **Documentation**: Update README for new features
- **Testing**: Add tests for new functionality

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

### Documentation
- **API Docs**: See API Documentation section above
- **Architecture**: See Architecture section above
- **Deployment**: See Deployment section above

### Community
- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **Security**: See SECURITY.md for reporting vulnerabilities

---

<div align="center">

**Made with ❤️ for the developer community**

*TidySnips - Making code beautiful, one snippet at a time*

</div>