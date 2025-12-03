-- Add images array column to store multiple image URLs
ALTER TABLE public.properties ADD COLUMN images text[] DEFAULT '{}';

-- Migrate existing image_url data to the new images array
UPDATE public.properties 
SET images = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND image_url != '';