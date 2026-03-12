CREATE TYPE public.investment_type AS ENUM ('residencial', 'comercial', 'fondo');

CREATE TABLE public.investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  country text NOT NULL,
  city text,
  type investment_type NOT NULL,
  min_amount numeric NOT NULL,
  expected_return numeric,
  currency text DEFAULT 'USD',
  image_url text,
  slug text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active investments"
  ON public.investments FOR SELECT TO public
  USING (active = true);

CREATE POLICY "Auth users can manage investments"
  ON public.investments FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL);