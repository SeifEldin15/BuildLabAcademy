'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import StudentDiscountComponent from './StudentDiscount';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  courseType: 'group' | 'individual';
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  courseType, 
  onPaymentSuccess, 
  onPaymentError 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [originalAmount, setOriginalAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);

  // Get pricing based on course type
  const prices = {
    'individual': 500, // $500
    'group': 300      // $300
  };

  useEffect(() => {
    if (!courseType) return;

    const coursePrice = prices[courseType];
    setOriginalAmount(coursePrice);
    setFinalAmount(coursePrice);
  }, [courseType]);

  // Create payment intent when final amount changes
  useEffect(() => {
    if (finalAmount > 0) {
      createPaymentIntent(finalAmount);
    }
  }, [finalAmount]);

  const createPaymentIntent = async (amount: number) => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseType,
          amount: amount * 100, // Convert to cents
        }),
      });

      const data = await response.json();
      if (data.error) {
        onPaymentError(data.error);
      } else {
        setClientSecret(data.clientSecret);
      }
    } catch (error) {
      onPaymentError('Failed to initialize payment');
    }
  };

  const handleDiscountApplied = (discountInfo: any) => {
    setAppliedDiscount(discountInfo);
    setFinalAmount(discountInfo.finalAmount);
  };

  const handleDiscountRemoved = () => {
    setAppliedDiscount(null);
    setFinalAmount(originalAmount);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsLoading(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setIsLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      }
    });

    if (error) {
      onPaymentError(error.message || 'Payment failed');
      setIsLoading(false);
    } else if (paymentIntent?.status === 'succeeded') {
      // Record discount usage if discount was applied
      if (appliedDiscount) {
        try {
          await fetch('/api/student-discount/record-usage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              verificationId: appliedDiscount.verificationId,
              orderId: paymentIntent.id,
              discountAmount: appliedDiscount.discountAmount,
              originalAmount: appliedDiscount.originalAmount,
              finalAmount: appliedDiscount.finalAmount
            })
          });
        } catch (error) {
          console.error('Failed to record discount usage:', error);
        }
      }
      
      onPaymentSuccess(paymentIntent.id);
      setIsLoading(false);
    }
  };

  if (!clientSecret) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Initializing payment...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Student Discount Component */}
      <StudentDiscountComponent
        orderAmount={originalAmount}
        onDiscountApplied={handleDiscountApplied}
        onDiscountRemoved={handleDiscountRemoved}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Complete Payment
          </h3>
          <p className="text-lg text-gray-600">
            Course: <span className="font-semibold capitalize">{courseType}</span>
          </p>
          
          {appliedDiscount ? (
            <div className="space-y-2">
              <p className="text-lg text-gray-500 line-through">
                Original: ${originalAmount}.00
              </p>
              <p className="text-2xl font-bold text-green-600">
                Final Amount: ${finalAmount}.00
              </p>
              <p className="text-sm text-green-600">
                You saved ${appliedDiscount.discountAmount.toFixed(2)} with student discount!
              </p>
            </div>
          ) : (
            <p className="text-2xl font-bold text-green-600">
              ${finalAmount}.00
            </p>
          )}
        </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
          className="p-3 border border-gray-300 rounded-md bg-white"
        />
      </div>

        <button
          type="submit"
          disabled={!stripe || isLoading}
          className={`w-full py-3 px-6 rounded-lg font-medium text-lg transition-colors ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isLoading ? 'Processing...' : `Pay $${finalAmount}.00`}
        </button>
      </form>
    </div>
  );
};

interface StripePaymentProps {
  courseType: 'group' | 'individual';
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
}

const StripePayment: React.FC<StripePaymentProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default StripePayment;