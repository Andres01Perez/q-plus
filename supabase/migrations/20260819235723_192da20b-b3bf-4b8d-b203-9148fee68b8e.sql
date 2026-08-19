ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS is_private boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.private_listing_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  identificacion text NOT NULL,
  celular text NOT NULL,
  correo text NOT NULL,
  consiente_tratamiento_datos boolean NOT NULL DEFAULT false,
  propiedad_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

GRANT INSERT ON public.private_listing_leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.private_listing_leads TO authenticated;
GRANT ALL ON public.private_listing_leads TO service_role;

ALTER TABLE public.private_listing_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
ON public.private_listing_leads FOR INSERT TO anon, authenticated
WITH CHECK (consiente_tratamiento_datos = true);

CREATE POLICY "Admins can view leads"
ON public.private_listing_leads FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true));

CREATE POLICY "Admins can update leads"
ON public.private_listing_leads FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true));

CREATE POLICY "Admins can delete leads"
ON public.private_listing_leads FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_admin = true));