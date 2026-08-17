-- Private / exclusive listings support: a flag on properties, plus a leads
-- table for the registration gate on the "Propiedades Privadas" section.

ALTER TABLE public.properties
  ADD COLUMN is_private boolean NOT NULL DEFAULT false;

CREATE TABLE public.private_listing_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  identificacion text NOT NULL,
  celular text NOT NULL,
  correo text NOT NULL,
  propiedad_id uuid REFERENCES public.properties(id) ON DELETE SET NULL,
  consiente_tratamiento_datos boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.private_listing_leads ENABLE ROW LEVEL SECURITY;

-- The public registration form can insert a lead, but only when the
-- Habeas Data consent checkbox was checked (enforced server-side too).
CREATE POLICY "Anyone can submit a private listing lead"
  ON public.private_listing_leads FOR INSERT TO public
  WITH CHECK (consiente_tratamiento_datos = true);

-- Leads contain personal data (identificacion, celular, correo) — only
-- authenticated staff can read or manage them, never the public.
CREATE POLICY "Auth users can manage private listing leads"
  ON public.private_listing_leads FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL);
