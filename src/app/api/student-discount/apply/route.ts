// Apply for student verification and discount
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import pool from '@/lib/db';
import { studentVerificationService } from '@/lib/studentVerification';

export async function POST(request: NextRequest) {
  try {
    // Get the session to verify authentication
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      email,
      firstName,
      lastName,
      schoolName,
      graduationDate,
      studentId,
      verificationMethod = 'email'
    } = await request.json();

    // Validate required fields
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, first name, and last name are required' },
        { status: 400 }
      );
    }

    // Get user ID from database
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [session.user.email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult.rows[0].id;

    // Check if user already has an active verification
    const existingVerification = await pool.query(
      `SELECT id, verification_status, discount_code, expires_at 
       FROM student_verifications 
       WHERE user_id = $1 AND verification_status IN ('verified', 'pending')
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    if (existingVerification.rows.length > 0) {
      const verification = existingVerification.rows[0];
      
      if (verification.verification_status === 'verified') {
        return NextResponse.json({
          success: true,
          message: 'You already have a verified student discount!',
          discountCode: verification.discount_code,
          status: 'verified'
        });
      }

      if (verification.verification_status === 'pending') {
        return NextResponse.json({
          success: true,
          message: 'Your verification is still pending. Please check back later.',
          status: 'pending'
        });
      }
    }

    let verificationData: any = {};
    let verificationStatus = 'pending';
    let discountCode = '';

    if (verificationMethod === 'email') {
      // Basic email verification
      const emailCheck = await studentVerificationService.verifyStudentEmail(email);
      
      if (emailCheck.isStudentEmail && emailCheck.confidence === 'high') {
        verificationStatus = 'verified';
        discountCode = studentVerificationService.generateDiscountCode(userId);
        verificationData = {
          method: 'email',
          confidence: emailCheck.confidence,
          schoolName: emailCheck.schoolName,
          country: emailCheck.country
        };
      } else {
        verificationData = {
          method: 'email',
          confidence: emailCheck.confidence,
          requiresManualReview: true
        };
      }
    } else if (verificationMethod === 'sheerid') {
      // SheerID verification
      try {
        const sheerIdResult = await studentVerificationService.initiateSheerIDVerification({
          email,
          firstName,
          lastName,
          schoolName,
          graduationDate,
          studentId
        });

        verificationData = {
          method: 'sheerid',
          token: sheerIdResult.token,
          verificationUrl: sheerIdResult.verificationUrl,
          metadata: sheerIdResult.metadata
        };

        if (sheerIdResult.status === 'verified') {
          verificationStatus = 'verified';
          discountCode = studentVerificationService.generateDiscountCode(userId);
        }
      } catch (error) {
        // Fallback to email verification if SheerID fails
        console.error('SheerID verification failed, falling back to email:', error);
        const emailCheck = await studentVerificationService.verifyStudentEmail(email);
        
        verificationData = {
          method: 'email_fallback',
          confidence: emailCheck.confidence,
          sheeridError: 'SheerID service unavailable'
        };
      }
    }

    // Insert verification record
    const insertResult = await pool.query(
      `INSERT INTO student_verifications (
        user_id, email, full_name, school_name, graduation_date, student_id,
        verification_method, verification_status, verification_data, discount_code,
        verified_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, verification_status, discount_code`,
      [
        userId,
        email,
        `${firstName} ${lastName}`,
        schoolName || verificationData.schoolName,
        graduationDate ? new Date(graduationDate) : null,
        studentId,
        verificationMethod,
        verificationStatus,
        JSON.stringify(verificationData),
        discountCode,
        verificationStatus === 'verified' ? new Date() : null
      ]
    );

    const verificationId = insertResult.rows[0].id;

    // Log the verification attempt
    await pool.query(
      `INSERT INTO student_verification_logs (verification_id, action, details)
       VALUES ($1, $2, $3)`,
      [verificationId, 'created', JSON.stringify({ method: verificationMethod })]
    );

    // Prepare response
    const response: any = {
      success: true,
      verificationId,
      status: verificationStatus,
    };

    if (verificationStatus === 'verified') {
      response.message = 'Congratulations! Your student status has been verified. You now have access to a 20% student discount!';
      response.discountCode = discountCode;
      response.discountPercentage = 20;
    } else {
      response.message = 'Your verification application has been submitted and is under review. You will be notified once it\'s processed.';
      
      if (verificationData.verificationUrl) {
        response.verificationUrl = verificationData.verificationUrl;
        response.message += ' You may also complete additional verification steps using the provided link.';
      }
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Student verification application error:', error);
    return NextResponse.json(
      { error: 'Failed to submit verification application' },
      { status: 500 }
    );
  }
}

// Get user's current verification status
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

    // Get current verification status
    const verificationResult = await pool.query(
      `SELECT id, verification_status, discount_code, discount_percentage, 
              expires_at, verified_at, created_at, school_name
       FROM student_verifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    if (verificationResult.rows.length === 0) {
      return NextResponse.json({
        hasVerification: false,
        message: 'No student verification found. Apply for student discount to get started!'
      });
    }

    const verification = verificationResult.rows[0];
    
    return NextResponse.json({
      hasVerification: true,
      status: verification.verification_status,
      discountCode: verification.discount_code,
      discountPercentage: verification.discount_percentage,
      schoolName: verification.school_name,
      expiresAt: verification.expires_at,
      verifiedAt: verification.verified_at,
      createdAt: verification.created_at,
      isExpired: verification.expires_at && new Date() > new Date(verification.expires_at),
    });

  } catch (error) {
    console.error('Get verification status error:', error);
    return NextResponse.json(
      { error: 'Failed to get verification status' },
      { status: 500 }
    );
  }
}
