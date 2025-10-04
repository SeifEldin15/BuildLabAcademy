'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setEmail('');
      } else {
        setMessage(data.error || 'Something went wrong');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-main-color py-12 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-black/5 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="w-full px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 text-black justify-items-center">
          
          {/* Company Logo & Description */}
          <div className="space-y-4 justify-self-start">
            <div className="flex items-center space-x-2">
              <Link href="/">
                <img src="/logo.svg" alt="Build Lab Academy Logo" className="w-12 h-12 cursor-pointer" />
              </Link>
            </div>
            <p className="text-black/70 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet neque tortor.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-3 pt-2">
              <a href="#" className="w-10 h-10 border-2 border-black/30 rounded-lg flex items-center justify-center hover:bg-black/10 transition-colors">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 border-2 border-black/30 rounded-lg flex items-center justify-center hover:bg-black/10 transition-colors">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 border-2 border-black/30 rounded-lg flex items-center justify-center hover:bg-black/10 transition-colors">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 border-2 border-black/30 rounded-lg flex items-center justify-center hover:bg-black/10 transition-colors">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="justify-self-start">
            <h3 className="font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-black/70 hover:text-black transition-colors text-sm">
                  Our Service
                </a>
              </li>
              <li>
                <Link href="/about-us" className="text-black/70 hover:text-black transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-black/70 hover:text-black transition-colors text-sm">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-black/70 hover:text-black transition-colors text-sm">
                  Testimonial
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Us */}
          <div className="justify-self-start">
            <h3 className="font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <div className="w-5 h-5 flex-shrink-0">
                  <svg className="w-5 h-5 text-black/60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <span className="text-black/70 text-sm">hello@website.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-5 h-5 flex-shrink-0">
                  <svg className="w-5 h-5 text-black/60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <span className="text-black/70 text-sm">838 Conti Sialkot, ENG</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-5 h-5 flex-shrink-0">
                  <svg className="w-5 h-5 text-black/60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <span className="text-black/70 text-sm">+02 6421234560</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="md:col-span-2 flex flex-col">
            <h3 className="font-bold text-lg mb-6">Newsletter</h3>
            <div className="space-y-4">
              <form onSubmit={handleNewsletterSubmit} className="relative bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-6 pr-36 py-4 bg-transparent text-gray-700 placeholder-black focus:outline-none rounded-2xl"
                  disabled={isLoading}
                />
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-5 py-2 bg-button-color-1 text-black rounded-full hover:bg-blue-500 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              {message && (
                <p className={`text-sm mt-2 ${message.includes('error') || message.includes('wrong') ? 'text-red-600' : 'text-green-600'}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
