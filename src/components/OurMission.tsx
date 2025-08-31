import Image from 'next/image';

export default function OurMission() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        
        {/* Our Mission Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <div className="w-24 h-1 bg-purple-300 mx-auto rounded-full"></div>
        </div>

        {/* First Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left side - Image */}
          <div className="relative">
            <div className="relative w-80 h-80 mx-auto">
              {/* Purple blob background */}
              <div className="absolute inset-0 bg-purple-200 rounded-full transform rotate-12"></div>
              {/* Image */}
              <div className="absolute inset-4 rounded-lg overflow-hidden">
                <Image
                  src="/aboutsection1.png"
                  alt="Construction Worker"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Decorative star */}
              <div className="absolute -top-4 -left-4 text-yellow-400 text-2xl">✦</div>
              {/* Decorative squiggly line */}
              <div className="absolute -bottom-8 -right-8">
                <svg className="w-20 h-12 text-purple-300" viewBox="0 0 80 48" fill="none">
                  <path d="M10 24C20 14 30 34 40 24C50 14 60 34 70 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Right side - Content */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              What was the first thing I built that changed my life?
            </h3>
            <div className="w-24 h-1 bg-purple-300 rounded-full mb-6 mx-auto"></div>
            <p className="text-gray-600 leading-relaxed">
              A square foot garden. I started cutting boards—and I haven't stopped building since. 
              From painting rental homes with a sprayer I bought in college, to remodeling basements, kitchens, and even 
              building a tiny house from the ground up—I've spent years learning the hard way: project by project, video by video, 
              and mistake by mistake. What I lacked was something I now want to create for others: a structured path to learning the 
              foundational skills of construction.
            </p>
          </div>
        </div>

        {/* Second Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left side - Content */}
          <div className="lg:order-1">
            <h3 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Why I Started Build Labs Academy
            </h3>
            <div className="w-24 h-1 bg-purple-300 rounded-full mb-6 mx-auto"></div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Like many, I worked in IT for years—but my true passion has always been building. Over time, I taught myself how to:
            </p>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                Remodel and update aging homes
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                Build finished basements for legal rentals
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                Construct a tiny home I now rent out
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                Build a 12x32 deck that saved me over $10,000
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                Troubleshoot HVAC, electrical, plumbing, and more
              </li>
            </ul>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Each time, I had to relearn basics or patch together tutorials. I always thought: If only there had been a program 
              to teach these foundational principles simply, clearly, and with hands-on experience.
            </p>
            <p className="text-gray-600 font-medium">
              That's what Build Labs Academy is.
            </p>
          </div>
          
          {/* Right side - Image */}
          <div className="relative lg:order-2">
            <div className="relative w-80 h-80 mx-auto">
              {/* Purple blob background */}
              <div className="absolute inset-0 bg-purple-200 rounded-full transform -rotate-12"></div>
              {/* Image */}
              <div className="absolute inset-4 rounded-lg overflow-hidden">
                <Image
                  src="/aboutsection2.png"
                  alt="Tiny House"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 text-yellow-400 text-2xl">✦</div>
              <div className="absolute -bottom-8 -left-8">
                <svg className="w-20 h-12 text-purple-300" viewBox="0 0 80 48" fill="none">
                  <path d="M10 24C20 14 30 34 40 24C50 14 60 34 70 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Third Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left side - Image */}
          <div className="relative">
            <div className="relative w-80 h-80 mx-auto">
              {/* Purple blob background */}
              <div className="absolute inset-0 bg-purple-200 rounded-full transform rotate-6"></div>
              {/* Image */}
              <div className="absolute inset-4 rounded-lg overflow-hidden">
                <Image
                  src="/aboutsection3.png"
                  alt="Our Mission"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 text-yellow-400 text-2xl">✦</div>
              <div className="absolute -bottom-8 -right-8">
                <svg className="w-20 h-12 text-purple-300" viewBox="0 0 80 48" fill="none">
                  <path d="M10 24C20 14 30 34 40 24C50 14 60 34 70 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Right side - Content */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Our Mission
            </h3>
            <div className="w-24 h-1 bg-purple-300 rounded-full mb-6 mx-auto"></div>
            <p className="text-gray-600 leading-relaxed">
              To empower everyday people to build with confidence by teaching foundational construction 
              skills through hands-on learning, expert guidance, and real-world projects.
            </p>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What we offer</h2>
          <div className="w-24 h-1 bg-purple-300 mx-auto rounded-full mb-16"></div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Foundational Construction Training */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6">
                <Image
                  src="/abouticon1.png"
                  alt="Foundational Construction Training"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Source Serif Pro', fontSize: '24px', fontWeight: 600 }}>
                Foundational Construction Training
              </h4>
              <p className="text-gray-800 leading-snug" style={{ fontFamily: 'Lato', fontSize: '18px', fontWeight: 400 }}>
                Learn framing, drywall, electrical basics, painting, roofing, and more—with practical knowledge you can immediately use.
              </p>
            </div>

            {/* Tiny House Build Experience */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6">
                <Image
                  src="/abouticon2.png"
                  alt="Tiny House Build Experience"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Source Serif Pro', fontSize: '24px', fontWeight: 600 }}>
                Tiny House Build <br /> Experience
              </h4>
              <p className="text-gray-800 leading-snug" style={{ fontFamily: 'Lato', fontSize: '18px', fontWeight: 400 }}>
                Get your hands dirty with a real build project and walk away knowing how a home comes together—top to bottom.
              </p>
            </div>

            {/* Student Portal & Learning Resources */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6">
                <Image
                  src="/abouticon3.png"
                  alt="Student Portal & Learning Resources"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Source Serif Pro', fontSize: '24px', fontWeight: 600 }}>
                Student Portal & Learning Resources
              </h4>
              <p className="text-gray-800 leading-snug" style={{ fontFamily: 'Lato', fontSize: '18px', fontWeight: 400 }}>
                Access a full library of videos, tutorials, and step-by-step guides so you can revisit what you've learned anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
