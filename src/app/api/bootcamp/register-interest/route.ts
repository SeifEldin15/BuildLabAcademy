import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// POST - Express interest in the bootcamp (no payment)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      cohortId = 1, // Default to April 2026 cohort
      email,
      firstName,
      lastName,
      phone,
      ageRange,
      currentOccupation,
      educationLevel,
      programmingExperience,
      motivation,
      howDidYouHear,
      utmSource,
      utmMedium,
      utmCampaign,
      referralCode
    } = body;

    // Validate required fields
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, first name, and last name are required' },
        { status: 400 }
      );
    }

    // Check if already registered
    const existingCheck = await pool.query(
      'SELECT id, status FROM early_registrations WHERE cohort_id = $1 AND email = $2',
      [cohortId, email]
    );

    if (existingCheck.rows.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'You have already expressed interest in this bootcamp',
          registration: existingCheck.rows[0]
        },
        { status: 409 }
      );
    }

    // Insert registration
    const result = await pool.query(
      `INSERT INTO early_registrations (
        cohort_id, email, first_name, last_name, phone,
        age_range, current_occupation, education_level,
        programming_experience, motivation, how_did_you_hear,
        utm_source, utm_medium, utm_campaign, referral_code,
        status, registration_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'interested', 'interest')
      RETURNING *`,
      [
        cohortId, email, firstName, lastName, phone,
        ageRange, currentOccupation, educationLevel,
        programmingExperience, motivation, howDidYouHear,
        utmSource, utmMedium, utmCampaign, referralCode
      ]
    );

    // TODO: Send confirmation email
    // TODO: Notify admin/closer of new interest

    return NextResponse.json({
      success: true,
      message: 'Thank you for your interest! Our team will be in touch soon.',
      registration: result.rows[0]
    });

  } catch (error) {
    console.error('Error registering interest:', error);
    return NextResponse.json(
      { error: 'Failed to register interest' },
      { status: 500 }
    );
  }
}

// GET - Get cohort information
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cohortId = searchParams.get('cohortId') || '1';

    const result = await pool.query(
      'SELECT * FROM bootcamp_cohorts WHERE id = $1',
      [cohortId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Cohort not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      cohort: result.rows[0]
    });

  } catch (error) {
    console.error('Error fetching cohort:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cohort information' },
      { status: 500 }
    );
  }
}
