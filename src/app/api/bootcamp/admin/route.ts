import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Get all registrations for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminSecret = searchParams.get('adminSecret');
    const cohortId = searchParams.get('cohortId') || '1';
    const status = searchParams.get('status');

    // Simple admin authentication
    if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let query = `
      SELECT 
        r.*,
        c.cohort_name,
        c.start_date,
        c.regular_price,
        c.discounted_price,
        c.early_bird_discount,
        (SELECT COUNT(*) FROM registration_contact_log WHERE registration_id = r.id) as contact_attempts
      FROM early_registrations r
      JOIN bootcamp_cohorts c ON r.cohort_id = c.id
      WHERE r.cohort_id = $1
    `;

    const params: any[] = [cohortId];

    if (status) {
      query += ` AND r.status = $2`;
      params.push(status);
    }

    query += ` ORDER BY r.created_at DESC`;

    const result = await pool.query(query, params);

    // Get summary statistics
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_interested,
        COUNT(CASE WHEN has_paid_holding_fee = true THEN 1 END) as paid_holding_fees,
        COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_deals,
        SUM(CASE WHEN has_paid_holding_fee = true THEN amount_paid ELSE 0 END) as total_revenue
      FROM early_registrations
      WHERE cohort_id = $1
    `, [cohortId]);

    return NextResponse.json({
      success: true,
      registrations: result.rows,
      statistics: stats.rows[0]
    });

  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

// POST - Add contact log entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      adminSecret,
      registrationId,
      contactType,
      contactedBy,
      notes,
      outcome,
      nextAction,
      nextContactDate
    } = body;

    // Simple admin authentication
    if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Add contact log entry
    await pool.query(
      `INSERT INTO registration_contact_log (
        registration_id, contact_type, contacted_by, notes, outcome, next_action, next_contact_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [registrationId, contactType, contactedBy, notes, outcome, nextAction, nextContactDate]
    );

    // Update registration
    const updateData: any = {
      lastContactedAt: 'CURRENT_TIMESTAMP',
      contactCount: 'contact_count + 1'
    };

    if (nextContactDate) {
      updateData.nextFollowUpDate = nextContactDate;
    }

    if (outcome === 'closed-deal') {
      updateData.status = 'closed';
    } else if (outcome === 'not-interested') {
      updateData.status = 'withdrawn';
    } else {
      updateData.status = 'contacted';
    }

    await pool.query(
      `UPDATE early_registrations 
       SET last_contacted_at = CURRENT_TIMESTAMP,
           contact_count = contact_count + 1,
           next_follow_up_date = $1,
           status = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [nextContactDate || null, updateData.status, registrationId]
    );

    return NextResponse.json({
      success: true,
      message: 'Contact log added successfully'
    });

  } catch (error) {
    console.error('Error adding contact log:', error);
    return NextResponse.json(
      { error: 'Failed to add contact log' },
      { status: 500 }
    );
  }
}

// PUT - Update registration (assign closer, update notes, etc.)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      adminSecret,
      registrationId,
      assignedCloser,
      closerNotes,
      status
    } = body;

    // Simple admin authentication
    if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (assignedCloser !== undefined) {
      updates.push(`assigned_closer = $${paramIndex++}`);
      params.push(assignedCloser);
    }

    if (closerNotes !== undefined) {
      updates.push(`closer_notes = $${paramIndex++}`);
      params.push(closerNotes);
    }

    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No updates provided' },
        { status: 400 }
      );
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(registrationId);

    await pool.query(
      `UPDATE early_registrations SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      params
    );

    return NextResponse.json({
      success: true,
      message: 'Registration updated successfully'
    });

  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    );
  }
}
