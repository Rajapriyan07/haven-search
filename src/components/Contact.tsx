import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Phone,
    title: "Call Us",
    details: "+91 8056987186",
    subtitle: "Available for inquiries",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: "shabeerkahn1982@gmail.com",
    subtitle: "24/7 response guaranteed",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: "Karur, Tamilnadu",
    subtitle: "Main office location",
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: "Mon-Sat: 9AM-6PM",
    subtitle: "Sunday by appointment",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "Land Purchase",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.message) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const whatsappMessage = `New Inquiry from Website:
    
Name: ${formData.name}
Email: ${formData.email || "Not provided"}
Phone: ${formData.phone}
Interest: ${formData.interest}

Message:
${formData.message}`;

    window.open(`https://wa.me/918056987186?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
    
    toast({
      title: "Redirecting to WhatsApp",
      description: "Your message is being sent via WhatsApp.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      interest: "Land Purchase",
      message: "",
    });
  };

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
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Name *
                    </label>
                    <Input 
                      placeholder="Your Name" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Phone *
                      </label>
                      <Input 
                        type="tel" 
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Email
                      </label>
                      <Input 
                        type="email" 
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Interest Type
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    >
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
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  
                  <Button type="submit" variant="hero" size="lg" className="w-full">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Send via WhatsApp
                  </Button>
                </form>
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