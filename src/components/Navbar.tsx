import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6 bg-gradient-to-r from-amber-200 to-yellow-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="bg-blue-600 p-2 rounded">
            <div className="text-white font-bold text-lg">
              <div className="flex flex-col items-center">
                <div className="border-2 border-white w-6 h-4 mb-1"></div>
                <div className="text-xs font-semibold tracking-wider">
                  <div>BUILD LAB</div>
                  <div className="text-[10px] tracking-widest">ACADEMY</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
            About
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
            Courses
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
            Resources
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
            Contact
          </a>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded transition-colors">
            Get Started
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button className="text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;