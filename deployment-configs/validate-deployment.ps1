# Deployment Validation Script
param(
    [Parameter(Mandatory=$true)]
    [string]$Url,
    [int]$Timeout = 30
)

Write-Host "🔍 Validating deployment at: $Url" -ForegroundColor Green

$errors = @()
$warnings = @()

# Function to make HTTP request with error handling
function Test-Endpoint {
    param($endpoint, $expectedStatus = 200)
    
    try {
        $response = Invoke-WebRequest -Uri "$Url$endpoint" -TimeoutSec $Timeout -UseBasicParsing
        if ($response.StatusCode -eq $expectedStatus) {
            Write-Host "✅ $endpoint - Status: $($response.StatusCode)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "⚠️  $endpoint - Unexpected status: $($response.StatusCode)" -ForegroundColor Yellow
            $script:warnings += "$endpoint returned status $($response.StatusCode)"
            return $false
        }
    } catch {
        Write-Host "❌ $endpoint - Error: $($_.Exception.Message)" -ForegroundColor Red
        $script:errors += "$endpoint failed: $($_.Exception.Message)"
        return $false
    }
}

# Function to check response time
function Test-ResponseTime {
    param($endpoint, $maxTime = 5000)
    
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    try {
        Invoke-WebRequest -Uri "$Url$endpoint" -TimeoutSec $Timeout -UseBasicParsing | Out-Null
        $stopwatch.Stop()
        $responseTime = $stopwatch.ElapsedMilliseconds
        
        if ($responseTime -le $maxTime) {
            Write-Host "⚡ $endpoint - Response time: ${responseTime}ms" -ForegroundColor Green
        } else {
            Write-Host "🐌 $endpoint - Slow response: ${responseTime}ms" -ForegroundColor Yellow
            $script:warnings += "$endpoint is slow (${responseTime}ms)"
        }
    } catch {
        $stopwatch.Stop()
        Write-Host "❌ $endpoint - Failed to measure response time" -ForegroundColor Red
        $script:errors += "$endpoint response time check failed"
    }
}

Write-Host "`n🏥 Running Health Checks..." -ForegroundColor Cyan

# Basic connectivity
Write-Host "`n1. Testing basic connectivity..." -ForegroundColor Yellow
Test-Endpoint "/" 200

# Health endpoints
Write-Host "`n2. Testing health endpoints..." -ForegroundColor Yellow
Test-Endpoint "/api/health" 200
Test-Endpoint "/api/health/db" 200

# Essential pages
Write-Host "`n3. Testing essential pages..." -ForegroundColor Yellow
Test-Endpoint "/agents" 200
Test-Endpoint "/profile" 200

# API endpoints (basic test)
Write-Host "`n4. Testing API availability..." -ForegroundColor Yellow
# Note: These might return 400/405 for GET requests, which is expected
$apiEndpoints = @("/api/agents/coding", "/api/agents/design", "/api/agents/image", "/api/agents/movie", "/api/agents/research")
foreach ($endpoint in $apiEndpoints) {
    try {
        $response = Invoke-WebRequest -Uri "$Url$endpoint" -TimeoutSec $Timeout -UseBasicParsing
        Write-Host "✅ $endpoint - Available (Status: $($response.StatusCode))" -ForegroundColor Green
    } catch {
        if ($_.Exception.Response.StatusCode -eq 405 -or $_.Exception.Response.StatusCode -eq 400) {
            Write-Host "✅ $endpoint - Available (Method not allowed - expected)" -ForegroundColor Green
        } else {
            Write-Host "❌ $endpoint - Error: $($_.Exception.Message)" -ForegroundColor Red
            $errors += "$endpoint failed: $($_.Exception.Message)"
        }
    }
}

# Performance tests
Write-Host "`n5. Testing response times..." -ForegroundColor Yellow
Test-ResponseTime "/" 3000
Test-ResponseTime "/api/health" 2000

# Security headers check
Write-Host "`n6. Checking security headers..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $Url -TimeoutSec $Timeout -UseBasicParsing
    $headers = $response.Headers
    
    $securityHeaders = @{
        "X-Frame-Options" = "Security header for clickjacking protection"
        "X-Content-Type-Options" = "MIME type sniffing protection"
        "Referrer-Policy" = "Referrer policy header"
    }
    
    foreach ($header in $securityHeaders.Keys) {
        if ($headers.ContainsKey($header)) {
            Write-Host "✅ $header present" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $header missing" -ForegroundColor Yellow
            $warnings += "Security header $header is missing"
        }
    }
} catch {
    Write-Host "❌ Failed to check security headers" -ForegroundColor Red
    $errors += "Security headers check failed"
}

# SSL/TLS check (if HTTPS)
if ($Url.StartsWith("https://")) {
    Write-Host "`n7. Checking SSL/TLS..." -ForegroundColor Yellow
    try {
        $uri = [System.Uri]$Url
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $tcpClient.Connect($uri.Host, 443)
        $sslStream = New-Object System.Net.Security.SslStream($tcpClient.GetStream())
        $sslStream.AuthenticateAsClient($uri.Host)
        
        $cert = $sslStream.RemoteCertificate
        $expiryDate = [DateTime]::Parse($cert.GetExpirationDateString())
        $daysUntilExpiry = ($expiryDate - (Get-Date)).Days
        
        if ($daysUntilExpiry -gt 30) {
            Write-Host "✅ SSL certificate valid (expires in $daysUntilExpiry days)" -ForegroundColor Green
        } elseif ($daysUntilExpiry -gt 0) {
            Write-Host "⚠️  SSL certificate expires soon ($daysUntilExpiry days)" -ForegroundColor Yellow
            $warnings += "SSL certificate expires in $daysUntilExpiry days"
        } else {
            Write-Host "❌ SSL certificate expired" -ForegroundColor Red
            $errors += "SSL certificate has expired"
        }
        
        $sslStream.Close()
        $tcpClient.Close()
    } catch {
        Write-Host "⚠️  Could not verify SSL certificate: $($_.Exception.Message)" -ForegroundColor Yellow
        $warnings += "SSL certificate verification failed"
    }
}

# Summary
Write-Host "`n📊 Validation Summary" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "🎉 All checks passed! Deployment is healthy." -ForegroundColor Green
    exit 0
} elseif ($errors.Count -eq 0) {
    Write-Host "✅ Deployment is functional with $($warnings.Count) warning(s):" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "  ⚠️  $warning" -ForegroundColor Yellow
    }
    exit 0
} else {
    Write-Host "❌ Deployment has $($errors.Count) error(s) and $($warnings.Count) warning(s):" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "  ❌ $error" -ForegroundColor Red
    }
    foreach ($warning in $warnings) {
        Write-Host "  ⚠️  $warning" -ForegroundColor Yellow
    }
    exit 1
}