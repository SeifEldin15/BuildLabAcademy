// Record discount usage after successful payment
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      verificationId,
      orderId,
      discountAmount,
      originalAmount,
      finalAmount,
      currency = 'USD'
    } = await request.json();

    // Validate required fields
    if (!verificationId || !orderId || discountAmount === undefined || !originalAmount || finalAmount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields for usage recording' },
        { status: 400 }
      );
    }

    // Get user ID
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [session.user.email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult.rows[0].id;

    // Verify the verification belongs to the user
    const verificationResult = await pool.query(
      'SELECT id FROM student_verifications WHERE id = $1 AND user_id = $2',
      [verificationId, userId]
    );

    if (verificationResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid verification ID' },
        { status: 400 }
      );
    }

    // Check if this order has already been recorded
    const existingUsage = await pool.query(
      'SELECT id FROM discount_usage WHERE order_id = $1 AND user_id = $2',
      [orderId, userId]
    );

    if (existingUsage.rows.length > 0) {
      return NextResponse.json(
        { error: 'Discount usage for this order has already been recorded' },
        { status: 409 }
      );
    }

    // Record the discount usage
    const usageResult = await pool.query(
      `INSERT INTO discount_usage (
        verification_id, user_id, order_id, discount_amount, 
        original_amount, final_amount, currency
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id`,
      [
        verificationId,
        userId,
        orderId,
        discountAmount,
        originalAmount,
        finalAmount,
        currency
      ]
    );

    // Log the usage
    await pool.query(
      `INSERT INTO student_verification_logs (verification_id, action, details)
       VALUES ($1, $2, $3)`,
      [
        verificationId,
        'discount_used',
        JSON.stringify({
          orderId,
          discountAmount,
          originalAmount,
          finalAmount,
          currency
        })
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Discount usage recorded successfully',
      usageId: usageResult.rows[0].id,
      savings: discountAmount
    });

  } catch (error) {
    console.error('Record discount usage error:', error);
    return NextResponse.json(
      { error: 'Failed to record discount usage' },
      { status: 500 }
    );
  }
}
