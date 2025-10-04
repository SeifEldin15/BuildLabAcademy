// Admin routes for managing student verifications
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('adminKey');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Simple admin authentication
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let query = `
      SELECT sv.id, sv.email, sv.full_name, sv.school_name, sv.verification_status,
             sv.discount_code, sv.discount_percentage, sv.created_at, sv.verified_at,
             sv.expires_at, u.name as user_name
      FROM student_verifications sv
      JOIN users u ON sv.user_id = u.id
    `;

    const params: any[] = [];
    
    if (status) {
      query += ' WHERE sv.verification_status = $1';
      params.push(status);
    }

    query += ' ORDER BY sv.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get totals
    const totalQuery = status 
      ? 'SELECT COUNT(*) FROM student_verifications WHERE verification_status = $1'
      : 'SELECT COUNT(*) FROM student_verifications';
    
    const totalResult = await pool.query(
      totalQuery, 
      status ? [status] : []
    );

    return NextResponse.json({
      verifications: result.rows,
      total: parseInt(totalResult.rows[0].count),
      limit,
      offset
    });

  } catch (error) {
    console.error('Admin get verifications error:', error);
    return NextResponse.json(
      { error: 'Failed to get verifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, verificationId, adminKey, notes } = await request.json();

    // Simple admin authentication
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!action || !verificationId) {
      return NextResponse.json(
        { error: 'Action and verification ID are required' },
        { status: 400 }
      );
    }

    let updateQuery = '';
    let updateParams: any[] = [];
    let logAction = '';

    switch (action) {
      case 'approve':
        // Generate discount code if not exists
        const discountCodeResult = await pool.query(
          'SELECT discount_code, user_id FROM student_verifications WHERE id = $1',
          [verificationId]
        );

        if (discountCodeResult.rows.length === 0) {
          return NextResponse.json({ error: 'Verification not found' }, { status: 404 });
        }

        let discountCode = discountCodeResult.rows[0].discount_code;
        const userId = discountCodeResult.rows[0].user_id;

        if (!discountCode) {
          const { studentVerificationService } = await import('@/lib/studentVerification');
          discountCode = studentVerificationService.generateDiscountCode(userId);
        }

        updateQuery = `
          UPDATE student_verifications 
          SET verification_status = 'verified', 
              verified_at = NOW(),
              discount_code = $2
          WHERE id = $1
        `;
        updateParams = [verificationId, discountCode];
        logAction = 'manually_approved';
        break;

      case 'reject':
        updateQuery = `
          UPDATE student_verifications 
          SET verification_status = 'rejected'
          WHERE id = $1
        `;
        updateParams = [verificationId];
        logAction = 'manually_rejected';
        break;

      case 'reset':
        updateQuery = `
          UPDATE student_verifications 
          SET verification_status = 'pending',
              verified_at = NULL
          WHERE id = $1
        `;
        updateParams = [verificationId];
        logAction = 'manually_reset';
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update verification
    await pool.query(updateQuery, updateParams);

    // Log the action
    await pool.query(
      `INSERT INTO student_verification_logs (verification_id, action, details)
       VALUES ($1, $2, $3)`,
      [
        verificationId,
        logAction,
        JSON.stringify({ adminAction: true, notes: notes || '' })
      ]
    );

    return NextResponse.json({
      success: true,
      message: `Verification ${action}ed successfully`
    });

  } catch (error) {
    console.error('Admin action error:', error);
    return NextResponse.json(
      { error: 'Failed to perform admin action' },
      { status: 500 }
    );
  }
}

// Get verification statistics
export async function PUT(request: NextRequest) {
  try {
    const { adminKey } = await request.json();

    // Simple admin authentication
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get statistics
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE verification_status = 'pending') as pending_count,
        COUNT(*) FILTER (WHERE verification_status = 'verified') as verified_count,
        COUNT(*) FILTER (WHERE verification_status = 'rejected') as rejected_count,
        COUNT(*) as total_count,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as recent_count
      FROM student_verifications
    `);

    const usageResult = await pool.query(`
      SELECT 
        COUNT(*) as total_usage,
        COALESCE(SUM(discount_amount), 0) as total_discount_amount,
        COUNT(DISTINCT user_id) as unique_users
      FROM discount_usage
    `);

    const topSchoolsResult = await pool.query(`
      SELECT school_name, COUNT(*) as count
      FROM student_verifications
      WHERE verification_status = 'verified' AND school_name IS NOT NULL
      GROUP BY school_name
      ORDER BY count DESC
      LIMIT 10
    `);

    return NextResponse.json({
      verifications: statsResult.rows[0],
      usage: usageResult.rows[0],
      topSchools: topSchoolsResult.rows
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get statistics' },
      { status: 500 }
    );
  }
}
