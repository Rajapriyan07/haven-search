-- Make the properties bucket public for viewing
UPDATE storage.buckets SET public = true WHERE id = 'properties';

-- Allow admins to upload to the properties bucket
CREATE POLICY "Admins can upload property images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'properties' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow admins to update property images
CREATE POLICY "Admins can update property images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'properties' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow admins to delete property images
CREATE POLICY "Admins can delete property images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'properties' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow anyone to view property images (public bucket)
CREATE POLICY "Anyone can view property images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'properties');