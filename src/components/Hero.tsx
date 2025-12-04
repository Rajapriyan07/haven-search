import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-development.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-secondary/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Shabeer Land & Home Promoters
          <br />
          <span className="text-accent">Welcomes You</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
          Discover premium land opportunities and modern homes in prime locations. 
          Build your future with confidence through our expert guidance and proven track record.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="hero" size="lg" className="text-lg px-8 py-6 hover-glow">
            Explore Properties
          </Button>
          <Button variant="premium" size="lg" className="text-lg px-8 py-6">
            Schedule Consultation
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">500+</div>
            <div className="text-lg opacity-90">Properties Sold</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">50M+</div>
            <div className="text-lg opacity-90">Total Investment</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">15+</div>
            <div className="text-lg opacity-90">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;