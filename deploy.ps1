# PowerShell deployment script for Vercel
Write-Host "🚀 AI Agents Platform - Vercel Deployment Script" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit - AI Agents Platform"
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "📁 Git repository already exists" -ForegroundColor Green
}

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
}

# Build the project locally to check for errors
Write-Host "🔨 Building project locally..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Local build successful" -ForegroundColor Green
    
    # Deploy to Vercel
    Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
    vercel --prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🎉 Deployment successful!" -ForegroundColor Green
        Write-Host "📋 Next steps:" -ForegroundColor Cyan
        Write-Host "1. Set up environment variables in Vercel dashboard" -ForegroundColor White
        Write-Host "2. Configure your database (if using external DB)" -ForegroundColor White
        Write-Host "3. Test your deployed application" -ForegroundColor White
    } else {
        Write-Host "❌ Deployment failed. Check the logs above." -ForegroundColor Red
    }
} else {
    Write-Host "❌ Local build failed. Fix the errors before deploying." -ForegroundColor Red
}

Write-Host "=================================================" -ForegroundColor Cyan