import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import landPlot from "@/assets/land-plot.jpg";
import modernHome from "@/assets/modern-home.jpg";
import { MapPin, Home, Ruler } from "lucide-react";

const properties = [
  {
    id: 1,
    title: "Premium Land Development",
    location: "Hillside Valley, CA",
    price: "$2.5M",
    area: "25 Acres",
    type: "Land",
    image: landPlot,
    badge: "Prime Location",
    description: "Exceptional development opportunity with panoramic views and approved zoning for residential projects.",
  },
  {
    id: 2,
    title: "Modern Family Estate",
    location: "Riverside Heights, TX",
    price: "$850K",
    area: "3,200 sq ft",
    type: "Home",
    image: modernHome,
    badge: "Move-in Ready",
    description: "Contemporary design with luxury finishes, smart home features, and stunning landscape architecture.",
  },
  {
    id: 3,
    title: "Commercial Land Plot",
    location: "Downtown District, FL",
    price: "$1.8M",
    area: "5.2 Acres",
    type: "Commercial",
    image: landPlot,
    badge: "High ROI",
    description: "Strategic commercial location with high traffic and excellent visibility for retail or office development.",
  }
];

const FeaturedProperties = () => {
  return (
    <section className="py-20 gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Featured Properties
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Handpicked properties offering exceptional value and investment potential
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover-scale shadow-card hover:shadow-elegant transition-smooth">
              <div className="relative">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-64 object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                  {property.badge}
                </Badge>
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">{property.title}</CardTitle>
                  <span className="text-2xl font-bold text-primary">{property.price}</span>
                </div>
                
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Ruler className="w-4 h-4" />
                    <span className="text-sm">{property.area}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4">{property.description}</p>
                
                <div className="flex gap-2">
                  <Button variant="default" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Home className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="hero" size="lg">
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;