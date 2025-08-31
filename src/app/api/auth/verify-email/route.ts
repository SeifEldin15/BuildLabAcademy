import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    // Validate input
    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    // Find user
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userId = userResult.rows[0].id;

    // Find valid verification token
    const tokenResult = await pool.query(
      'SELECT id FROM email_verification_tokens WHERE user_id = $1 AND token = $2 AND expires_at > NOW() AND used = false',
      [userId, code]
    );

    if (tokenResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    const tokenId = tokenResult.rows[0].id;

    // Mark token as used
    await pool.query(
      'UPDATE email_verification_tokens SET used = true WHERE id = $1',
      [tokenId]
    );

    // Mark user as verified
    await pool.query(
      'UPDATE users SET email_verified = true WHERE id = $1',
      [userId]
    );

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
