'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface StudentDiscountProps {
  orderAmount: number;
  onDiscountApplied: (discountInfo: any) => void;
  onDiscountRemoved: () => void;
}

export default function StudentDiscountComponent({ 
  orderAmount, 
  onDiscountApplied, 
  onDiscountRemoved 
}: StudentDiscountProps) {
  const { data: session } = useSession();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userDiscount, setUserDiscount] = useState<any>(null);

  // Fetch user's current discount on component mount
  useEffect(() => {
    if (session) {
      fetchUserDiscount();
    }
  }, [session]);

  const fetchUserDiscount = async () => {
    try {
      const response = await fetch('/api/student-discount/get-discount');
      if (response.ok) {
        const data = await response.json();
        if (data.hasDiscount) {
          setUserDiscount(data);
          setDiscountCode(data.discountCode);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user discount:', error);
    }
  };

  const applyDiscount = async () => {
    if (!discountCode.trim()) {
      setError('Please enter a discount code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/student-discount/get-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discountCode: discountCode.trim(),
          orderAmount
        })
      });

      const result = await response.json();

      if (result.valid) {
        setAppliedDiscount(result);
        onDiscountApplied(result);
        setError('');
      } else {
        setError(result.error || 'Invalid discount code');
        setAppliedDiscount(null);
      }
    } catch (error) {
      setError('Failed to apply discount. Please try again.');
      console.error('Discount application error:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setError('');
    onDiscountRemoved();
  };

  // Auto-apply user's discount if they have one
  const autoApplyUserDiscount = () => {
    if (userDiscount && !appliedDiscount) {
      setDiscountCode(userDiscount.discountCode);
      applyDiscount();
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Student Discount</h3>

      {/* User's verified discount info */}
      {userDiscount && !appliedDiscount && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">
                You have a verified {userDiscount.discountPercentage}% student discount!
              </p>
              {userDiscount.schoolName && (
                <p className="text-xs text-blue-600">From: {userDiscount.schoolName}</p>
              )}
            </div>
            <button
              onClick={autoApplyUserDiscount}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Apply Now
            </button>
          </div>
        </div>
      )}

      {/* Applied discount display */}
      {appliedDiscount && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-green-800">
                Student Discount Applied: {appliedDiscount.discountPercentage}% OFF
              </p>
              <p className="text-sm text-green-600">
                You save ${appliedDiscount.discountAmount.toFixed(2)}!
              </p>
              {appliedDiscount.studentName && (
                <p className="text-xs text-green-600">
                  Student: {appliedDiscount.studentName}
                </p>
              )}
            </div>
            <button
              onClick={removeDiscount}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Remove
            </button>
          </div>
          
          <div className="mt-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Original Amount:</span>
              <span>${appliedDiscount.originalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Discount ({appliedDiscount.discountPercentage}%):</span>
              <span>-${appliedDiscount.discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-lg border-t pt-1">
              <span>Final Amount:</span>
              <span>${appliedDiscount.finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Discount code input */}
      {!appliedDiscount && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              placeholder="Enter discount code (e.g., STUDENT-ABC123-XYZ)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={applyDiscount}
              disabled={loading || !discountCode.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
            >
              {loading ? 'Applying...' : 'Apply'}
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          {!session && (
            <p className="text-gray-600 text-sm">
              <a href="/login" className="text-blue-600 hover:underline">
                Log in
              </a> to access your verified student discount.
            </p>
          )}

          {session && !userDiscount && (
            <p className="text-gray-600 text-sm">
              Don't have a student discount yet?{' '}
              <a href="/student-portal" className="text-blue-600 hover:underline">
                Get verified now
              </a> for 20% off!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
