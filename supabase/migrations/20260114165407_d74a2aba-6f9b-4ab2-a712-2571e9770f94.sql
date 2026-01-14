-- Create property-media storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-media',
  'property-media',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']
);

-- Policy: Authenticated users can upload media
CREATE POLICY "Authenticated users can upload property media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-media');

-- Policy: Anyone can view property media (public bucket)
CREATE POLICY "Anyone can view property media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'property-media');

-- Policy: Authenticated users can update their uploads
CREATE POLICY "Authenticated users can update property media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'property-media');

-- Policy: Authenticated users can delete media
CREATE POLICY "Authenticated users can delete property media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'property-media');