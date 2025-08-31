import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json();

    // Validate input
    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: 'Email, verification code, and new password are required' },
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

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [passwordHash, userId]
    );

    // Mark token as used
    await pool.query(
      'UPDATE email_verification_tokens SET used = true WHERE id = $1',
      [tokenId]
    );

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
