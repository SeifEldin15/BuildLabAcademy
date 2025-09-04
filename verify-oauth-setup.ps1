# BuildLab Academy - Google OAuth Setup Verification
Write-Host "🔍 BuildLab Academy - Google OAuth Setup Verification" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check if environment variables are set
Write-Host "📋 Checking environment variables..." -ForegroundColor Yellow

if (Test-Path ".env.local") {
    Write-Host "✅ .env.local file exists" -ForegroundColor Green
    
    $envContent = Get-Content ".env.local" -Raw
    
    if ($envContent -match "GOOGLE_CLIENT_ID=your-google-client-id") {
        Write-Host "⚠️  GOOGLE_CLIENT_ID still has placeholder value" -ForegroundColor Yellow
        Write-Host "   Please update with your actual Google Client ID" -ForegroundColor Gray
    } else {
        Write-Host "✅ GOOGLE_CLIENT_ID appears to be set" -ForegroundColor Green
    }
    
    if ($envContent -match "GOOGLE_CLIENT_SECRET=your-google-client-secret") {
        Write-Host "⚠️  GOOGLE_CLIENT_SECRET still has placeholder value" -ForegroundColor Yellow
        Write-Host "   Please update with your actual Google Client Secret" -ForegroundColor Gray
    } else {
        Write-Host "✅ GOOGLE_CLIENT_SECRET appears to be set" -ForegroundColor Green
    }
} else {
    Write-Host "❌ .env.local file not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow

try {
    $nextAuthCheck = npm list next-auth 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ next-auth is installed" -ForegroundColor Green
    } else {
        Write-Host "❌ next-auth is not installed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ next-auth is not installed" -ForegroundColor Red
}

try {
    $adapterCheck = npm list @auth/pg-adapter 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ @auth/pg-adapter is installed" -ForegroundColor Green
    } else {
        Write-Host "❌ @auth/pg-adapter is not installed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ @auth/pg-adapter is not installed" -ForegroundColor Red
}

Write-Host ""
Write-Host "🗄️ Checking database..." -ForegroundColor Yellow

try {
    $dockerCheck = docker-compose ps 2>$null
    if ($dockerCheck -match "postgres") {
        Write-Host "✅ PostgreSQL container appears to be running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  PostgreSQL container not running" -ForegroundColor Yellow
        Write-Host "   Run: docker-compose up -d" -ForegroundColor Gray
    }
} catch {
    Write-Host "⚠️  Could not check Docker status. Make sure Docker Desktop is running" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📁 Checking file structure..." -ForegroundColor Yellow

$files = @(
    "src/app/api/auth/[...nextauth]/route.ts",
    "src/components/Providers.tsx",
    "src/app/dashboard/page.tsx",
    "database/schema.sql"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "❌ $file is missing" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "1. Get Google OAuth credentials from Google Cloud Console" -ForegroundColor White
Write-Host "2. Update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local" -ForegroundColor White
Write-Host "3. Start Docker Desktop and run: docker-compose up -d" -ForegroundColor White
Write-Host "4. Run: npm run dev" -ForegroundColor White
Write-Host "5. Test Google OAuth at: http://localhost:3000/login" -ForegroundColor White
Write-Host ""
Write-Host "📚 For detailed instructions, see: GOOGLE_OAUTH_SETUP.md" -ForegroundColor Cyan
