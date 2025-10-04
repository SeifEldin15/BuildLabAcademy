'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

interface VerificationStatus {
  hasVerification: boolean;
  status?: 'pending' | 'verified' | 'rejected';
  discountCode?: string;
  discountPercentage?: number;
  schoolName?: string;
  expiresAt?: string;
  verifiedAt?: string;
  createdAt?: string;
  isExpired?: boolean;
}

interface EmailCheckResult {
  isStudentEmail: boolean;
  schoolName?: string;
  country?: string;
  confidence?: string;
  message?: string;
}

type TabType = 'profile' | 'discounts';

export default function StudentPortal() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailCheckResult, setEmailCheckResult] = useState<EmailCheckResult | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    schoolName: '',
    graduationDate: '',
    studentId: '',
    verificationMethod: 'email'
  });

  useEffect(() => {
    if (session?.user?.email) {
      setFormData(prev => ({ ...prev, email: session.user?.email || '' }));
      fetchVerificationStatus();
    }
  }, [session]);

  const fetchVerificationStatus = async () => {
    try {
      const response = await fetch('/api/student-discount/apply');
      if (response.ok) {
        const data = await response.json();
        setVerificationStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch verification status:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEmail = async () => {
    if (!formData.email) return;

    setEmailChecking(true);
    try {
      const response = await fetch('/api/student-discount/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      const result = await response.json();
      setEmailCheckResult(result);
    } catch (error) {
      console.error('Email check failed:', error);
    } finally {
      setEmailChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplying(true);

    try {
      const response = await fetch('/api/student-discount/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchVerificationStatus();
        alert(result.message);
      } else {
        alert(result.error || 'Application failed');
      }
    } catch (error) {
      console.error('Application failed:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading student portal...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-center mb-4 text-black">Student Portal</h1>
          <p className="text-gray-600 text-center mb-6">
            Please log in to access the student discount portal.
          </p>
          <div className="text-center">
            <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              Log In
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg min-h-screen">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-black">Student Portal</h2>
          <p className="text-sm text-gray-600 mt-1">{session.user?.name}</p>
        </div>
        
        <nav className="p-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 flex items-center transition-colors ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </button>
          
          <button
            onClick={() => setActiveTab('discounts')}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 flex items-center transition-colors ${
              activeTab === 'discounts'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Student Discounts
          </button>

          <div className="mt-8 pt-4 border-t">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 flex items-center transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === 'profile' ? (
          <ProfileTab session={session} />
        ) : (
          <DiscountsTab
            verificationStatus={verificationStatus}
            formData={formData}
            setFormData={setFormData}
            emailCheckResult={emailCheckResult}
            emailChecking={emailChecking}
            applying={applying}
            checkEmail={checkEmail}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}

// Profile Tab Component
function ProfileTab({ session }: { session: any }) {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-black mb-6">My Profile</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-black">Account Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <p className="text-lg text-gray-900">{session?.user?.name || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-lg text-gray-900">{session?.user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <p className="text-lg text-gray-900">Student</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-black">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Courses Enrolled</p>
            <p className="text-2xl font-bold text-blue-900">0</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Completed</p>
            <p className="text-2xl font-bold text-green-900">0</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">In Progress</p>
            <p className="text-2xl font-bold text-purple-900">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Discounts Tab Component
interface DiscountsTabProps {
  verificationStatus: VerificationStatus | null;
  formData: any;
  setFormData: (data: any) => void;
  emailCheckResult: EmailCheckResult | null;
  emailChecking: boolean;
  applying: boolean;
  checkEmail: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

function DiscountsTab({
  verificationStatus,
  formData,
  setFormData,
  emailCheckResult,
  emailChecking,
  applying,
  checkEmail,
  handleSubmit
}: DiscountsTabProps) {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black mb-2">Student Discount Portal</h1>
        <p className="text-gray-600">Get verified and save 20% on Build Lab Academy courses!</p>
      </div>

        {/* Current Status */}
        {verificationStatus?.hasVerification ? (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-black">Your Verification Status</h2>
            
            {verificationStatus.status === 'verified' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-medium text-green-800">Verified Student</h3>
                    <p className="text-green-700">Congratulations! You have access to student discounts.</p>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Discount Code</p>
                    <p className="text-lg font-mono bg-gray-100 px-3 py-1 rounded border">
                      {verificationStatus.discountCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Discount Amount</p>
                    <p className="text-lg font-semibold text-green-600">
                      {verificationStatus.discountPercentage}% OFF
                    </p>
                  </div>
                  {verificationStatus.schoolName && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">School</p>
                      <p className="text-lg">{verificationStatus.schoolName}</p>
                    </div>
                  )}
                  {verificationStatus.expiresAt && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Expires</p>
                      <p className="text-lg">{new Date(verificationStatus.expiresAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">How to use your discount:</h4>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Add courses to your cart</li>
                    <li>2. Enter your discount code during checkout</li>
                    <li>3. Enjoy 20% off your total!</li>
                  </ol>
                </div>
              </div>
            ) : verificationStatus.status === 'pending' ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-medium text-yellow-800">Verification Pending</h3>
                    <p className="text-yellow-700">Your application is being reviewed. We'll notify you once it's processed.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-medium text-red-800">Verification Rejected</h3>
                    <p className="text-red-700">Your verification was not approved. You can apply again with additional documentation.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Application Form */}
        {!verificationStatus?.hasVerification || verificationStatus.status === 'rejected' ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Apply for Student Discount</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Check Section */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                  Student Email Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black"
                    placeholder="your-email@university.edu"
                    required
                  />
                  <button
                    type="button"
                    onClick={checkEmail}
                    disabled={emailChecking || !formData.email}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {emailChecking ? 'Checking...' : 'Check Email'}
                  </button>
                </div>
                
                {emailCheckResult && (
                  <div className={`mt-2 p-3 rounded-lg ${emailCheckResult.isStudentEmail ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                    <p className="font-medium">{emailCheckResult.message}</p>
                    {emailCheckResult.schoolName && (
                      <p className="text-sm mt-1">School: {emailCheckResult.schoolName}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-black mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black"
                    placeholder="First Name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-black mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black"
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>

              {/* School Information */}
              <div>
                <label htmlFor="schoolName" className="block text-sm font-medium text-black mb-2">
                  School/University Name (Optional)
                </label>
                <input
                  type="text"
                  id="schoolName"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black"
                  placeholder="University of Toronto"
                />
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="graduationDate" className="block text-sm font-medium text-black mb-2">
                    Expected Graduation Date (Optional)
                  </label>
                  <input
                    type="date"
                    id="graduationDate"
                    value={formData.graduationDate}
                    onChange={(e) => setFormData({ ...formData, graduationDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black"
                  />
                </div>
                <div>
                  <label htmlFor="studentId" className="block text-sm font-medium text-black mb-2">
                    Student ID (Optional)
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black"
                    placeholder="Student ID Number"
                  />
                </div>
              </div>

              {/* Verification Method */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Verification Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="verificationMethod"
                      value="email"
                      checked={formData.verificationMethod === 'email'}
                      onChange={(e) => setFormData({ ...formData, verificationMethod: e.target.value })}
                      className="mr-2"
                    />
                    <span className="text-black">Email Domain Verification (Instant for recognized domains)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="verificationMethod"
                      value="sheerid"
                      checked={formData.verificationMethod === 'sheerid'}
                      onChange={(e) => setFormData({ ...formData, verificationMethod: e.target.value })}
                      className="mr-2"
                    />
                    <span className="text-black">Third-party Verification (Most accurate, may require additional steps)</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={applying}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {applying ? 'Submitting Application...' : 'Apply for Student Discount'}
              </button>
            </form>
          </div>
        ) : null}

        {/* Information Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-black mb-3">About Student Discounts</h3>
          <div className="text-blue-800 space-y-2">
            <p>• <strong>20% discount</strong> on all Build Lab Academy courses</p>
            <p>• <strong>Instant verification</strong> for recognized educational email domains</p>
            <p>• <strong>Third-party verification</strong> available through SheerID for maximum accuracy</p>
            <p>• <strong>Valid for 1 year</strong> from verification date</p>
            <p>• Must be currently enrolled or recently graduated (within 2 years)</p>
          </div>
          
          <div className="mt-4 p-4 bg-white rounded border">
            <h4 className="font-medium text-black mb-2">Need Help?</h4>
            <p className="text-sm text-blue-700">
              If your school email isn't automatically recognized, don't worry! 
              Choose the third-party verification option or contact our support team 
              for manual verification.
            </p>
          </div>
        </div>
      </div>
    );
  }
