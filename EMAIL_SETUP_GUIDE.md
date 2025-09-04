# Email Server Setup Guide - BuildLab Academy

## 📧 Setting Up Email with Gmail (Recommended for Development)

### Step 1: Enable 2-Factor Authentication on Gmail
1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to "Security" → "2-Step Verification"
3. Enable 2-Factor Authentication if not already enabled

### Step 2: Generate App Password
1. Still in Google Account settings → "Security"
2. Find "App passwords" (you need 2FA enabled first)
3. Click "App passwords"
4. Select "Mail" as the app and "Other" as the device
5. Enter "BuildLab Academy" as the device name
6. Copy the generated 16-character password (remove spaces)

### Step 3: Update Your .env.local File
Replace the email configuration in your `.env.local`:

```bash
# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-16-char-app-password-here
```

### Step 4: Test Email Functionality
Use the test script: `npm run test:email`

---

## 📧 Alternative: Outlook/Hotmail Setup

If you prefer to use Outlook/Hotmail:

```bash
# Email Configuration (Outlook)
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-outlook-password
```

---

## 📧 Production Setup (Recommended for Live Apps)

For production, consider using professional email services:

### SendGrid (Recommended)
```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

### Mailgun
```bash
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=your-mailgun-username
EMAIL_PASS=your-mailgun-password
```

---

## 🧪 Testing Email Functions

Your app can send these types of emails:

1. **Email Verification** - When users sign up
2. **Password Reset** - When users forget password
3. **Newsletter** - For marketing campaigns

## 🚨 Important Security Notes

- Never commit real email credentials to Git
- Use environment variables for all sensitive data
- For production, use proper email services with rate limiting
- Consider implementing email templates for better design

## 📱 Mobile Email Considerations

- Keep email templates responsive
- Test on various email clients
- Use web-safe fonts
- Include text fallbacks for HTML emails
