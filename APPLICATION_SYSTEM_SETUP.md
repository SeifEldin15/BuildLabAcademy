# Application System Setup Guide

## Overview
The application system has been successfully implemented with the following features:
- Multi-step application form with validation
- Database storage for all application data
- Email notifications to administrators
- Protected routes requiring authentication
- Complete integration with NextAuth and PostgreSQL

## Current Status
✅ **Completed:**
- Application form with 6 steps (Interest, Interest cont., Final Questions, Payment, Review, Complete)
- Database table `applications` with proper schema
- API endpoint `/api/applications/submit` for form submissions
- Email notification system using Nodemailer
- Authentication protection for the apply page
- Conditional apply button in navbar based on login status

## Email Configuration Required

To enable email notifications, you need to update the `.env.local` file with your actual Gmail credentials:

### Step 1: Set up Gmail App Password
1. Go to your Google Account settings
2. Enable 2-factor authentication if not already enabled
3. Go to Security → 2-Step Verification → App passwords
4. Generate an app password for "Mail"
5. Copy the 16-character password

### Step 2: Update Environment Variables
Edit `.env.local` and replace these values:
```env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=your-16-character-app-password
ADMIN_EMAIL=admin-email-to-receive-notifications@gmail.com
```

## Database Schema
The `applications` table includes:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to users table)
- `email` (User's email from session)
- `name` (User's name from session)
- `course_type` (group/individual)
- `interest` (Text)
- `additional_info` (Text)
- `work_experience` (Text)
- `existing_skills` (Text)
- `team_role` (Text)
- `can_commit` (Boolean)
- `has_steel_boots` (Boolean)
- `interested_in_bootcamp` (Boolean)
- `final_comments` (Text)
- `submitted_at` (Timestamp)
- `status` (pending/reviewed/approved/rejected)

## Application Flow
1. **Unauthenticated users:** Click Apply → Redirected to login → After login → Redirected to apply page
2. **Authenticated users:** Click Apply → Direct to apply page
3. **Form completion:** 6-step process with validation at each step
4. **Submission:** Data saved to database + email sent to admin
5. **Confirmation:** Success page with option to return home

## Testing the System
1. **Start the development server:** `npm run dev`
2. **Test authentication flow:**
   - Visit homepage while logged out
   - Click Apply button → Should redirect to login
   - Login with Google → Should redirect back to apply page
3. **Test application submission:**
   - Complete all form steps
   - Submit application
   - Check database for new entry
   - Check admin email for notification

## API Endpoints
- `POST /api/applications/submit` - Submit new application
  - Requires authentication (NextAuth session)
  - Validates all required fields
  - Saves to database
  - Sends email notification
  - Returns success/error response

## Security Features
- Session-based authentication required
- SQL injection protection with parameterized queries
- Input validation and sanitization
- CSRF protection through NextAuth
- Environment variable protection for sensitive data

## Troubleshooting

### Common Issues:
1. **Email not sending:** Check Gmail app password and credentials
2. **Database errors:** Ensure PostgreSQL container is running
3. **Authentication issues:** Verify NextAuth configuration
4. **Form validation:** Check browser console for JavaScript errors

### Database Connection Test:
```bash
docker exec buildlab_postgres psql -U buildlab_user -d buildlab_db -c "SELECT * FROM applications LIMIT 5;"
```

### Email Test:
Visit `/test-email` endpoint to test email configuration.

## Next Steps
1. Configure email credentials
2. Test complete application flow
3. Consider adding admin dashboard to view applications
4. Add email templates for better formatting
5. Implement status tracking for applications
