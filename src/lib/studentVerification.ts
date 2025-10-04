// Student Verification Service using SheerID
// SheerID is a leading student verification service used by companies like Spotify, Adobe, etc.

import axios from 'axios';

// Types for student verification
export interface StudentVerificationRequest {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  schoolName?: string;
  graduationDate?: string;
  studentId?: string;
}

export interface SheerIDVerificationResponse {
  token: string;
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  verificationUrl?: string;
  metadata?: {
    schoolName?: string;
    enrollmentStatus?: string;
    graduationDate?: string;
  };
}

export interface BasicEmailVerificationResult {
  isStudentEmail: boolean;
  schoolName?: string;
  country?: string;
  confidence: 'high' | 'medium' | 'low';
}

class StudentVerificationService {
  private sheerIdApiUrl = process.env.SHEERID_API_URL || 'https://services.sheerid.com/rest/v2';
  private sheerIdAccessToken = process.env.SHEERID_ACCESS_TOKEN;
  private sheerIdProgramId = process.env.SHEERID_PROGRAM_ID;

  // Method 1: Basic email domain verification (free, instant)
  async verifyStudentEmail(email: string): Promise<BasicEmailVerificationResult> {
    const domain = email.split('@')[1]?.toLowerCase();
    
    if (!domain) {
      return { isStudentEmail: false, confidence: 'high' };
    }

    // Check against our database of known student domains
    const pool = await import('@/lib/db').then(module => module.default);
    
    try {
      const result = await pool.query(
        'SELECT school_name, country, verification_level FROM student_email_domains WHERE domain = $1 AND is_active = true',
        [`@${domain}`]
      );

      if (result.rows.length > 0) {
        const { school_name, country, verification_level } = result.rows[0];
        return {
          isStudentEmail: true,
          schoolName: school_name,
          country: country,
          confidence: verification_level === 'verified' ? 'high' : 'medium'
        };
      }

      // Check for common student email patterns
      if (this.isLikelyStudentDomain(domain)) {
        return {
          isStudentEmail: true,
          confidence: 'low'
        };
      }

      return { isStudentEmail: false, confidence: 'high' };
    } catch (error) {
      console.error('Error checking student email:', error);
      return { isStudentEmail: false, confidence: 'low' };
    }
  }

  // Method 2: SheerID verification (paid service, high accuracy)
  async initiateSheerIDVerification(request: StudentVerificationRequest): Promise<SheerIDVerificationResponse> {
    if (!this.sheerIdAccessToken || !this.sheerIdProgramId) {
      throw new Error('SheerID not configured. Please set SHEERID_ACCESS_TOKEN and SHEERID_PROGRAM_ID environment variables.');
    }

    try {
      const response = await axios.post(
        `${this.sheerIdApiUrl}/verification`,
        {
          programId: this.sheerIdProgramId,
          personInfo: {
            firstName: request.firstName,
            lastName: request.lastName,
            email: request.email,
            dateOfBirth: request.dateOfBirth,
          },
          organizationInfo: {
            name: request.schoolName,
          },
          metadata: {
            studentId: request.studentId,
            graduationDate: request.graduationDate,
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.sheerIdAccessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        token: response.data.token,
        status: response.data.status,
        verificationUrl: response.data.verificationUrl,
        metadata: response.data.metadata,
      };
    } catch (error) {
      console.error('SheerID verification error:', error);
      throw new Error('Failed to initiate SheerID verification');
    }
  }

  // Check SheerID verification status
  async checkSheerIDStatus(token: string): Promise<SheerIDVerificationResponse> {
    if (!this.sheerIdAccessToken) {
      throw new Error('SheerID not configured');
    }

    try {
      const response = await axios.get(
        `${this.sheerIdApiUrl}/verification/${token}`,
        {
          headers: {
            'Authorization': `Bearer ${this.sheerIdAccessToken}`,
          },
        }
      );

      return {
        token: response.data.token,
        status: response.data.status,
        metadata: response.data.metadata,
      };
    } catch (error) {
      console.error('SheerID status check error:', error);
      throw new Error('Failed to check SheerID verification status');
    }
  }

  // Generate a unique discount code for verified students
  generateDiscountCode(userId: string): string {
    const timestamp = Date.now().toString(36);
    const userHash = userId.slice(0, 8);
    return `STUDENT-${userHash}-${timestamp}`.toUpperCase();
  }

  // Helper method to detect likely student domains
  private isLikelyStudentDomain(domain: string): boolean {
    const studentPatterns = [
      /\.edu$/,           // US educational institutions
      /\.edu\./,          // US educational subdomains
      /\.ac\./,           // Academic institutions (UK, etc.)
      /student\./,        // Contains "student"
      /uni\./,            // Contains "uni" (university)
      /college\./,        // Contains "college"
      /\.edu\.au$/,       // Australian universities
      /\.edu\.ca$/,       // Canadian universities
      /\.edu\.uk$/,       // UK universities
      /school\./,         // Contains "school"
    ];

    return studentPatterns.some(pattern => pattern.test(domain));
  }

  // Alternative services integration (for backup/comparison)
  
  // UNiDAYS integration (if you prefer UNiDAYS over SheerID)
  async verifyWithUnidays(email: string, firstName: string, lastName: string): Promise<any> {
    // Implementation would go here if you choose to use UNiDAYS
    // This is just a placeholder for potential future integration
    throw new Error('UNiDAYS integration not implemented yet');
  }

  // Student Beans integration (another alternative)
  async verifyWithStudentBeans(email: string): Promise<any> {
    // Implementation would go here if you choose to use Student Beans
    // This is just a placeholder for potential future integration
    throw new Error('Student Beans integration not implemented yet');
  }
}

// Create singleton instance
export const studentVerificationService = new StudentVerificationService();

// Export types and service
export default studentVerificationService;
