import Image from 'next/image';

export default function Benefits() {
  return (
    <section className="bg-slate-700 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-2 font-orbitron">
            BENEFITS
          </h2>
          <h3 className="text-white text-xl md:text-2xl font-bold font-orbitron">
            OF BUILD LAB ACADEMY
          </h3>
        </div>
        
        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Benefit 1 - Hands-On Instruction */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Image Container */}
            <div className="relative h-48">
              <Image
                src="/post1.png"
                alt="Hands-On Instruction"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Content */}
            <div className="p-5">
              <div className="mb-2">
                <span className="text-blue-500 text-xs font-semibold uppercase tracking-wide">
                  Benefits
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 font-orbitron">
                Hands-On Instruction
              </h3>
              <p className="text-gray-600 mb-5 leading-relaxed text-sm">
                We teach in class and hands-on environments, and also provide plans and resources so that you can build your own tiny house. You can do this !
              </p>
              <button className="text-blue-500 font-semibold hover:text-blue-600 transition-colors duration-200 flex items-center">
                LEARN MORE
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Benefit 2 - Online Student Portal */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Image Container */}
            <div className="relative h-48">
              <Image
                src="/post2.png"
                alt="Online Student Portal"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Content */}
            <div className="p-5">
              <div className="mb-2">
                <span className="text-blue-500 text-xs font-semibold uppercase tracking-wide">
                  Benefits
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 font-orbitron">
                Online Student Portal
              </h3>
              <p className="text-gray-600 mb-5 leading-relaxed text-sm">
                We teach foundational construction skills so and provide a student portal so that you can revisit the instruction for remodeling a home, finishing a basement
              </p>
              <button className="text-blue-500 font-semibold hover:text-blue-600 transition-colors duration-200 flex items-center">
                LEARN MORE
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Benefit 3 - In-person Expert Instruction */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Image Container */}
            <div className="relative h-48">
              <Image
                src="/post3.png"
                alt="In-person Expert Instruction"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Content */}
            <div className="p-5">
              <div className="mb-2">
                <span className="text-blue-500 text-xs font-semibold uppercase tracking-wide">
                  Benefits
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 font-orbitron">
                In-person Expert Instruction
              </h3>
              <p className="text-gray-600 mb-5 leading-relaxed text-sm">
                We teach foundational construction skills so and provide a student portal so that you can revisit the instruction for remodeling a home, finishing a basement
              </p>
              <button className="text-blue-500 font-semibold hover:text-blue-600 transition-colors duration-200 flex items-center">
                LEARN MORE
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
