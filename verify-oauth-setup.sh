#!/bin/bash

echo "🔍 BuildLab Academy - Google OAuth Setup Verification"
echo "=================================================="

# Check if environment variables are set
echo "📋 Checking environment variables..."

if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
    
    if grep -q "GOOGLE_CLIENT_ID=your-google-client-id" .env.local; then
        echo "⚠️  GOOGLE_CLIENT_ID still has placeholder value"
        echo "   Please update with your actual Google Client ID"
    else
        echo "✅ GOOGLE_CLIENT_ID appears to be set"
    fi
    
    if grep -q "GOOGLE_CLIENT_SECRET=your-google-client-secret" .env.local; then
        echo "⚠️  GOOGLE_CLIENT_SECRET still has placeholder value"
        echo "   Please update with your actual Google Client Secret"
    else
        echo "✅ GOOGLE_CLIENT_SECRET appears to be set"
    fi
else
    echo "❌ .env.local file not found"
fi

echo ""
echo "📦 Checking dependencies..."

if npm list next-auth >/dev/null 2>&1; then
    echo "✅ next-auth is installed"
else
    echo "❌ next-auth is not installed"
fi

if npm list @auth/pg-adapter >/dev/null 2>&1; then
    echo "✅ @auth/pg-adapter is installed"
else
    echo "❌ @auth/pg-adapter is not installed"
fi

echo ""
echo "🗄️ Checking database..."

if docker-compose ps | grep -q "postgres"; then
    echo "✅ PostgreSQL container appears to be running"
else
    echo "⚠️  PostgreSQL container not running"
    echo "   Run: docker-compose up -d"
fi

echo ""
echo "📁 Checking file structure..."

files=(
    "src/app/api/auth/[...nextauth]/route.ts"
    "src/components/Providers.tsx"
    "src/app/dashboard/page.tsx"
    "database/schema.sql"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file is missing"
    fi
done

echo ""
echo "🚀 Next steps:"
echo "1. Get Google OAuth credentials from Google Cloud Console"
echo "2. Update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local"
echo "3. Start Docker Desktop and run: docker-compose up -d"
echo "4. Run: npm run dev"
echo "5. Test Google OAuth at: http://localhost:3000/login"
echo ""
echo "📚 For detailed instructions, see: GOOGLE_OAUTH_SETUP.md"
