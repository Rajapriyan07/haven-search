import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import Services from "@/components/Services";
import About from "@/components/About";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <section id="home">
        <Hero />
      </section>
      <section id="properties">
        <FeaturedProperties />
      </section>
      <section id="services">
        <Services />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="contact">
        <Contact />
      </section>
      
      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Shabeer Land & Home Promoters</h3>
              <p className="text-white/80 mb-4">
                Building dreams and creating value through expert real estate development and investment services.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-white/80">
                <li>Land Development</li>
                <li>Home Construction</li>
                <li>Investment Advisory</li>
                <li>Project Management</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Properties</h4>
              <ul className="space-y-2 text-white/80">
                <li>Residential Land</li>
                <li>Commercial Plots</li>
                <li>Modern Homes</li>
                <li>Investment Opportunities</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-white/80">
                <li>+91 8056987186</li>
                <li>shabeerkahn1982@gmail.com</li>
                <li>Karur, Tamilnadu</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 Shabeer Land & Home Promoters. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
