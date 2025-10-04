'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import StripePayment from '@/components/StripePayment';

interface ApplicationData {
  courseType: 'group' | 'individual' | '';
  interest: string;
  additionalInfo: string;
  workExperience: string;
  existingSkills: string;
  teamRole: string;
  canCommit: boolean | null;
  hasSteelBoots: boolean | null;
  interestedInBootcamp: boolean | null;
  finalComments: string;
  paymentMethod: string;
  paymentCompleted: boolean;
  paymentIntentId?: string;
}

export default function ApplyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ApplicationData>({
    courseType: '',
    interest: '',
    additionalInfo: '',
    workExperience: '',
    existingSkills: '',
    teamRole: '',
    canCommit: null,
    hasSteelBoots: null,
    interestedInBootcamp: null,
    finalComments: '',
    paymentMethod: 'stripe',
    paymentCompleted: false
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (!session) {
      router.push('/login?callbackUrl=' + encodeURIComponent('/apply'));
    }
  }, [session, status, router]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!session) {
    return null;
  }

  const steps = [
    { id: 1, name: 'Interest', active: currentStep >= 1, completed: currentStep > 1 },
    { id: 2, name: 'Interest cont.', active: currentStep >= 2, completed: currentStep > 2 },
    { id: 3, name: 'Final Questions', active: currentStep >= 3, completed: currentStep > 3 },
    { id: 4, name: 'Final Questions', active: currentStep >= 4, completed: currentStep > 4 },
    { id: 5, name: 'Review', active: currentStep >= 5, completed: currentStep > 5 },
    { id: 6, name: 'Payment', active: currentStep >= 6, completed: currentStep > 6 },
    { id: 7, name: 'Complete', active: currentStep >= 7, completed: false }
  ];

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1 && !formData.courseType) {
      alert('Please select a course type (Group or Individual)');
      return;
    }
    
    if (currentStep === 2) {
      if (!formData.interest.trim()) {
        alert('Please tell us why you are interested in this construction boot camp');
        return;
      }
      if (!formData.additionalInfo.trim()) {
        alert('Please provide additional information about yourself');
        return;
      }
    }
    
    if (currentStep === 3) {
      if (!formData.workExperience.trim()) {
        alert('Please describe your work experience (or write "None" if you have no experience)');
        return;
      }
      if (!formData.existingSkills.trim()) {
        alert('Please list your existing skills (or write "None" if you have no relevant skills)');
        return;
      }
      if (!formData.teamRole.trim()) {
        alert('Please describe your team role and approach to feedback');
        return;
      }
    }
    
    if (currentStep === 4) {
      if (formData.canCommit === null) {
        alert('Please answer if you can commit to the full schedule');
        return;
      }
      if (formData.hasSteelBoots === null) {
        alert('Please answer if you have or are willing to get steel-toed boots');
        return;
      }
      if (formData.interestedInBootcamp === null) {
        alert('Please answer if you are interested in this construction boot camp');
        return;
      }
      if (!formData.finalComments.trim()) {
        alert('Please provide any final comments (or write "None" if you have no additional comments)');
        return;
      }
    }

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: keyof ApplicationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setFormData(prev => ({
      ...prev,
      paymentCompleted: true,
      paymentIntentId
    }));
    setCurrentStep(7); // Move to success page
    handleSubmit();
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment failed: ${error}`);
  };

  const handleSubmit = async () => {
    if (isSubmitting || isSubmitted) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit application');
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(`Failed to submit application: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                What type of courses want to book <span className="text-red-500">*</span>
              </h2>
            </div>
            
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => handleInputChange('courseType', 'group')}
                className={`rounded-full font-medium transition-all duration-200 flex items-center space-x-2 border-2 ${
                  formData.courseType === 'group'
                    ? 'px-8 py-4 bg-accent-color text-black border-accent-color shadow-lg transform scale-102'
                    : 'px-8 py-4 bg-button-color-2 text-black hover:bg-main-color border-transparent'
                }`}
              >
                <Image src="/Group.png" alt="Group" width={24} height={24} />
                <span>Group</span>
              </button>
              <button
                onClick={() => handleInputChange('courseType', 'individual')}
                className={`rounded-full font-medium transition-all duration-200 flex items-center space-x-2 border-2 ${
                  formData.courseType === 'individual'
                    ? 'px-8 py-4 bg-main-color text-white border-main-color shadow-lg transform scale-102'
                    : 'px-8 py-4 bg-button-color-1 text-black hover:bg-secondary-color border-transparent'
                }`}
              >
                <Image src="/Individual.png" alt="Individual" width={24} height={24} />
                <span>Individual</span>
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Why are you interested in this construction boot camp? <span className="text-red-500">*</span>
              </h3>
              <textarea
                value={formData.interest}
                onChange={(e) => handleInputChange('interest', e.target.value)}
                placeholder="Tell us about your interest..."
                className="w-full p-6 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 placeholder-black"
                rows={5}
                required
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Is there anything else you'd like us to know about you or your interest in this program? <span className="text-red-500">*</span>
              </h3>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                placeholder="Share additional information..."
                className="w-full p-6 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 placeholder-black"
                rows={5}
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Have you ever worked on a construction site or in a trade (e.g., plumbing, carpentry, electrical)? If yes, please describe. <span className="text-red-500">*</span>
              </h3>
              <textarea
                value={formData.workExperience}
                onChange={(e) => handleInputChange('workExperience', e.target.value)}
                placeholder="Describe your work experience or write 'None' if you have no experience..."
                className="w-full p-6 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 placeholder-black"
                rows={4}
                required
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                What skills do you already have related to construction, tools, or physical work? <span className="text-red-500">*</span>
              </h3>
              <textarea
                value={formData.existingSkills}
                onChange={(e) => handleInputChange('existingSkills', e.target.value)}
                placeholder="List your relevant skills or write 'None' if you have no relevant skills..."
                className="w-full p-6 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 placeholder-black"
                rows={4}
                required
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                You'll be working in a team environment. What role do you typically play on a team? How do you handle feedback or correction? <span className="text-red-500">*</span>
              </h3>
              <textarea
                value={formData.teamRole}
                onChange={(e) => handleInputChange('teamRole', e.target.value)}
                placeholder="Describe your team role and approach to feedback..."
                className="w-full p-6 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 placeholder-black"
                rows={4}
                required
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                The program requires hands-on attendance for 40 weeks/hours plus extra time required by you. Are you able to commit to the full schedule? <span className="text-red-500">*</span>
              </h3>
              <div className="space-y-4">
                <label className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="canCommit"
                    checked={formData.canCommit === true}
                    onChange={() => handleInputChange('canCommit', true)}
                    className="mr-4 h-5 w-5 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="text-lg text-gray-700">Yes</span>
                </label>
                <label className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="canCommit"
                    checked={formData.canCommit === false}
                    onChange={() => handleInputChange('canCommit', false)}
                    className="mr-4 h-5 w-5 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="text-lg text-gray-700">No</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Do you have steel-toed boots or are you willing to get them? <span className="text-red-500">*</span>
              </h3>
              <div className="space-y-4">
                <label className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="hasSteelBoots"
                    checked={formData.hasSteelBoots === true}
                    onChange={() => handleInputChange('hasSteelBoots', true)}
                    className="mr-4 h-5 w-5 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="text-lg text-gray-700">Yes</span>
                </label>
                <label className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="hasSteelBoots"
                    checked={formData.hasSteelBoots === false}
                    onChange={() => handleInputChange('hasSteelBoots', false)}
                    className="mr-4 h-5 w-5 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="text-lg text-gray-700">No</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Are you interested in this construction boot camp or individual class? <span className="text-red-500">*</span>
              </h3>
              <div className="space-y-4">
                <label className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="interestedInBootcamp"
                    checked={formData.interestedInBootcamp === true}
                    onChange={() => handleInputChange('interestedInBootcamp', true)}
                    className="mr-4 h-5 w-5 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="text-lg text-gray-700">Yes</span>
                </label>
                <label className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="interestedInBootcamp"
                    checked={formData.interestedInBootcamp === false}
                    onChange={() => handleInputChange('interestedInBootcamp', false)}
                    className="mr-4 h-5 w-5 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="text-lg text-gray-700">No</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Is there anything else you'd like us to know about you or your interest in this program? <span className="text-red-500">*</span>
              </h3>
              <textarea
                value={formData.finalComments}
                onChange={(e) => handleInputChange('finalComments', e.target.value)}
                placeholder="Share any additional comments or write 'None' if you have no additional comments..."
                className="w-full p-6 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 placeholder-black"
                rows={5}
                required
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6 text-black">Review Your Application</h3>
            <div className="space-y-4 text-left text-black">
              <div><strong>Course Type:</strong> {formData.courseType}</div>
              <div><strong>Interest:</strong> {formData.interest}</div>
              <div><strong>Additional Info:</strong> {formData.additionalInfo}</div>
              <div><strong>Work Experience:</strong> {formData.workExperience}</div>
              <div><strong>Existing Skills:</strong> {formData.existingSkills}</div>
              <div><strong>Team Role:</strong> {formData.teamRole}</div>
              <div><strong>Can Commit:</strong> {formData.canCommit ? 'Yes' : 'No'}</div>
              <div><strong>Has Steel Boots:</strong> {formData.hasSteelBoots ? 'Yes' : 'No'}</div>
              <div><strong>Interested in Bootcamp:</strong> {formData.interestedInBootcamp ? 'Yes' : 'No'}</div>
              <div><strong>Final Comments:</strong> {formData.finalComments}</div>
            </div>
            <div className="pt-6 text-center">
              <p className="text-lg text-gray-600 mb-4">
                Please review your information above, then proceed to payment.
              </p>
              <p className="text-2xl font-bold text-green-600">
                Total: ${formData.courseType === 'individual' ? '500' : '300'}.00
              </p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <StripePayment
              courseType={formData.courseType as 'group' | 'individual'}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </div>
        );

      case 7:
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <h3 className="text-3xl font-bold text-green-600">Thank You!</h3>
            <p className="text-lg">Your application has been submitted successfully. We'll be in touch soon!</p>
            <Link 
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-apply-bg">
      {/* Original Navbar */}
      <Navbar />
      
      {/* Main Content with Sidebar */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-1/4 bg-apply-bg p-8 min-h-screen">
          <h1 className="text-4xl font-bold text-black mb-12">
            {currentStep === 1 ? 'Interest' : 
             currentStep === 2 ? 'Interest' : 
             currentStep === 3 ? 'Final Questions' : 
             currentStep === 4 ? 'Final Questions' : 
             currentStep === 5 ? 'Review' : 
             currentStep === 6 ? 'Payment' : 'Complete'}
          </h1>
          
          <div className="space-y-0">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                <div className="flex items-center space-x-3 py-1">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center relative ${
                    step.active || step.completed
                      ? 'border-blue-500 bg-white' 
                      : 'border-gray-300 bg-white'
                  }`}>
                    <div className={`w-4 h-4 rounded-full ${
                      step.active || step.completed
                        ? 'bg-blue-500' 
                        : 'bg-gray-300'
                    }`}></div>
                  </div>
                  <span className={`text-lg font-medium ${
                    step.active || step.completed ? 'text-blue-500' : 'text-black'
                  }`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="ml-4 mt-2 mb-2">
                    <div className="flex flex-col space-y-0.5">
                      <div className="w-0.5 h-0.5 bg-blue-500 rounded-full"></div>
                      <div className="w-0.5 h-0.5 bg-blue-500 rounded-full"></div>
                      <div className="w-0.5 h-0.5 bg-blue-500 rounded-full"></div>
                      <div className="w-0.5 h-0.5 bg-blue-500 rounded-full"></div>
                      <div className="w-0.5 h-0.5 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white rounded-2xl shadow-lg p-12 max-w-3xl w-full">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-12 pt-8">
              {currentStep !== 6 && currentStep !== 7 && (
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={`px-12 py-3 rounded-full font-medium text-lg ${
                    currentStep === 1
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-button-color-2 text-black hover:bg-main-color hover:text-black transition-colors'
                  }`}
                >
                  Back
                </button>
              )}
              
              {(currentStep === 6 || currentStep === 7) && (
                <div className="w-full"></div>
              )}
              
              {currentStep < 5 && (
                <button
                  onClick={handleNext}
                  className="px-12 py-3 rounded-full font-medium text-lg bg-button-color-1 text-black hover:bg-secondary-color hover:text-black transition-colors"
                >
                  Next
                </button>
              )}
              
              {currentStep === 5 && (
                <button
                  onClick={handleNext}
                  className="px-12 py-3 rounded-full font-medium text-lg bg-button-color-1 text-black hover:bg-secondary-color hover:text-black transition-colors"
                >
                  Proceed to Payment
                </button>
              )}
              
              {(currentStep === 6 || currentStep === 7) && (
                <div className="w-full"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
