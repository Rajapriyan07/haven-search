import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  MapPin, 
  TrendingUp, 
  Home, 
  Users, 
  Shield 
} from "lucide-react";

const services = [
  {
    icon: Building,
    title: "Land Development",
    description: "Transform raw land into thriving communities with our comprehensive development services and expert planning.",
  },
  {
    icon: Home,
    title: "Home Construction",
    description: "Build your dream home with our trusted contractors and architects specializing in modern, sustainable design.",
  },
  {
    icon: TrendingUp,
    title: "Investment Advisory",
    description: "Make informed decisions with our market analysis and investment strategies tailored to your financial goals.",
  },
  {
    icon: MapPin,
    title: "Location Scouting",
    description: "Find the perfect location with our deep knowledge of prime areas and emerging neighborhoods.",
  },
  {
    icon: Users,
    title: "Project Management",
    description: "Full project oversight from initial planning to final completion, ensuring timely and quality delivery.",
  },
  {
    icon: Shield,
    title: "Legal Support",
    description: "Navigate regulations and permits with our experienced legal team handling all compliance matters.",
  },
];

const Services = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive real estate solutions from land acquisition to project completion
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="text-center hover-scale shadow-card hover:shadow-elegant transition-smooth">
              <CardHeader>
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="gradient-subtle rounded-2xl p-8 md:p-12 shadow-card">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let our experienced team guide you through every step of your real estate journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                Get Free Consultation
              </Button>
              <Button variant="outline" size="lg">
                View Our Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;