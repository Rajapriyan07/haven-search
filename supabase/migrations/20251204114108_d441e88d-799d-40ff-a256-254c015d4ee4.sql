-- Add videos column to properties table
ALTER TABLE public.properties 
ADD COLUMN videos text[] DEFAULT '{}'::text[];