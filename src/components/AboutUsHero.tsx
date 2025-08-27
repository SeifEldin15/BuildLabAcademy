export default function AboutUsHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with overlay */}
      <div className="absolute inset-0">
        {/* Background placeholder - you can replace this with an actual construction site image */}
        <div className="w-full h-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 relative">
          {/* Construction site imagery placeholder */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-400/50 to-gray-600/50"></div>
          
          {/* Simulated construction elements */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-yellow-400/30 rounded-full"></div>
          <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-orange-400/20 rounded-lg"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400/20 rounded"></div>
        </div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
          About Us
        </h1>
        
        {/* Description Text */}
        <p className="text-lg md:text-xl lg:text-2xl mb-12 leading-relaxed font-light max-w-3xl mx-auto">
          From preschool to pre-tertiary, our students enjoy fun, interactive and 
          relevant lessons and are empowered to think beyond the confines of 
          the classroom.
        </p>
        
        {/* Call-to-Action Button */}
        <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-full text-lg border border-white/30 transition-all duration-300 hover:scale-105">
          Apply Now
        </button>
      </div>
    </section>
  );
}
