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
        <button className="bg-button-color-1 text-black px-6 py-2 rounded-full hover:bg-secondary-color hover:text-black transition-colors font-medium">
          Apply Now
        </button>
      </div>
    </section>
  );
}
