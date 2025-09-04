# Google OAuth Setup Guide for BuildLab Academy

## Prerequisites
1. Make sure Docker Desktop is running
2. Set up Google OAuth credentials

## Step 1: Get Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set the application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (for production)

## Step 2: Update Environment Variables

Open your `.env.local` file and replace the placeholder values:

```bash
# Replace these with your actual Google OAuth credentials:
GOOGLE_CLIENT_ID=your-actual-google-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret-here
```

## Step 3: Set up Database

1. Start Docker Desktop
2. Run the following commands:

```bash
# Stop existing containers
docker-compose down

# Start the database
docker-compose up -d

# Wait for database to be ready, then run schema
```

## Step 4: Install Dependencies (Already Done)

The following packages have been installed:
- `next-auth` - For authentication
- `@auth/pg-adapter` - PostgreSQL adapter for NextAuth

## Step 5: Database Schema

The database schema has been updated to include:
- NextAuth tables (accounts, sessions, verification_tokens)
- Updated users table to be compatible with NextAuth
- Proper indexes for performance

## Step 6: Test Google OAuth

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/login`
3. Click "Or sign in with Google"
4. You should be redirected to Google's OAuth consent screen

## Features Implemented

### Google OAuth Login
- ✅ Google OAuth provider configured
- ✅ Database adapter for session management
- ✅ User creation/update on Google sign-in
- ✅ Seamless integration with existing user system

### Login Page Updates
- ✅ Google OAuth button integrated
- ✅ Loading states for both forms
- ✅ Error handling and display
- ✅ Proper redirects after authentication

### NextAuth Configuration
- ✅ PostgreSQL adapter configured
- ✅ Custom callbacks for user management
- ✅ Session strategy set to database
- ✅ Custom sign-in and error pages

## How Google OAuth Works

1. User clicks "Sign in with Google"
2. User is redirected to Google's OAuth consent screen
3. User grants permission
4. Google redirects back to your app with authorization code
5. NextAuth exchanges code for tokens
6. User information is stored in database
7. User is signed in and redirected to dashboard

## Troubleshooting

### Common Issues:

1. **Google OAuth Error**: Make sure your redirect URI is correctly set in Google Cloud Console
2. **Database Connection**: Ensure Docker Desktop is running and database is accessible
3. **Environment Variables**: Double-check your `.env.local` file has correct values
4. **Session Issues**: Clear browser cookies and try again

### Database Connection Test:
```bash
# Test if database is accessible
docker-compose logs postgres
```

## Next Steps

1. Get your Google OAuth credentials from Google Cloud Console
2. Update the `.env.local` file with actual values
3. Start Docker Desktop and run `docker-compose up -d`
4. Test the Google OAuth flow

## Security Notes

- Never commit your `.env.local` file to version control
- Use strong, unique secrets for production
- Set up proper CORS and allowed origins for production
- Consider implementing rate limiting for authentication endpoints
