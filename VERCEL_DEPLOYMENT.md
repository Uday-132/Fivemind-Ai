# 🚀 Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free tier is sufficient)
- Your project code ready

## Step 1: Push to GitHub

1. **Initialize Git repository** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - AI Agents Platform"
```

2. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Name it something like `ai-agents-platform`
   - Don't initialize with README (since you already have code)

3. **Push your code**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-agents-platform.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure the project**:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel --prod
```

## Step 3: Configure Environment Variables

In your Vercel dashboard:

1. **Go to your project** → **Settings** → **Environment Variables**

2. **Add these variables** (only add the ones you have):

### Required (for basic functionality):
```
DATABASE_URL=file:./dev.db
SESSION_SECRET=your_super_secret_session_key_here_make_it_long_and_random
JWT_SECRET=your_jwt_secret_key_here_also_make_it_long_and_random
NEXTAUTH_URL=https://your-app-name.vercel.app
```

### Optional (for enhanced features):
```
OPENAI_API_KEY=your_openai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
HUGGING_FACE_API_KEY=your_huggingface_api_key_here
DEEPAI_API_KEY=your_deepai_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
FIGMA_ACCESS_TOKEN=your_figma_token_here
YOUTUBE_API_KEY=your_youtube_api_key_here
```

## Step 4: Database Setup for Production

### Option A: Use Vercel Postgres (Recommended)
1. In Vercel dashboard → **Storage** → **Create Database**
2. Choose **Postgres**
3. Copy the connection string to `DATABASE_URL`

### Option B: Use Supabase (Free)
1. Go to https://supabase.com
2. Create new project
3. Go to **Settings** → **Database**
4. Copy connection string to `DATABASE_URL`

### Option C: Use PlanetScale (Free tier available)
1. Go to https://planetscale.com
2. Create database
3. Get connection string

## Step 5: Update Database URL

Update your `DATABASE_URL` in Vercel environment variables:
```
DATABASE_URL=postgresql://username:password@host:port/database
```

## Step 6: Deploy Database Schema

After setting up the database:

1. **Update your local `.env`** with the production database URL
2. **Push the schema**:
```bash
npx prisma db push
```

## Step 7: Final Deployment

1. **Redeploy** your application in Vercel dashboard
2. **Test all features**:
   - Image generation (should work with free Pollinations.AI)
   - User authentication
   - All agent functionalities

## 🎉 Your App is Live!

Your AI Agents Platform will be available at:
`https://your-app-name.vercel.app`

## Troubleshooting

### Common Issues:

1. **Build Errors**:
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`

2. **Environment Variables**:
   - Make sure all required env vars are set
   - Redeploy after adding new env vars

3. **Database Connection**:
   - Verify `DATABASE_URL` is correct
   - Run `npx prisma db push` with production URL

4. **API Routes Not Working**:
   - Check function logs in Vercel dashboard
   - Ensure API routes are in `app/api/` directory

## Performance Tips

1. **Enable Edge Runtime** for faster API responses:
```typescript
export const runtime = 'edge'
```

2. **Optimize Images**:
   - Use Next.js Image component
   - Enable image optimization in `next.config.js`

3. **Use Vercel Analytics**:
   - Add `@vercel/analytics` package
   - Enable in Vercel dashboard

## Security Checklist

- ✅ All API keys are in environment variables
- ✅ No sensitive data in code
- ✅ CORS headers configured
- ✅ Rate limiting implemented (if needed)
- ✅ Input validation on all API routes

## Free Tier Limits

Vercel Free Tier includes:
- ✅ Unlimited personal projects
- ✅ 100GB bandwidth per month
- ✅ 100 serverless function executions per day
- ✅ Custom domains
- ✅ SSL certificates

Perfect for your AI Agents Platform! 🚀