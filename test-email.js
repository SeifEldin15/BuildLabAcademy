import { sendVerificationEmail, sendPasswordResetEmail } from '../src/lib/email.js';

const testEmail = async () => {
  console.log('🧪 Testing BuildLab Academy Email Service');
  console.log('==========================================');

  // Get test email from command line or use default
  const testEmailAddress = process.argv[2] || 'test@example.com';
  
  if (testEmailAddress === 'test@example.com') {
    console.log('❌ Please provide a real email address:');
    console.log('   node test-email.js your-email@gmail.com');
    process.exit(1);
  }

  console.log(`📧 Sending test emails to: ${testEmailAddress}`);
  
  try {
    // Test 1: Verification Email
    console.log('\n📨 Testing verification email...');
    await sendVerificationEmail(testEmailAddress, '1234');
    console.log('✅ Verification email sent successfully!');

    // Test 2: Password Reset Email
    console.log('\n🔐 Testing password reset email...');
    await sendPasswordResetEmail(testEmailAddress, 'test-reset-token-123');
    console.log('✅ Password reset email sent successfully!');

    console.log('\n🎉 All email tests passed!');
    console.log('Check your inbox for the test emails.');
    
  } catch (error) {
    console.error('\n❌ Email test failed:');
    console.error(error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Authentication failed. Please check:');
      console.log('   - EMAIL_USER is correct');
      console.log('   - EMAIL_PASS is your app password (not regular password)');
      console.log('   - 2FA is enabled on your Google account');
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Host not found. Please check:');
      console.log('   - EMAIL_HOST is correct (smtp.gmail.com for Gmail)');
      console.log('   - Internet connection is working');
    }
  }
};

testEmail();
