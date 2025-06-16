# Vercel Deployment Script with Error Handling
param(
    [switch]$Production,
    [switch]$Preview,
    [string]$Branch = "main"
)

Write-Host "🚀 Starting Vercel Deployment..." -ForegroundColor Green

# Check if Vercel CLI is installed
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Pre-deployment checks
Write-Host "🔍 Running pre-deployment checks..." -ForegroundColor Yellow

# Check Node.js version
$nodeVersion = node --version
Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan

# Check if .env.local exists
if (!(Test-Path ".env.local")) {
    Write-Host "⚠️  Warning: .env.local not found. Make sure environment variables are set in Vercel dashboard." -ForegroundColor Yellow
}

# Run linting
Write-Host "🔧 Running linter..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Linting failed. Please fix errors before deploying." -ForegroundColor Red
    exit 1
}

# Run type checking
Write-Host "🔍 Running type check..." -ForegroundColor Yellow
npm run type-check
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Type checking failed. Please fix errors before deploying." -ForegroundColor Red
    exit 1
}

# Test build locally
Write-Host "🏗️  Testing build locally..." -ForegroundColor Yellow
npm run build:vercel
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Local build failed. Please fix errors before deploying." -ForegroundColor Red
    exit 1
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Green

if ($Production) {
    Write-Host "📦 Deploying to PRODUCTION..." -ForegroundColor Red
    vercel --prod --yes
} elseif ($Preview) {
    Write-Host "🔍 Deploying PREVIEW..." -ForegroundColor Yellow
    vercel --yes
} else {
    Write-Host "🔍 Deploying PREVIEW (default)..." -ForegroundColor Yellow
    vercel --yes
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Your app is now live!" -ForegroundColor Cyan
} else {
    Write-Host "❌ Deployment failed. Check the logs above for details." -ForegroundColor Red
    exit 1
}