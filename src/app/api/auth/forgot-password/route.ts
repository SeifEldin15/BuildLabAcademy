import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { generateVerificationCode } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      // Return success even if user doesn't exist for security
      return NextResponse.json(
        { message: 'If an account with this email exists, you will receive a verification code.' },
        { status: 200 }
      );
    }

    const userId = userResult.rows[0].id;

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate existing codes
    await pool.query(
      'UPDATE email_verification_tokens SET used = true WHERE user_id = $1 AND used = false',
      [userId]
    );

    // Save new verification code
    await pool.query(
      'INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, verificationCode, expiresAt]
    );

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json(
      { message: 'If an account with this email exists, you will receive a verification code.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
