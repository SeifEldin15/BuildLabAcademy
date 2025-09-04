import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Send test verification email
    await sendVerificationEmail(email, '1234');

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully! Check your inbox.'
    });

  } catch (error: any) {
    console.error('Email test error:', error);

    let errorMessage = 'Failed to send email';
    let suggestions: string[] = [];

    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed';
      suggestions = [
        'Check if EMAIL_USER and EMAIL_PASS are correct',
        'Make sure you\'re using an app password for Gmail',
        'Verify 2FA is enabled on your Gmail account'
      ];
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'Email server not found';
      suggestions = [
        'Check if EMAIL_HOST is correct (smtp.gmail.com for Gmail)',
        'Verify internet connection'
      ];
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Cannot connect to email server';
      suggestions = [
        'Check EMAIL_PORT (587 for Gmail)',
        'Verify firewall settings'
      ];
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        suggestions,
        details: error.message 
      },
      { status: 500 }
    );
  }
}
