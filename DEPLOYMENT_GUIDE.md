# 🚀 AI Agents Platform - Deployment Guide

This guide provides multiple deployment strategies with error-free configurations and best practices.

## 📋 Pre-Deployment Checklist

### ✅ Environment Setup
- [ ] Node.js 18+ installed
- [ ] All environment variables configured
- [ ] Database accessible from deployment environment
- [ ] API keys validated and working
- [ ] Domain/subdomain configured (if applicable)

### ✅ Code Quality
- [ ] All tests passing: `npm run test` (if tests exist)
- [ ] Linting passes: `npm run lint`
- [ ] Type checking passes: `npm run type-check`
- [ ] Local build successful: `npm run build`

### ✅ Database
- [ ] Database schema up to date: `npx prisma db push`
- [ ] Prisma client generated: `npx prisma generate`
- [ ] Database accessible from production environment

## 🎯 Deployment Options

### 1. 🔥 **Vercel (Recommended)**

#### Quick Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (first time)
vercel

# Deploy to production
vercel --prod
```

#### Using PowerShell Script
```powershell
# Preview deployment
.\deployment-configs\deploy-vercel.ps1 -Preview

# Production deployment
.\deployment-configs\deploy-vercel.ps1 -Production
```

#### Environment Variables (Vercel Dashboard)
```env
DATABASE_URL=your-database-url
DEEPSEEK_API_KEY=your-deepseek-key
GROQ_API_KEY=your-groq-key
FIGMA_ACCESS_TOKEN=your-figma-token
SESSION_SECRET=your-session-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

### 2. 🌐 **Netlify**

#### Deploy Configuration
```bash
# Build command
npm run build:netlify

# Publish directory
out
```

#### netlify.toml
```toml
[build]
  command = "npm run build:netlify"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

### 3. 🐳 **Docker Deployment**

#### Build and Run
```bash
# Build image
docker build -f deployment-configs/Dockerfile -t ai-agents-platform .

# Run container
docker run -p 3000:3000 --env-file .env.production ai-agents-platform
```

#### Docker Compose
```bash
# Start all services
docker-compose -f deployment-configs/docker-compose.yml up -d

# View logs
docker-compose -f deployment-configs/docker-compose.yml logs -f
```

### 4. ☁️ **AWS Deployment**

#### Using AWS Amplify
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

#### Using AWS ECS/Fargate
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com

docker build -f deployment-configs/Dockerfile -t ai-agents-platform .
docker tag ai-agents-platform:latest your-account.dkr.ecr.us-east-1.amazonaws.com/ai-agents-platform:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/ai-agents-platform:latest
```

## 🔧 Configuration Files

### Production Next.js Config
Use `deployment-configs/next.config.production.js` for production builds:

```bash
cp deployment-configs/next.config.production.js next.config.js
```

### Environment Variables
Copy and configure:
```bash
cp deployment-configs/.env.production.example .env.production
```

## 🏥 Health Monitoring

### Health Check Endpoints
- **General Health**: `GET /api/health`
- **Database Health**: `GET /api/health/db`

### Post-Deployment Validation
```bash
# Run health checks
node deployment-configs/health-check.js https://your-domain.com
```

## 🚨 Troubleshooting

### Common Issues & Solutions

#### 1. Build Failures
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma client
npx prisma generate
```

#### 2. Environment Variable Issues
- Ensure all required variables are set
- Check variable names (case-sensitive)
- Verify API keys are valid

#### 3. Database Connection Issues
```bash
# Test database connection
npx prisma db push --preview-feature
```

#### 4. Memory Issues
- Increase Node.js memory: `NODE_OPTIONS="--max-old-space-size=4096"`
- Use `npm ci` instead of `npm install`
- Enable swap on server

### Performance Optimization

#### 1. Bundle Analysis
```bash
# Analyze bundle size
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

#### 2. Image Optimization
- Use Next.js Image component
- Configure image domains in next.config.js
- Enable WebP/AVIF formats

#### 3. Caching Strategy
- Configure appropriate cache headers
- Use ISR (Incremental Static Regeneration)
- Implement service worker for offline support

## 📊 Monitoring & Analytics

### Recommended Tools
- **Vercel Analytics** (if using Vercel)
- **Google Analytics 4**
- **Sentry** for error tracking
- **LogRocket** for user session recording

### Setup Monitoring
```bash
# Install Sentry
npm install @sentry/nextjs

# Configure in next.config.js
const { withSentryConfig } = require('@sentry/nextjs');
```

## 🔐 Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] API rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] CORS properly configured

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancers
- Implement session storage (Redis)
- Database read replicas
- CDN for static assets

### Vertical Scaling
- Monitor memory usage
- Optimize database queries
- Implement caching layers
- Use connection pooling

## 🎯 Best Practices

1. **Always test locally before deploying**
2. **Use staging environment for testing**
3. **Implement proper error handling**
4. **Monitor application performance**
5. **Keep dependencies updated**
6. **Use semantic versioning**
7. **Implement proper logging**
8. **Regular security audits**

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review deployment logs
3. Test health endpoints
4. Verify environment variables
5. Check database connectivity

---

**Happy Deploying! 🚀**