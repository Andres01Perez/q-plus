CREATE TYPE public.featured_section_type AS ENUM ('servicios', 'propiedades', 'inversiones');

CREATE TABLE public.featured_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.featured_section_type NOT NULL,
  title text NOT NULL,
  subtitle text,
  image_url text,
  cta_label text,
  cta_url text,
  display_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.featured_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active featured sections"
  ON public.featured_sections FOR SELECT TO public
  USING (active = true);

CREATE POLICY "Auth users can manage featured sections"
  ON public.featured_sections FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL);