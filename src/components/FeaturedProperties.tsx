import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Ruler, ChevronLeft, ChevronRight, MessageCircle, Search, Filter, X, Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import landPlot from "@/assets/land-plot.jpg";
import modernHome from "@/assets/modern-home.jpg";

const getPropertyImage = (type: string) => {
  if (type === "Home") return modernHome;
  return landPlot;
};

interface PropertyMediaCarouselProps {
  images: string[];
  videos: string[];
  title: string;
  type: string;
}

interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

const PropertyMediaCarousel = ({ images, videos, title, type }: PropertyMediaCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Combine images and videos into media items
  const mediaItems: MediaItem[] = [
    ...images.map(url => ({ url, type: 'image' as const })),
    ...videos.map(url => ({ url, type: 'video' as const }))
  ];
  
  const allMedia = mediaItems.length > 0 ? mediaItems : [{ url: getPropertyImage(type), type: 'image' as const }];
  
  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
  };
  
  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));
  };

  const currentMedia = allMedia[currentIndex];

  return (
    <div className="relative group">
      {currentMedia.type === 'video' ? (
        <video 
          key={currentMedia.url}
          className="w-full h-64 object-contain bg-black"
          controls
          playsInline
          preload="metadata"
          controlsList="nodownload"
          onClick={(e) => e.stopPropagation()}
        >
          <source src={currentMedia.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img 
          src={currentMedia.url} 
          alt={`${title} - Image ${currentIndex + 1}`}
          className="w-full h-64 object-cover transition-opacity"
        />
      )}
      
      {allMedia.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {/* Dots indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {allMedia.map((media, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors flex items-center justify-center ${
                  index === currentIndex ? 'bg-primary' : 'bg-background/60'
                }`}
              >
                {media.type === 'video' && (
                  <Play className="h-1.5 w-1.5" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const FeaturedProperties = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const trackedIds = useRef<Set<string>>(new Set());

  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['featured-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Track property views when properties are loaded
  useEffect(() => {
    if (properties && properties.length > 0) {
      properties.forEach(async (property) => {
        // Only track each property once per session
        if (!trackedIds.current.has(property.id)) {
          trackedIds.current.add(property.id);
          await supabase.from('property_views').insert({
            property_id: property.id,
          });
        }
      });
    }
  }, [properties]);

  // Get unique types and locations for filters
  const { types, locations } = useMemo(() => {
    if (!properties) return { types: [], locations: [] };
    const uniqueTypes = [...new Set(properties.map(p => p.type))].filter(Boolean);
    const uniqueLocations = [...new Set(properties.map(p => p.location))].filter(Boolean);
    return { types: uniqueTypes, locations: uniqueLocations };
  }, [properties]);

  // Filter properties based on search and filters
  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    
    return properties.filter(property => {
      const matchesSearch = searchQuery === "" || 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (property.description?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = typeFilter === "all" || property.type === typeFilter;
      const matchesLocation = locationFilter === "all" || property.location === locationFilter;
      
      return matchesSearch && matchesType && matchesLocation;
    });
  }, [properties, searchQuery, typeFilter, locationFilter]);

  const hasActiveFilters = searchQuery !== "" || typeFilter !== "all" || locationFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setLocationFilter("all");
  };

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

        {/* Search and Filter Section */}
        <div className="mb-8 p-6 bg-card rounded-xl border shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, location, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Location Filter */}
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="shrink-0">
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
          
          {/* Results count */}
          {!isLoading && properties && (
            <p className="text-sm text-muted-foreground mt-4">
              Showing {filteredProperties.length} of {properties.length} properties
            </p>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-64" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-destructive">
            Failed to load properties. Please try again later.
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No properties found matching your criteria.</p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => {
              const images = (property.images as string[] | null) || [];
              const videos = (property.videos as string[] | null) || [];
              const fallbackImage = property.image_url && property.image_url !== '/placeholder.svg' 
                ? property.image_url 
                : null;
              const displayImages = images.length > 0 ? images : (fallbackImage ? [fallbackImage] : []);
              
              return (
                <Card key={property.id} className="overflow-hidden hover-scale shadow-card hover:shadow-elegant transition-smooth">
                  <div className="relative">
                    <PropertyMediaCarousel 
                      images={displayImages}
                      videos={videos}
                      title={property.title} 
                      type={property.type}
                    />
                    {property.badge && (
                      <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground z-10">
                        {property.badge}
                      </Badge>
                    )}
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
                    
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        const message = `Hi, I'm interested in the property: ${property.title} - ${property.location} (${property.price})`;
                        window.open(`https://wa.me/918056987186?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact via WhatsApp
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
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