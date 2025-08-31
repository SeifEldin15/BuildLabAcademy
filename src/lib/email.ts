import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email: string, code: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Build Lab Academy - Email Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Email Address</h2>
        <p>Thank you for signing up with Build Lab Academy!</p>
        <p>Your verification code is:</p>
        <h1 style="background: #f0f0f0; padding: 20px; text-align: center; letter-spacing: 5px;">${code}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Build Lab Academy - Password Reset',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password</h2>
        <p>You requested a password reset for your Build Lab Academy account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendNewsletterWelcomeEmail = async (email: string, unsubscribeToken: string) => {
  const unsubscribeUrl = `${process.env.NEXTAUTH_URL}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Build Lab Academy Newsletter! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${process.env.NEXTAUTH_URL}/logo.png" alt="Build Lab Academy" style="height: 60px;">
        </div>
        
        <h2 style="color: #1f2937; text-align: center;">Welcome to Our Newsletter! 🎉</h2>
        
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
          Thank you for subscribing to the Build Lab Academy newsletter! You're now part of our community of learners and builders.
        </p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">What to expect:</h3>
          <ul style="color: #4b5563; line-height: 1.6;">
            <li>🚀 Latest course updates and new releases</li>
            <li>💡 Exclusive tips and tutorials</li>
            <li>🎯 Career guidance and industry insights</li>
            <li>🎁 Special offers and early access to new content</li>
          </ul>
        </div>
        
        <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
          We're excited to have you on board and can't wait to share amazing content with you!
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL}" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Explore Our Courses</a>
        </div>
        
        <hr style="border: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          You can <a href="${unsubscribeUrl}" style="color: #6b7280;">unsubscribe</a> at any time.<br>
          Build Lab Academy | Making Learning Accessible
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendNewsletterEmail = async (emails: string[], subject: string, content: string) => {
  const promises = emails.map(email => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Build Lab Academy - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${process.env.NEXTAUTH_URL}/logo.png" alt="Build Lab Academy" style="height: 60px;">
          </div>
          
          ${content}
          
          <hr style="border: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            You're receiving this because you subscribed to Build Lab Academy newsletter.<br>
            <a href="${process.env.NEXTAUTH_URL}/api/newsletter/unsubscribe?email=${email}" style="color: #6b7280;">Unsubscribe</a> | 
            <a href="${process.env.NEXTAUTH_URL}" style="color: #6b7280;">Visit our website</a>
          </p>
        </div>
      `,
    };

    return transporter.sendMail(mailOptions);
  });

  await Promise.all(promises);
};
