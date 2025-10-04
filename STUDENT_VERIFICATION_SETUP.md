# Student Verification Setup Guide

This guide will help you set up the student verification system for Build Lab Academy using both basic email verification and SheerID integration.

## Overview

The student verification system provides:
- **Basic Email Verification**: Instant verification for recognized educational email domains
- **SheerID Integration**: Professional third-party verification service (recommended for production)
- **Admin Management**: Tools to manually review and approve verifications
- **Discount Management**: Automatic discount code generation and tracking

## Environment Variables Setup

Add these variables to your `.env.local` file:

```env
# Student Verification Settings
ADMIN_SECRET_KEY=your_super_secret_admin_key_here

# SheerID Integration (Optional but recommended for production)
SHEERID_ACCESS_TOKEN=your_sheerid_access_token
SHEERID_PROGRAM_ID=your_sheerid_program_id
SHEERID_API_URL=https://services.sheerid.com/rest/v2

# For admin panel access (optional - can use ADMIN_SECRET_KEY)
NEXT_PUBLIC_ADMIN_SECRET_KEY=your_admin_key_for_frontend
```

## SheerID Setup (Recommended)

### What is SheerID?

SheerID is the leading student verification service used by companies like:
- Spotify Student
- Adobe Creative Cloud Student
- Microsoft Student
- Nike Student Discount
- And thousands more

### Getting Started with SheerID

1. **Visit SheerID**: Go to [https://www.sheerid.com/](https://www.sheerid.com/)

2. **Contact Sales**: Click "Get Started" or "Contact Us"
   - Explain you need student verification for an educational platform
   - Mention you're offering student discounts

3. **Program Setup**: SheerID will help you create a verification program
   - Define your eligibility criteria (current students, recent graduates, etc.)
   - Set verification requirements
   - Configure your brand assets

4. **Get Credentials**:
   - `SHEERID_ACCESS_TOKEN`: Your API access token
   - `SHEERID_PROGRAM_ID`: Your specific program identifier

### SheerID Pricing

- Pricing is typically per verification
- Volume discounts available
- Free sandbox environment for testing
- Contact SheerID for current pricing: [https://www.sheerid.com/pricing/](https://www.sheerid.com/pricing/)

## Alternative Services

If SheerID doesn't fit your needs, consider these alternatives:

### 1. UNiDAYS
- Website: [https://www.myunidays.com/](https://www.myunidays.com/)
- Popular in UK and Europe
- Similar verification capabilities

### 2. Student Beans
- Website: [https://www.studentbeans.com/](https://www.studentbeans.com/)
- Global reach with good US coverage
- Marketing partnerships available

### 3. Custom Email Domain Verification
- Use the built-in email domain system
- Maintain your own database of educational domains
- Free but requires manual maintenance

## Basic Email Verification

The system includes a comprehensive database of educational email domains. You can:

### Add New Domains

Connect to your database and run:

```sql
INSERT INTO student_email_domains (domain, school_name, country) 
VALUES ('@your-university.edu', 'Your University Name', 'United States');
```

### Bulk Import

For bulk domain imports, you can use the admin API or directly insert into the database.

## Usage Instructions

### For Students

1. **Visit Student Portal**: Direct students to `/student-portal`

2. **Email Check**: Students enter their email to check if it's recognized

3. **Application**: Fill out the verification form with:
   - Personal information
   - School details
   - Verification method preference

4. **Verification**: 
   - Instant approval for recognized domains
   - SheerID verification for comprehensive check
   - Manual review for edge cases

5. **Discount Code**: Verified students receive a unique discount code

### For Administrators

1. **Access Admin Panel**: Visit `/student-admin`

2. **Enter Admin Key**: Use the value from `ADMIN_SECRET_KEY`

3. **Review Applications**: 
   - View pending verifications
   - Approve or reject manually
   - View usage statistics

4. **Manage System**:
   - Monitor discount usage
   - Track popular schools
   - Generate reports

## Integration with Payment System

### In Your Checkout Component

```tsx
import StudentDiscountComponent from '@/components/StudentDiscount';

function CheckoutPage() {
  const [orderAmount, setOrderAmount] = useState(100);
  const [finalAmount, setFinalAmount] = useState(100);

  const handleDiscountApplied = (discountInfo: any) => {
    setFinalAmount(discountInfo.finalAmount);
    // Update your payment intent with new amount
  };

  const handleDiscountRemoved = () => {
    setFinalAmount(orderAmount);
    // Reset payment intent to original amount
  };

  return (
    <div>
      {/* Your existing checkout form */}
      
      <StudentDiscountComponent
        orderAmount={orderAmount}
        onDiscountApplied={handleDiscountApplied}
        onDiscountRemoved={handleDiscountRemoved}
      />
      
      {/* Continue with payment */}
    </div>
  );
}
```

### Record Discount Usage

After successful payment, record the usage:

```tsx
const recordDiscountUsage = async (paymentIntentId: string, discountInfo: any) => {
  await fetch('/api/student-discount/record-usage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      verificationId: discountInfo.verificationId,
      orderId: paymentIntentId,
      discountAmount: discountInfo.discountAmount,
      originalAmount: discountInfo.originalAmount,
      finalAmount: discountInfo.finalAmount
    })
  });
};
```

## Security Considerations

1. **Admin Authentication**: 
   - Use a strong `ADMIN_SECRET_KEY`
   - Consider implementing proper admin user authentication for production

2. **API Rate Limiting**: 
   - Implement rate limiting on verification endpoints
   - Monitor for abuse patterns

3. **Data Privacy**:
   - Follow GDPR/CCPA guidelines for student data
   - Implement data retention policies

4. **Discount Code Security**:
   - Codes are unique and time-limited
   - Track usage to prevent abuse

## Testing

### Test Email Domains

The system includes test domains for development:

```
test-student@test.edu (will be verified)
student@university.edu (will be verified)
regular@gmail.com (will not be verified)
```

### SheerID Sandbox

SheerID provides a sandbox environment for testing. Contact them for sandbox credentials.

## Support and Maintenance

### Monitoring

- Check admin panel regularly for pending verifications
- Monitor discount usage trends
- Review top schools for insights

### Updates

- Keep student domain database updated
- Monitor SheerID API changes
- Update verification criteria as needed

### Common Issues

1. **Email Not Recognized**: 
   - Add domain to database
   - Guide student to manual verification

2. **SheerID Failures**:
   - System automatically falls back to email verification
   - Check API credentials and connectivity

3. **Expired Discounts**:
   - Students can reapply for verification
   - Admin can extend expiration dates

## Cost Analysis

### Basic Email Verification
- **Cost**: Free
- **Accuracy**: Medium (domain-based only)
- **Maintenance**: Manual domain management required

### SheerID Integration
- **Cost**: Per verification (~$1-3 per verification, volume discounts available)
- **Accuracy**: Very High (document verification, enrollment status)
- **Maintenance**: Minimal

### Recommended Approach

1. **Start with email verification** for immediate deployment
2. **Add SheerID integration** as you scale
3. **Use manual review** for edge cases and quality control

This provides a complete student verification system that can grow with your business!
