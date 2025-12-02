-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price TEXT NOT NULL,
  area TEXT NOT NULL,
  type TEXT NOT NULL,
  image_url TEXT,
  badge TEXT,
  description TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Allow public read access for all properties (public website)
CREATE POLICY "Anyone can view properties" 
ON public.properties 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample properties
INSERT INTO public.properties (title, location, price, area, type, image_url, badge, description, featured) VALUES
('Premium Land Development', 'Hillside Valley, CA', '$2.5M', '25 Acres', 'Land', '/placeholder.svg', 'Prime Location', 'Exceptional development opportunity with panoramic views and approved zoning for residential projects.', true),
('Modern Family Estate', 'Riverside Heights, TX', '$850K', '3,200 sq ft', 'Home', '/placeholder.svg', 'Move-in Ready', 'Contemporary design with luxury finishes, smart home features, and stunning landscape architecture.', true),
('Commercial Land Plot', 'Downtown District, FL', '$1.8M', '5.2 Acres', 'Commercial', '/placeholder.svg', 'High ROI', 'Strategic commercial location with high traffic and excellent visibility for retail or office development.', true);