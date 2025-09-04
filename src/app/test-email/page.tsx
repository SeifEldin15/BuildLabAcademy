'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function TestEmailPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
    suggestions?: string[];
    details?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult({});

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        error: 'Failed to send test email',
        details: 'Network error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Image
              src="/logo.svg"
              alt="Build Lab Academy"
              width={120}
              height={48}
              className="h-auto mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900">
              Email Server Test
            </h1>
            <p className="text-gray-600 mt-2">
              Test your email configuration
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Test Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                A test verification email will be sent to this address
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending Test Email...' : 'Send Test Email'}
            </button>
          </form>

          {/* Results */}
          {result.success && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Email Sent Successfully!
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>{result.message}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {result.error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Email Test Failed
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p><strong>Error:</strong> {result.error}</p>
                    {result.details && (
                      <p className="mt-1"><strong>Details:</strong> {result.details}</p>
                    )}
                    {result.suggestions && result.suggestions.length > 0 && (
                      <div className="mt-3">
                        <p><strong>Suggestions:</strong></p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {result.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <div className="text-sm text-gray-500">
              <p>Need help setting up email?</p>
              <p>Check the <strong>EMAIL_SETUP_GUIDE.md</strong> file</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
