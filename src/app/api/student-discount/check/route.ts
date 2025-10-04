// Check if an email is a student email (basic verification)
import { NextRequest, NextResponse } from 'next/server';
import { studentVerificationService } from '@/lib/studentVerification';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email is a student email
    const result = await studentVerificationService.verifyStudentEmail(email);

    return NextResponse.json({
      isStudentEmail: result.isStudentEmail,
      schoolName: result.schoolName,
      country: result.country,
      confidence: result.confidence,
      message: result.isStudentEmail 
        ? `Great! ${email} appears to be a student email${result.schoolName ? ` from ${result.schoolName}` : ''}.`
        : 'This email domain is not recognized as a student email. You can still apply for verification with additional documentation.'
    });

  } catch (error) {
    console.error('Student email check error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
