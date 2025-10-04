// Get discount information and validate discount codes
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { discountCode, orderAmount } = await request.json();

    if (!discountCode || !orderAmount) {
      return NextResponse.json(
        { error: 'Discount code and order amount are required' },
        { status: 400 }
      );
    }

    // Validate and get discount information
    const discountResult = await pool.query(
      `SELECT sv.id, sv.user_id, sv.discount_percentage, sv.expires_at, 
              sv.verification_status, u.email, u.name
       FROM student_verifications sv
       JOIN users u ON sv.user_id = u.id
       WHERE sv.discount_code = $1 AND sv.verification_status = 'verified'`,
      [discountCode]
    );

    if (discountResult.rows.length === 0) {
      return NextResponse.json(
        { 
          valid: false,
          error: 'Invalid or expired discount code' 
        },
        { status: 404 }
      );
    }

    const discount = discountResult.rows[0];

    // Check if discount is expired
    if (discount.expires_at && new Date() > new Date(discount.expires_at)) {
      return NextResponse.json(
        { 
          valid: false,
          error: 'This discount code has expired' 
        },
        { status: 400 }
      );
    }

    // Calculate discount amount
    const discountAmount = (parseFloat(orderAmount) * discount.discount_percentage) / 100;
    const finalAmount = parseFloat(orderAmount) - discountAmount;

    return NextResponse.json({
      valid: true,
      discountPercentage: discount.discount_percentage,
      originalAmount: parseFloat(orderAmount),
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalAmount: Math.round(finalAmount * 100) / 100,
      studentName: discount.name,
      expiresAt: discount.expires_at,
      verificationId: discount.id
    });

  } catch (error) {
    console.error('Get discount error:', error);
    return NextResponse.json(
      { error: 'Failed to validate discount code' },
      { status: 500 }
    );
  }
}

// Get user's current discount information
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Get current verified discount
    const discountResult = await pool.query(
      `SELECT discount_code, discount_percentage, expires_at, verified_at, school_name
       FROM student_verifications 
       WHERE user_id = $1 AND verification_status = 'verified'
       AND (expires_at IS NULL OR expires_at > NOW())
       ORDER BY verified_at DESC LIMIT 1`,
      [userId]
    );

    if (discountResult.rows.length === 0) {
      return NextResponse.json({
        hasDiscount: false,
        message: 'No active student discount found'
      });
    }

    const discount = discountResult.rows[0];

    // Get usage statistics
    const usageResult = await pool.query(
      `SELECT COUNT(*) as usage_count, 
              COALESCE(SUM(discount_amount), 0) as total_savings
       FROM discount_usage du
       JOIN student_verifications sv ON du.verification_id = sv.id
       WHERE sv.user_id = $1`,
      [userId]
    );

    const usage = usageResult.rows[0];

    return NextResponse.json({
      hasDiscount: true,
      discountCode: discount.discount_code,
      discountPercentage: discount.discount_percentage,
      schoolName: discount.school_name,
      expiresAt: discount.expires_at,
      verifiedAt: discount.verified_at,
      usageCount: parseInt(usage.usage_count),
      totalSavings: parseFloat(usage.total_savings)
    });

  } catch (error) {
    console.error('Get user discount error:', error);
    return NextResponse.json(
      { error: 'Failed to get discount information' },
      { status: 500 }
    );
  }
}
