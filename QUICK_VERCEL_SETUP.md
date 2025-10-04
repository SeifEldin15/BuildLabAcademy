# Quick Vercel Environment Variables Setup# Quick Vercel Environment Variables Setup



## 🚀 Copy-Paste Environment Variables for Vercel## 🚀 Copy-Paste Environment Variables for Vercel



Go to your Vercel project → Settings → Environment Variables and add these:Go to your Vercel project → Settings → Environment Variables and add these:



### 1. NextAuth Configuration### 1. NextAuth Configuration

``````

NEXTAUTH_URLNEXTAUTH_URL

https://build-lab-academy-git-main-seifs-projects-a4dff253.vercel.apphttps://build-lab-academy-git-main-seifs-projects-a4dff253.vercel.app



NEXTAUTH_SECRETNEXTAUTH_SECRET

your-32-character-secret-here-change-thisyour-32-character-secret-here-change-this

``````



### 2. Google OAuth (Use your actual credentials)### 2. Google OAuth (Use your actual credentials)

``````

GOOGLE_CLIENT_IDGOOGLE_CLIENT_ID

your-google-client-id-from-console.apps.googleusercontent.comyour-google-client-id-from-console.apps.googleusercontent.com



GOOGLE_CLIENT_SECRETGOOGLE_CLIENT_SECRET

your-google-client-secret-from-consoleyour-google-client-secret-from-console

``````



### 3. Database (You'll need a production database)### 3. Database (You'll need a production database)

``````

DATABASE_URLDATABASE_URL

postgresql://username:password@host:5432/databasepostgresql://username:password@host:5432/database

``````



### 4. Security### 4. Security

``````

JWT_SECRETJWT_SECRET

your-jwt-secret-key-here-generate-a-secure-random-stringseA@dklgb@@hisA@ukrwagA@hdsfg2A@@!%%^das%dbjkldh%dbfoig

``````



### 5. Email Configuration### 5. Email Configuration

``````

EMAIL_HOSTEMAIL_HOST

smtp.gmail.comsmtp.gmail.com



EMAIL_PORTEMAIL_PORT

587587



EMAIL_USEREMAIL_USER

your-email@gmail.comyour-email@gmail.com



EMAIL_PASSEMAIL_PASS

your-app-passwordyour-app-password

``````



### 6. Admin### 6. Admin

``````

ADMIN_SECRET_KEYADMIN_SECRET_KEY

your-admin-secret-key-generate-a-secure-random-stringsdfkbg983d%fgderhdsfhdrshgaweg34

``````



## ⚠️ Important Updates Needed:## ⚠️ Important Updates Needed:



1. **Update NEXTAUTH_URL** with your actual Vercel URL1. **Update NEXTAUTH_URL** with your actual Vercel URL

2. **Generate new NEXTAUTH_SECRET** (use: https://generate-secret.vercel.app/32)2. **Generate new NEXTAUTH_SECRET** (use: https://generate-secret.vercel.app/32)

3. **Set up production database** (Vercel Postgres recommended)3. **Set up production database** (Vercel Postgres recommended)

4. **Update email credentials** with your Gmail app password4. **Update email credentials** with your Gmail app password

5. **Update Google OAuth redirect URI** to include your Vercel domain5. **Update Google OAuth redirect URI** to include your Vercel domain

6. **Generate secure JWT_SECRET and ADMIN_SECRET_KEY**

## 🔄 After Setting Variables:

## 🔄 After Setting Variables:

Vercel will automatically redeploy your app. The build should now complete successfully!

Vercel will automatically redeploy your app. The build should now complete successfully!

## 📋 Database Setup Options:

## 📋 Database Setup Options:

### Option A: Vercel Postgres (Easiest)

### Option A: Vercel Postgres (Easiest)1. Go to Storage tab in Vercel

1. Go to Storage tab in Vercel2. Create Postgres database

2. Create Postgres database3. Copy DATABASE_URL from there

3. Copy DATABASE_URL from there

### Option B: Neon Database (Free tier)

### Option B: Neon Database (Free tier)1. Sign up at neon.tech

1. Sign up at neon.tech2. Create new database

2. Create new database3. Upload your schema.sql

3. Upload your schema.sql4. Copy connection string

4. Copy connection string
