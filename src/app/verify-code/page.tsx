'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VerifyCodePage() {
  const [codes, setCodes] = useState(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = codes.join('');
    if (verificationCode.length !== 4) {
      alert('Please enter all 4 digits');
      return;
    }
    console.log('Verification code:', verificationCode);
    router.push('/create-password');
  };

  const handleResendCode = () => {
    console.log('Resending verification code');
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-3/5 relative">
        <Image
          src="/forget.png"
          alt="Verification background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="w-full lg:w-2/5 flex flex-col p-8 bg-gray-50">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.svg"
            alt="Build Lab Academy"
            width={160}
            height={64}
            className="h-auto"
          />
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                Forget Password ?
              </h1>
              <p className="text-gray-600 mb-8 text-center text-sm">
                Enter Verification code
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center space-x-4">
                  {codes.map((code, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={code}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-14 h-14 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors bg-gray-100"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  Send Recovery code
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-blue-600 hover:text-blue-500 font-medium text-sm"
                  >
                    Didn't receive the code? Resend
                  </button>
                </div>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-500 font-medium text-sm"
                  >
                    ← Back to Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
