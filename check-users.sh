#!/bin/bash

echo "🔍 Checking BuildLab Academy User Signups"
echo "========================================"

echo "📊 Users Table (Custom):"
docker-compose exec postgres psql -U buildlab_user -d buildlab_db -c "
SELECT 
    id, 
    email, 
    name, 
    email_verified,
    created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 10;"

echo ""
echo "🔐 NextAuth Sessions:"
docker-compose exec postgres psql -U buildlab_user -d buildlab_db -c "
SELECT 
    s.\"sessionToken\", 
    s.\"userId\", 
    s.expires,
    u.email,
    u.name
FROM sessions s 
LEFT JOIN users u ON s.\"userId\" = u.id 
ORDER BY s.expires DESC 
LIMIT 5;"

echo ""
echo "🌐 Google OAuth Accounts:"
docker-compose exec postgres psql -U buildlab_user -d buildlab_db -c "
SELECT 
    a.provider,
    a.\"providerAccountId\",
    a.\"userId\",
    u.email,
    u.name
FROM accounts a 
LEFT JOIN users u ON a.\"userId\" = u.id 
WHERE a.provider = 'google'
ORDER BY a.\"userId\" DESC 
LIMIT 5;"

echo ""
echo "📈 User Count:"
docker-compose exec postgres psql -U buildlab_user -d buildlab_db -c "
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_users,
    COUNT(CASE WHEN \"emailVerified\" IS NOT NULL THEN 1 END) as oauth_users
FROM users;"
