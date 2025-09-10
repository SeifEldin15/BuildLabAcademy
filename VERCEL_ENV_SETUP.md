# 🚀 How to Set Up Environment Variables in Vercel

## Step-by-Step Instructions

### 1. Go to Vercel Dashboard
- Visit [vercel.com](https://vercel.com)
- Navigate to your `build-lab-academy` project
- Click on the project name

### 2. Go to Settings
- Click on the **"Settings"** tab at the top
- Click on **"Environment Variables"** in the left sidebar

### 3. Add Each Environment Variable

Click **"Add New"** for each variable and enter:

#### ⚡ Required Variables:

**NEXTAUTH_URL**
- **Key:** `NEXTAUTH_URL`
- **Value:** `https://your-vercel-app-name.vercel.app`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

**NEXTAUTH_SECRET**
- **Key:** `NEXTAUTH_SECRET`
- **Value:** Generate a secure random string (32+ characters)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

**GOOGLE_CLIENT_ID**
- **Key:** `GOOGLE_CLIENT_ID`
- **Value:** Your Google OAuth Client ID
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

**GOOGLE_CLIENT_SECRET**
- **Key:** `GOOGLE_CLIENT_SECRET`
- **Value:** Your Google OAuth Client Secret
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### 🗄️ Database Variables:

**DATABASE_URL**
- **Key:** `DATABASE_URL`
- **Value:** Your production database URL
- **Environments:** ✅ Production, ✅ Preview
- **Example:** `postgresql://username:password@host:5432/database`

#### 🔐 Security Variables:

**JWT_SECRET**
- **Key:** `JWT_SECRET`
- **Value:** Your JWT secret (same as local)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### 📧 Email Variables:

**EMAIL_HOST**
- **Key:** `EMAIL_HOST`
- **Value:** `smtp.gmail.com`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

**EMAIL_PORT**
- **Key:** `EMAIL_PORT`
- **Value:** `587`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

**EMAIL_USER**
- **Key:** `EMAIL_USER`
- **Value:** Your Gmail address
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

**EMAIL_PASS**
- **Key:** `EMAIL_PASS`
- **Value:** Your Gmail app password
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### 🔧 Admin Variables:

**ADMIN_SECRET_KEY**
- **Key:** `ADMIN_SECRET_KEY`
- **Value:** Your admin secret key
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### 4. Generate Secure Secrets

Use these commands to generate secure secrets:

```bash
# For NEXTAUTH_SECRET (32 characters)
openssl rand -base64 32

# Or use this online: https://generate-secret.vercel.app/32
```

### 5. Set Up Production Database

#### Option A: Vercel Postgres (Recommended)
1. In your Vercel project, go to **"Storage"** tab
2. Click **"Create Database"** → **"Postgres"**
3. Copy the connection string to `DATABASE_URL`

#### Option B: External Database (Neon, Supabase, etc.)
1. Create account with database provider
2. Create new PostgreSQL database
3. Upload your `schema.sql` file
4. Copy connection string to `DATABASE_URL`

### 6. Update Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth client
3. Add authorized redirect URI:
   ```
   https://your-vercel-app-name.vercel.app/api/auth/callback/google
   ```

### 7. Save and Redeploy
- Click **"Save"** after adding each environment variable
- Vercel will automatically redeploy your app

## ✅ Verification Checklist

After setting up all variables:

- [ ] All 11 environment variables are set
- [ ] Google OAuth redirect URI updated
- [ ] Production database created and schema uploaded
- [ ] Deployment shows "Ready" status
- [ ] Google OAuth works on production URL
- [ ] Email functionality works

## 🔧 Troubleshooting

**If deployment still fails:**
1. Check all environment variable names are exactly correct
2. Ensure no extra spaces in values
3. Verify Google OAuth settings
4. Check database connection string format

**Common Issues:**
- `NEXTAUTH_URL` must be your exact Vercel URL
- `DATABASE_URL` must be accessible from Vercel
- Google OAuth redirect URI must match exactly
- Email credentials must be app passwords, not regular passwords

Your deployment should now work perfectly! 🎉
