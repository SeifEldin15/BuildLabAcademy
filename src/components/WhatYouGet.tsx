import Image from 'next/image';
export default function WhatYouGet() {
  return (
    <section className="bg-main-color py-16 px-4 relative overflow-hidden">
      {/* Vector Pattern Background */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <Image 
          src="/Vector.png" 
          alt="Vector Pattern" 
          width={600} height={600}
          className="object-contain translate-x-8"
        />
      </div>
      
      <div className="max-w-6xl mx-auto relative">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-orbitron">
            What you GET !!!
          </h2>
          <div className="w-24 h-1 bg-accent-color mx-auto"></div>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-0 mb-16 divide-x divide-white/30">
          {/* Feature 1 - In-Person Expert Instruction */}
          <div className="p-8 text-white hover:bg-white/5 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 flex items-center justify-center">
                <img src="/what1.png" alt="" />
                <Image src="/what1.png" alt="" width={64} height={64} />
              </div>
              <div className="w-8 h-8 border-2 border-accent-color rounded flex items-center justify-center text-accent-color">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4 font-orbitron">In-Person Expert Instruction</h3>
            <p className="text-white/90 leading-relaxed">
              Learn directly from experienced professionals in a hands-on classroom setting
            </p>
          </div>
          
          {/* Feature 2 - Hands-On Practice */}
          <div className="p-8 text-white hover:bg-white/5 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 flex items-center justify-center">
                {/* Tools/Box Icon */}
              <img src="/what2.png" alt="Tools/Box Icon" />
              <Image src="/what2.png" alt="Tools/Box Icon" width={64} height={64} />
              </div>
              <div className="w-8 h-8 border-2 border-accent-color rounded flex items-center justify-center text-accent-color">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4 font-orbitron">Hands-On Practice</h3>
            <p className="text-white/90 leading-relaxed">
              Apply your skills on real construction projects to gain job-ready experience.
            </p>
          </div>
          
          {/* Feature 3 - Student Learning Portal */}
          <div className="p-8 text-white hover:bg-white/5 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 flex items-center justify-center">
                {/* Computer/Monitor Icon */}
                <img src="/what3.png" alt="Computer/Monitor Icon" />
                <Image src="/what3.png" alt="Computer/Monitor Icon" width={64} height={64} />
              </div>
              <div className="w-8 h-8 border-2 border-accent-color rounded flex items-center justify-center text-accent-color">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4 font-orbitron">Student Learning Portal</h3>
            <p className="text-white/90 leading-relaxed">
              Access online resources, assignments, and tools through a dedicated learning platform.
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center">
          <p className="text-white text-lg font-medium">
            A Utah Based Company
          </p>
        </div>
      </div>
    </section>
  );
}
