import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Ruler, ChevronLeft, ChevronRight, MessageCircle, Search, Filter, X, Play, Expand, Phone, Share2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
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

// Fullscreen Video Modal Component
const VideoModal = ({ 
  isOpen, 
  onClose, 
  videoUrl, 
  title 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  videoUrl: string; 
  title: string;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 bg-black border-none">
        <div className="relative w-full aspect-video">
          <video
            className="w-full h-full"
            controls
            autoPlay
            playsInline
            controlsList="nodownload"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <p className="text-white text-center py-2 text-sm">{title}</p>
      </DialogContent>
    </Dialog>
  );
};

const PropertyMediaCarousel = ({ images, videos, title, type }: PropertyMediaCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  
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

  const openVideoFullscreen = (url: string) => {
    setSelectedVideoUrl(url);
    setVideoModalOpen(true);
  };

  const currentMedia = allMedia[currentIndex];

  return (
    <>
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl={selectedVideoUrl}
        title={title}
      />
      
      <div className="relative group">
        {currentMedia.type === 'video' ? (
          <div 
            className="relative w-full h-64 bg-black cursor-pointer"
            onClick={() => openVideoFullscreen(currentMedia.url)}
          >
            <video 
              key={currentMedia.url}
              className="w-full h-full object-contain pointer-events-none"
              preload="metadata"
              muted
            >
              <source src={currentMedia.url} type="video/mp4" />
            </video>
            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                <Play className="w-8 h-8 text-primary-foreground fill-primary-foreground ml-1" />
              </div>
            </div>
            {/* Expand hint */}
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Expand className="w-3 h-3" />
              Tap to watch
            </div>
          </div>
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
    </>
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
        .order('updated_at', { ascending: false });
      
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
                    
                    {/* Contact Numbers */}
                    <div className="flex flex-col gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="font-medium">Contact:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <a 
                          href="tel:+918056987186" 
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          8056987186
                        </a>
                        <span className="text-muted-foreground">|</span>
                        <a 
                          href="tel:+919789541145" 
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          9789541145
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          const message = `Hi, I'm interested in the property: ${property.title} - ${property.location} (${property.price})`;
                          window.open(`https://wa.me/918056987186?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={async () => {
                          const propertyUrl = `${window.location.origin}/?property=${property.id}`;
                          const shareText = `🏠 ${property.title}\n📍 ${property.location}\n💰 ${property.price}\n📐 ${property.area}\n\n${property.description || ''}\n\nView property: ${propertyUrl}`;
                          
                          // Check if native share is supported
                          if (navigator.share) {
                            try {
                              // First try simple share (works on all devices with share API)
                              await navigator.share({
                                title: property.title,
                                text: shareText,
                                url: propertyUrl,
                              });
                              return; // Success - exit early
                            } catch (err) {
                              // Only show fallback if it's not a user cancel
                              if ((err as Error).name === 'AbortError') {
                                return; // User cancelled - do nothing
                              }
                              // Fall through to clipboard fallback
                            }
                          }
                          
                          // Fallback: copy to clipboard only if share API not available
                          try {
                            await navigator.clipboard.writeText(shareText);
                            alert('Property details copied to clipboard!');
                          } catch {
                            // Last resort fallback
                            const textArea = document.createElement('textarea');
                            textArea.value = shareText;
                            document.body.appendChild(textArea);
                            textArea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textArea);
                            alert('Property details copied to clipboard!');
                          }
                        }}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
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