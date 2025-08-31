import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-accent-color px-6 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Build Lab Academy Logo" width={80} height={80} />
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
            <Link 
              href="/apply"
              className="bg-button-color-1 text-black px-6 py-2 rounded-full hover:bg-secondary-color hover:text-black transition-colors font-medium"
            >
              Apply Now
            </Link>
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
