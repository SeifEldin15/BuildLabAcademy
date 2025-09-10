'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (status === 'loading') {
      return; // Still checking authentication status
    }
    
    if (session) {
      // User is logged in, go to apply page
      router.push('/apply');
    } else {
      // User is not logged in, go to login page with apply as callback
      router.push('/login?callbackUrl=' + encodeURIComponent('/apply'));
    }
  };

  return (
    <nav className="bg-accent-color px-6 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Image src="/logo.svg" alt="Build Lab Academy Logo" width={80} height={80} className="cursor-pointer" />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="/about-us" 
            className="text-secondary-color hover:text-main-color font-medium"
          >
            About
          </Link>
          <Link 
            href="/class-offerings" 
            className="text-secondary-color hover:text-main-color font-medium"
          >
            Class Offerings
          </Link>
          
          {/* Buttons */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/student-portal"
              className="bg-button-color-2 text-black px-4 py-2 rounded-full hover:bg-main-color hover:text-black transition-colors font-medium"
            >
              Student Portal
            </Link>
            <button 
              onClick={handleApplyClick}
              className="bg-button-color-1 text-black px-6 py-2 rounded-full hover:bg-secondary-color hover:text-black transition-colors font-medium"
            >
              {session ? 'Apply Now' : 'Login / Apply'}
            </button>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button className="text-secondary-color hover:text-main-color">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
