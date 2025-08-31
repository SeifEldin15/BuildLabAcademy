import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword, generateVerificationCode } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, name, password } = await request.json();

    // Validate input
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const userCheck = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userResult = await pool.query(
      'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [email, name, passwordHash]
    );

    const userId = userResult.rows[0].id;

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save verification code
    await pool.query(
      'INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, verificationCode, expiresAt]
    );

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json(
      { message: 'User created successfully. Please check your email for verification code.' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
