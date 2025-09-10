import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    // Get the session to verify authentication
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applicationData = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'courseType', 'interest', 'additionalInfo', 'workExperience',
      'existingSkills', 'teamRole', 'canCommit', 'hasSteelBoots',
      'interestedInBootcamp', 'finalComments'
    ];
    
    for (const field of requiredFields) {
      if (applicationData[field] === undefined || applicationData[field] === null) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Get user ID from database
    const getUserCommand = `docker exec buildlab_postgres psql -U buildlab_user -d buildlab_db -c "SELECT id FROM users WHERE email = '${session.user.email}';" -t`;
    const { stdout: userResult } = await execPromise(getUserCommand);
    const userId = userResult.trim();

    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Escape single quotes in text fields
    const escapeQuotes = (str: string) => str.replace(/'/g, "''");

    // Insert application into database
    const insertCommand = `docker exec buildlab_postgres psql -U buildlab_user -d buildlab_db -c "
      INSERT INTO applications (
        user_id, course_type, interest, additional_info, work_experience,
        existing_skills, team_role, can_commit, has_steel_boots,
        interested_in_bootcamp, final_comments
      ) VALUES (
        '${userId}',
        '${applicationData.courseType}',
        '${escapeQuotes(applicationData.interest)}',
        '${escapeQuotes(applicationData.additionalInfo)}',
        '${escapeQuotes(applicationData.workExperience)}',
        '${escapeQuotes(applicationData.existingSkills)}',
        '${escapeQuotes(applicationData.teamRole)}',
        ${applicationData.canCommit},
        ${applicationData.hasSteelBoots},
        ${applicationData.interestedInBootcamp},
        '${escapeQuotes(applicationData.finalComments)}'
      );"`;

    await execPromise(insertCommand);

    // Generate a simple application ID for email reference
    const applicationId = `APP-${Date.now()}-${userId.slice(0, 8)}`;

    // Send email notification
    try {
      const emailData = {
        applicantEmail: session.user.email,
        applicantName: session.user.name || 'Unknown',
        applicationData: applicationData,
        applicationId: applicationId.trim()
      };

      // Send email using nodemailer
      await sendApplicationEmail(emailData);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the request if email fails, but log it
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully',
      applicationId: applicationId.trim()
    });

  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

async function sendApplicationEmail(emailData: any) {
  const nodemailer = require('nodemailer');

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Email content
  const htmlContent = `
    <h2>New Application Submission - Build Lab Academy</h2>
    
    <h3>Applicant Information:</h3>
    <p><strong>Name:</strong> ${emailData.applicantName}</p>
    <p><strong>Email:</strong> ${emailData.applicantEmail}</p>
    <p><strong>Application ID:</strong> ${emailData.applicationId}</p>
    <p><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</p>
    
    <h3>Application Details:</h3>
    <p><strong>Course Type:</strong> ${emailData.applicationData.courseType}</p>
    
    <p><strong>Why interested in construction boot camp:</strong></p>
    <p>${emailData.applicationData.interest}</p>
    
    <p><strong>Additional Information:</strong></p>
    <p>${emailData.applicationData.additionalInfo}</p>
    
    <p><strong>Work Experience:</strong></p>
    <p>${emailData.applicationData.workExperience}</p>
    
    <p><strong>Existing Skills:</strong></p>
    <p>${emailData.applicationData.existingSkills}</p>
    
    <p><strong>Team Role & Feedback Approach:</strong></p>
    <p>${emailData.applicationData.teamRole}</p>
    
    <p><strong>Can commit to full schedule:</strong> ${emailData.applicationData.canCommit ? 'Yes' : 'No'}</p>
    <p><strong>Has/willing to get steel boots:</strong> ${emailData.applicationData.hasSteelBoots ? 'Yes' : 'No'}</p>
    <p><strong>Interested in bootcamp:</strong> ${emailData.applicationData.interestedInBootcamp ? 'Yes' : 'No'}</p>
    
    <p><strong>Final Comments:</strong></p>
    <p>${emailData.applicationData.finalComments}</p>
  `;

  // Send email
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `New Application: ${emailData.applicantName} - Build Lab Academy`,
    html: htmlContent
  });
}
