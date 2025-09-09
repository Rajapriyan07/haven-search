import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    title: "Call Us",
    details: "+1 (555) 123-4567",
    subtitle: "Mon-Fri 8AM-6PM PST",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: "info@premierproperties.com",
    subtitle: "24/7 response guaranteed",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: "123 Business District, CA",
    subtitle: "Main headquarters",
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: "Mon-Fri: 8AM-6PM",
    subtitle: "Weekend by appointment",
  },
];

const Contact = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-accent text-accent-foreground">
            Get In Touch
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Start Your Journey Today
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to explore opportunities? Contact our expert team for personalized guidance
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      First Name *
                    </label>
                    <Input placeholder="John" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Last Name *
                    </label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Email *
                    </label>
                    <Input type="email" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Phone
                    </label>
                    <Input type="tel" placeholder="+1 (555) 123-4567" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Interest Type
                  </label>
                  <select className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground">
                    <option>Land Purchase</option>
                    <option>Home Construction</option>
                    <option>Investment Opportunity</option>
                    <option>Development Project</option>
                    <option>Consultation</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Message *
                  </label>
                  <Textarea 
                    placeholder="Tell us about your project or requirements..."
                    className="min-h-32"
                  />
                </div>
                
                <Button variant="hero" size="lg" className="w-full">
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {info.title}
                      </h3>
                      <p className="text-primary font-medium mb-1">
                        {info.details}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {info.subtitle}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* CTA Card */}
            <Card className="gradient-hero text-white shadow-glow">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">
                  Schedule a Free Consultation
                </h3>
                <p className="mb-4 opacity-90">
                  Get expert advice tailored to your specific needs and budget
                </p>
                <Button variant="premium" size="sm" className="w-full">
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;