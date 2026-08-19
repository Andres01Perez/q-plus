-- 1. Lock down internal trigger functions
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.generate_slug() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- 2. Profiles: own profile only (admins can view all)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true));

-- 3. Property media metadata: owner or admin
DROP POLICY IF EXISTS "Auth users can manage property media" ON public.property_media;
CREATE POLICY "Owners and admins can manage property media"
ON public.property_media FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.properties pr WHERE pr.id = property_id AND pr.created_by = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.properties pr WHERE pr.id = property_id AND pr.created_by = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true)
);

-- 4. Property values: owner or admin
DROP POLICY IF EXISTS "Auth users can manage property values" ON public.property_values;
CREATE POLICY "Owners and admins can manage property values"
ON public.property_values FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.properties pr WHERE pr.id = property_id AND pr.created_by = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.properties pr WHERE pr.id = property_id AND pr.created_by = auth.uid())
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true)
);

-- 5. Taxonomy: admins only
DROP POLICY IF EXISTS "Auth users can manage attributes" ON public.attributes;
CREATE POLICY "Admins can manage attributes"
ON public.attributes FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true));

DROP POLICY IF EXISTS "Auth users can manage blocks" ON public.blocks;
CREATE POLICY "Admins can manage blocks"
ON public.blocks FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true));

-- 6. Storage: property-media writes restricted to owner/admin (folder = property id, or 'new' for drafts)
DROP POLICY IF EXISTS "Auth users can upload property media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload property media" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can update property media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update property media" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can delete property media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete property media" ON storage.objects;

CREATE POLICY "Owners and admins can upload property media files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'property-media' AND (
    (storage.foldername(name))[1] = 'new'
    OR EXISTS (SELECT 1 FROM public.properties pr WHERE pr.id::text = (storage.foldername(name))[1] AND pr.created_by = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true)
  )
);

CREATE POLICY "Owners and admins can update property media files"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'property-media' AND (
    EXISTS (SELECT 1 FROM public.properties pr WHERE pr.id::text = (storage.foldername(name))[1] AND pr.created_by = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true)
  )
)
WITH CHECK (
  bucket_id = 'property-media' AND (
    EXISTS (SELECT 1 FROM public.properties pr WHERE pr.id::text = (storage.foldername(name))[1] AND pr.created_by = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true)
  )
);

CREATE POLICY "Owners and admins can delete property media files"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'property-media' AND (
    EXISTS (SELECT 1 FROM public.properties pr WHERE pr.id::text = (storage.foldername(name))[1] AND pr.created_by = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true)
  )
);