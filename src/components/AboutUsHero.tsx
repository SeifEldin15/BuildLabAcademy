export default function AboutUsHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with overlay */}
      <img src="aboutushero.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
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
