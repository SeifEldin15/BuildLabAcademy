# Bootcamp Early Registration System

## Overview

A comprehensive system for managing early registrations for the **April 15, 2026 Bootcamp** with three key scenarios:

1. **Express Interest (Free)** - Collect user information and demographics
2. **Pay $100 Holding Fee** - Secure spot + lock in $1,500 early-bird discount
3. **Admin Dashboard** - View registrations, track contacts, manage "closers" workflow

---

## 🎯 Primary Goal

**Attract users to the site and learn who they are** (demographics, phone conversation opportunities) to understand our audience and convert them into paid bootcamp students.

---

## System Components

### 1. Database Schema
**File**: `database/bootcamp-early-registration-schema.sql`

**Tables Created**:
- `bootcamp_cohorts` - Bootcamp sessions (April 2026 cohort pre-populated)
- `early_registrations` - User interest & registrations with full demographics
- `holding_fee_payments` - Stripe payment tracking
- `registration_contact_log` - Sales/closer contact history

**To Apply Schema**:
```powershell
Get-Content database/bootcamp-early-registration-schema.sql | docker exec -i buildlab_postgres psql -U buildlab_user -d buildlab_db
```

### 2. API Endpoints

#### Register Interest (No Payment)
```
POST /api/bootcamp/register-interest
```
**Purpose**: Collect user information for the sales team to follow up

**Request Body**:
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "ageRange": "25-34",
  "currentOccupation": "Marketing Manager",
  "educationLevel": "bachelors",
  "programmingExperience": "beginner",
  "motivation": "Want to change careers into tech",
  "howDidYouHear": "google",
  "utmSource": "facebook",
  "utmMedium": "cpc",
  "utmCampaign": "spring-2026",
  "referralCode": "FRIEND123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Thank you for your interest! Our team will be in touch soon.",
  "registration": { ...full registration object... }
}
```

#### Get Cohort Information
```
GET /api/bootcamp/register-interest?cohortId=1
```

#### Create Holding Fee Payment
```
POST /api/bootcamp/holding-fee
```
**Request Body**:
```json
{
  "registrationId": 123,
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx",
  "amount": 100,
  "paymentIntentId": "pi_xxx"
}
```

#### Confirm Payment
```
PUT /api/bootcamp/holding-fee
```
**Request Body**:
```json
{
  "paymentIntentId": "pi_xxx",
  "registrationId": 123
}
```

#### Admin - View All Registrations
```
GET /api/bootcamp/admin?adminSecret=YOUR_SECRET&cohortId=1&status=interested
```

**Response**:
```json
{
  "success": true,
  "registrations": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "status": "interested",
      "has_paid_holding_fee": false,
      "age_range": "25-34",
      "current_occupation": "Marketing Manager",
      "programming_experience": "beginner",
      "motivation": "Want to change careers",
      "contact_attempts": 0,
      ...
    }
  ],
  "statistics": {
    "total_interested": 25,
    "paid_holding_fees": 8,
    "contacted": 15,
    "closed_deals": 3,
    "total_revenue": 800
  }
}
```

#### Admin - Add Contact Log
```
POST /api/bootcamp/admin
```
**Request Body**:
```json
{
  "adminSecret": "YOUR_SECRET",
  "registrationId": 123,
  "contactType": "phone",
  "contactedBy": "Sales Rep Name",
  "notes": "Had great conversation about career goals",
  "outcome": "interested",
  "nextAction": "Send curriculum details",
  "nextContactDate": "2025-10-15"
}
```

#### Admin - Update Registration
```
PUT /api/bootcamp/admin
```
**Request Body**:
```json
{
  "adminSecret": "YOUR_SECRET",
  "registrationId": 123,
  "assignedCloser": "John Smith",
  "closerNotes": "High priority lead",
  "status": "contacted"
}
```

### 3. Landing Page
**URL**: `http://localhost:3000/bootcamp-early-registration`

**Features**:
- ✅ Compelling hero section with urgency (spots remaining)
- ✅ Price comparison: Regular ($10,000) vs Early Bird ($8,500)
- ✅ Clear call-to-action: "Express Your Interest" (no payment required)
- ✅ Multi-step form collecting demographics
- ✅ Success page encouraging phone conversation
- ✅ UTM tracking for marketing campaigns
- ✅ Mobile-responsive design

**Form Collects**:
- Contact info (name, email, phone)
- Demographics (age, occupation, education, experience)
- Motivation & goals
- How they heard about us
- Marketing tracking (UTM parameters)

### 4. Admin Dashboard
**URL**: `http://localhost:3000/bootcamp-admin`

**Features**:
- 🔐 Secure admin authentication (uses ADMIN_SECRET_KEY)
- 📊 Statistics dashboard (total interested, paid fees, contacted, closed deals, revenue)
- 📋 Full registration list with filtering by status
- 👤 Detailed view of each registration
- 📞 Add contact logs (phone calls, emails, meetings)
- 👥 Assign registrations to "closers"
- 📅 Set follow-up dates
- 🎯 Track conversion funnel

**Status Types**:
- `interested` - Just expressed interest
- `holding-paid` - Paid $100 holding fee (has early-bird discount)
- `contacted` - Sales team has reached out
- `closed` - Deal closed, enrolled in bootcamp
- `withdrawn` - No longer interested

---

## 🎓 Bootcamp Details (April 2026 Cohort)

- **Start Date**: April 15, 2026
- **Duration**: 12 weeks
- **Regular Price**: $10,000
- **Early Bird Price**: $8,500 (save $1,500)
- **Holding Fee**: $100 (reserves spot + locks in discount)
- **Capacity**: 30 students
- **Status**: Early Registration Open

---

## 🎯 Recommended Workflow

### Phase 1: Attract & Learn (Current Focus)
1. User lands on `/bootcamp-early-registration`
2. User fills out interest form (NO PAYMENT)
3. System captures demographics + motivation
4. Success page encourages phone conversation
5. Admin receives notification of new lead

### Phase 2: Contact & Qualify
1. Sales team reviews registration in `/bootcamp-admin`
2. Closer is assigned to the lead
3. Phone call or video meeting scheduled
4. Contact log is added with notes
5. Assess if candidate is a good fit

### Phase 3: Convert
**Option A - Holding Fee ($100)**:
- User pays $100 to secure spot
- Gets $1,500 early-bird discount locked in
- Total remaining: $8,400
- Payment plan can be arranged

**Option B - Full Payment**:
- User pays full amount upfront
- Gets early-bird discount
- Spot secured immediately

**Option C - Waitlist**:
- Not ready to commit yet
- Add to nurture sequence
- Follow up later

---

## 💡 Marketing Strategy

### UTM Tracking
All marketing links should include UTM parameters:
```
https://buildlabacademy.com/bootcamp-early-registration?utm_source=facebook&utm_medium=cpc&utm_campaign=spring-2026&ref=PROMO100
```

### Referral Tracking
Use referral codes to track word-of-mouth:
```
?ref=FRIENDNAME
```

### A/B Testing
Test different landing page variations:
- Price emphasis vs. curriculum emphasis
- Social proof vs. urgency
- Long form vs. short form

---

## 📞 Closer Script Suggestions

### Initial Phone Call:
1. **Introduction**: "Hi [Name], thanks for expressing interest in our April 2026 bootcamp!"
2. **Discovery**: "Tell me about what motivated you to look into coding bootcamps?"
3. **Goals**: "Where do you see yourself in 6 months after completing the bootcamp?"
4. **Experience**: "I see you marked your experience as [level] - tell me more about that"
5. **Concerns**: "What questions or concerns do you have about the program?"
6. **Value**: "Based on what you've told me, here's how our bootcamp can help..."
7. **Close**: "Would you like to secure your spot with the $100 holding fee to lock in your $1,500 discount?"

### Follow-up Email Template:
```
Subject: Great talking with you, [Name]!

Hi [Name],

It was wonderful speaking with you today about your goals to [their goal]. 

As we discussed, our April 15, 2026 bootcamp starts in [X] months, and we currently have [Y] spots remaining.

To secure your spot and lock in the $1,500 early-bird discount, you can pay the $100 holding fee here: [PAYMENT LINK]

This gives you:
✓ Guaranteed spot in the cohort
✓ $1,500 discount (total: $8,500 instead of $10,000)
✓ Priority support from our team
✓ Flexible payment plan for the remaining balance

Let me know if you have any questions!

Best,
[Your Name]
```

---

## 🔧 Configuration

### Environment Variables Required
```bash
# In .env.local
ADMIN_SECRET_KEY=your_admin_secret_here
STRIPE_SECRET_KEY=sk_test_your_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

### Stripe Webhook (Optional)
Set up webhook for automatic payment confirmation:
```
Endpoint: /api/bootcamp/webhook
Events: payment_intent.succeeded
```

---

## 📊 Key Metrics to Track

1. **Top of Funnel**:
   - Landing page visitors
   - Form starts
   - Form completions
   - Conversion rate (visitor → registration)

2. **Middle of Funnel**:
   - Contact attempts
   - Contact success rate
   - Average time to first contact
   - Conversation quality scores

3. **Bottom of Funnel**:
   - Holding fee payment rate
   - Full enrollment rate
   - Average deal close time
   - Revenue per registration

4. **Demographics**:
   - Age distribution
   - Experience levels
   - Occupations
   - Traffic sources (UTM analysis)

---

## 🚀 Next Steps

### Immediate (Now):
1. ✅ Database schema created
2. ✅ API endpoints built
3. ✅ Landing page live
4. ✅ Admin dashboard functional

### Short-term (This Week):
1. ⏳ Set up email confirmations
2. ⏳ Configure Stripe webhook
3. ⏳ Add email notifications for new registrations
4. ⏳ Create marketing materials

### Medium-term (This Month):
1. ⏳ Build payment plan calculator
2. ⏳ Add SMS notifications
3. ⏳ Create nurture email sequence
4. ⏳ Analytics dashboard integration

### Long-term (Later):
1. ⏳ Learning portal access (after payment)
2. ⏳ Automated follow-up system
3. ⏳ Video testimonials section
4. ⏳ Alumni success stories

---

## 📝 Important Notes

- **Focus on conversations**: The goal is to GET PEOPLE ON THE PHONE, not just collect emails
- **Quality over quantity**: Better to have 10 highly motivated students than 30 unqualified leads
- **Track everything**: Every contact attempt, every conversation, every objection
- **Iterate quickly**: Test messaging, pricing, timing - find what works
- **Build relationships**: This is a high-ticket sale, relationships matter

---

## 🆘 Support

For technical questions:
- Check API error messages in browser console
- Review server logs: `npm run dev`
- Database queries: `docker exec -it buildlab_postgres psql -U buildlab_user -d buildlab_db`

For sales/marketing questions:
- Review the demographics data in admin dashboard
- Analyze which traffic sources convert best
- A/B test different messaging strategies
