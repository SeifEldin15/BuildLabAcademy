# Vercel Deployment Guide - BuildLab Academy

## 🚀 Steps to Deploy on Vercel

### Step 1: Set Up Environment Variables in Vercel

Go to your Vercel project dashboard and add these environment variables:

#### Required Environment Variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database (You'll need to update this for production)
DATABASE_URL=your-production-database-url

# JWT Secret
JWT_SECRET=your-jwt-secret-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Admin Secret
ADMIN_SECRET_KEY=your-admin-secret-key
```

### Step 2: Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth 2.0 Client ID
3. Add your Vercel domain to "Authorized redirect URIs":
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```

### Step 3: Set Up Production Database

Since you're using Docker PostgreSQL locally, you'll need a cloud database for production:

#### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel project
2. Click "Storage" tab
3. Create a Postgres database
4. Copy the `DATABASE_URL` to your environment variables

#### Option B: External Database (Neon, Supabase, etc.)
1. Create account with database provider
2. Create new PostgreSQL database
3. Run your schema.sql on the production database
4. Update `DATABASE_URL` environment variable

### Step 4: Commit and Push Changes

```bash
git add .
git commit -m "fix: Resolve nodemailer dependency conflict for Vercel deployment"
git push origin main
```

### Step 5: Redeploy on Vercel

Vercel will automatically redeploy when you push to main branch.

## 🔧 Troubleshooting Common Issues

### 1. Database Connection Issues
- Make sure your DATABASE_URL is correct for production
- Ensure your production database has the required tables (run schema.sql)

### 2. OAuth Issues
- Verify Google OAuth redirect URIs include your Vercel domain
- Check that all environment variables are set correctly

### 3. Email Issues
- Gmail app passwords work in production
- For production, consider using SendGrid or similar service

### 4. Build Issues
- If you get dependency conflicts, the .npmrc file should resolve them
- Make sure all environment variables are set in Vercel dashboard

## 📊 What Was Fixed

1. **Dependency Conflict**: Downgraded nodemailer from v7 to v6 for next-auth compatibility
2. **NPM Configuration**: Added .npmrc with legacy-peer-deps=true
3. **Vercel Configuration**: Added vercel.json with proper build settings
4. **Next.js Configuration**: Updated for better Vercel compatibility

## 🎯 Next Steps After Deployment

1. Test Google OAuth on production URL
2. Test email functionality 
3. Set up production database with your schema
4. Configure monitoring and error tracking
5. Set up custom domain (optional)

Your app should now deploy successfully on Vercel! 🎉
