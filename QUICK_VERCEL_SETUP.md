# Quick Vercel Environment Variables Setup

## 🚀 Copy-Paste Environment Variables for Vercel

Go to your Vercel project → Settings → Environment Variables and add these:

### 1. NextAuth Configuration
```
NEXTAUTH_URL
https://build-lab-academy-git-main-seifs-projects-a4dff253.vercel.app

NEXTAUTH_SECRET
your-32-character-secret-here-change-this
```

### 2. Google OAuth (Use your actual credentials)
```
GOOGLE_CLIENT_ID
your-google-client-id-from-console.apps.googleusercontent.com

GOOGLE_CLIENT_SECRET
your-google-client-secret-from-console
```

### 3. Database (You'll need a production database)
```
DATABASE_URL
postgresql://username:password@host:5432/database
```

### 4. Security
```
JWT_SECRET
seA@dklgb@@hisA@ukrwagA@hdsfg2A@@!%%^das%dbjkldh%dbfoig
```

### 5. Email Configuration
```
EMAIL_HOST
smtp.gmail.com

EMAIL_PORT
587

EMAIL_USER
your-email@gmail.com

EMAIL_PASS
your-app-password
```

### 6. Admin
```
ADMIN_SECRET_KEY
sdfkbg983d%fgderhdsfhdrshgaweg34
```

## ⚠️ Important Updates Needed:

1. **Update NEXTAUTH_URL** with your actual Vercel URL
2. **Generate new NEXTAUTH_SECRET** (use: https://generate-secret.vercel.app/32)
3. **Set up production database** (Vercel Postgres recommended)
4. **Update email credentials** with your Gmail app password
5. **Update Google OAuth redirect URI** to include your Vercel domain

## 🔄 After Setting Variables:

Vercel will automatically redeploy your app. The build should now complete successfully!

## 📋 Database Setup Options:

### Option A: Vercel Postgres (Easiest)
1. Go to Storage tab in Vercel
2. Create Postgres database
3. Copy DATABASE_URL from there

### Option B: Neon Database (Free tier)
1. Sign up at neon.tech
2. Create new database
3. Upload your schema.sql
4. Copy connection string
