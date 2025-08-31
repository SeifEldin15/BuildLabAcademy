import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/Hero.png"
          alt="Mountain landscape background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
          Exceptional Construction Bootcamp
        </h1>
        
        {/* Subheadings */}
        <div className="mb-8 space-y-2">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">
            In-Person
          </h2>
          <h3 className="text-lg md:text-xl lg:text-2xl font-medium">
            Hands-On & Classroom Training
          </h3>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link href="/about-us">
            <button className="bg-accent-color hover:bg-button-color-2 text-secondary-color font-bold py-3 px-6 rounded-full text-base transition-colors duration-300 min-w-[130px]">
              READ MORE
            </button>
          </Link>
          <Link href="/apply">
            <button className="bg-accent-color hover:bg-button-color-2 text-secondary-color font-bold py-3 px-6 rounded-full text-base transition-colors duration-300 min-w-[130px]">
              APPLY NOW
            </button>
          </Link>
        </div>
        
        {/* Footer Text */}
        <p className="text-base md:text-lg font-medium opacity-90">
          A Utah Based Company
        </p>
      </div>
    </section>
  );
}
