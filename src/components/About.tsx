import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Award, Users, Calendar } from "lucide-react";

const achievements = [
  { icon: Award, label: "Industry Awards", value: "25+" },
  { icon: Users, label: "Happy Clients", value: "1000+" },
  { icon: CheckCircle, label: "Completed Projects", value: "500+" },
  { icon: Calendar, label: "Years Experience", value: "15+" },
];

const features = [
  "Expert market analysis and location assessment",
  "Full regulatory compliance and permit handling",
  "Sustainable development practices",
  "Flexible financing options available",
  "24/7 customer support throughout your journey",
  "Post-completion maintenance and support",
];

const About = () => {
  return (
    <section className="py-20 gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <Badge className="mb-4 bg-secondary text-secondary-foreground">
              About Shabeer Land & Home Promoters
            </Badge>
            
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Building Dreams,
              <br />
              <span className="text-primary">Creating Value</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              With over 15 years of experience in real estate development and investment, 
              we've established ourselves as the trusted partner for land acquisition, 
              home construction, and property development projects across the nation.
            </p>
            
            <div className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="land" size="lg">
                Learn Our Story
              </Button>
              <Button variant="outline" size="lg">
                Meet Our Team
              </Button>
            </div>
          </div>
          
          {/* Achievements Grid */}
          <div className="grid grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className="bg-card p-6 rounded-xl shadow-card hover:shadow-elegant transition-smooth text-center"
              >
                <div className="w-12 h-12 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <achievement.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {achievement.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <p className="text-muted-foreground mb-8">Trusted by leading organizations and investors</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-foreground">INVESTMENT GROUP</div>
            <div className="text-2xl font-bold text-foreground">REAL ESTATE PLUS</div>
            <div className="text-2xl font-bold text-foreground">DEVELOPMENT CO</div>
            <div className="text-2xl font-bold text-foreground">PREMIER BANK</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;