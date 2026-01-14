-- Q+ Real Estate - Motor de Contenido Modular

-- Enum para tipos de bloque
CREATE TYPE public.block_type AS ENUM ('checklist', 'details_list', 'free_text');

-- Enum para tipos de input
CREATE TYPE public.input_type AS ENUM ('checkbox', 'text', 'number', 'textarea');

-- Enum para estado de propiedad
CREATE TYPE public.property_status AS ENUM ('available', 'sold', 'rented', 'reserved', 'draft');

-- Enum para modo de visualización de precio
CREATE TYPE public.price_display_mode AS ENUM ('sale', 'rent', 'both', 'hidden');

-- Enum para tipo de media
CREATE TYPE public.media_type AS ENUM ('image', 'video');

-- Tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de propiedades
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  main_description TEXT,
  price_sale NUMERIC(15, 2),
  price_rent NUMERIC(15, 2),
  display_price_mode public.price_display_mode DEFAULT 'sale',
  address TEXT,
  city TEXT,
  neighborhood TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  status public.property_status DEFAULT 'draft',
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_m2 NUMERIC(10, 2),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de bloques de información
CREATE TABLE public.blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  type public.block_type NOT NULL DEFAULT 'checklist',
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de atributos por bloque
CREATE TABLE public.attributes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  block_id UUID NOT NULL REFERENCES public.blocks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  input_type public.input_type NOT NULL DEFAULT 'checkbox',
  is_required BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de valores de propiedades (EAV pattern)
CREATE TABLE public.property_values (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  attribute_id UUID NOT NULL REFERENCES public.attributes(id) ON DELETE CASCADE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(property_id, attribute_id)
);

-- Tabla de media de propiedades
CREATE TABLE public.property_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type public.media_type NOT NULL DEFAULT 'image',
  provider TEXT,
  display_order INTEGER DEFAULT 0,
  caption TEXT,
  is_main BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blocks_updated_at BEFORE UPDATE ON public.blocks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_attributes_updated_at BEFORE UPDATE ON public.attributes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_property_values_updated_at BEFORE UPDATE ON public.property_values FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para generar slug
CREATE OR REPLACE FUNCTION public.generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = LOWER(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || SUBSTR(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER generate_property_slug BEFORE INSERT ON public.properties FOR EACH ROW EXECUTE FUNCTION public.generate_slug();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_media ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for properties (public read, auth write)
CREATE POLICY "Anyone can view available properties" ON public.properties FOR SELECT USING (status != 'draft' OR auth.uid() = created_by);
CREATE POLICY "Auth users can create properties" ON public.properties FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Owners can update properties" ON public.properties FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Owners can delete properties" ON public.properties FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for blocks (public read, admin write)
CREATE POLICY "Anyone can view active blocks" ON public.blocks FOR SELECT USING (is_active = true);
CREATE POLICY "Auth users can manage blocks" ON public.blocks FOR ALL USING (auth.uid() IS NOT NULL);

-- RLS Policies for attributes
CREATE POLICY "Anyone can view attributes" ON public.attributes FOR SELECT USING (true);
CREATE POLICY "Auth users can manage attributes" ON public.attributes FOR ALL USING (auth.uid() IS NOT NULL);

-- RLS Policies for property_values
CREATE POLICY "Anyone can view property values" ON public.property_values FOR SELECT USING (true);
CREATE POLICY "Auth users can manage property values" ON public.property_values FOR ALL USING (auth.uid() IS NOT NULL);

-- RLS Policies for property_media
CREATE POLICY "Anyone can view property media" ON public.property_media FOR SELECT USING (true);
CREATE POLICY "Auth users can manage property media" ON public.property_media FOR ALL USING (auth.uid() IS NOT NULL);

-- Índices para optimización
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_slug ON public.properties(slug);
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_blocks_display_order ON public.blocks(display_order);
CREATE INDEX idx_attributes_block_id ON public.attributes(block_id);
CREATE INDEX idx_property_values_property ON public.property_values(property_id);
CREATE INDEX idx_property_media_property ON public.property_media(property_id);

-- Datos iniciales de bloques
INSERT INTO public.blocks (name, display_order, type, icon, is_active) VALUES
  ('Características Internas', 1, 'checklist', 'home', true),
  ('Características Externas', 2, 'checklist', 'tree', true),
  ('Servicios Públicos', 3, 'checklist', 'zap', true),
  ('Entorno', 4, 'checklist', 'map-pin', true),
  ('Área Jurídica', 5, 'details_list', 'file-text', true),
  ('Observaciones', 6, 'free_text', 'message-square', true);

-- Atributos iniciales
INSERT INTO public.attributes (block_id, name, input_type, display_order) 
SELECT b.id, attr.name, attr.input_type::public.input_type, attr.display_order
FROM public.blocks b
CROSS JOIN (
  VALUES 
    ('Características Internas', 'Cocina integral', 'checkbox', 1),
    ('Características Internas', 'Closets', 'checkbox', 2),
    ('Características Internas', 'Cuarto de servicio', 'checkbox', 3),
    ('Características Internas', 'Estudio', 'checkbox', 4),
    ('Características Internas', 'Aire acondicionado', 'checkbox', 5),
    ('Características Externas', 'Parqueadero', 'checkbox', 1),
    ('Características Externas', 'Piscina', 'checkbox', 2),
    ('Características Externas', 'Jardín', 'checkbox', 3),
    ('Características Externas', 'Terraza', 'checkbox', 4),
    ('Servicios Públicos', 'Agua', 'checkbox', 1),
    ('Servicios Públicos', 'Luz', 'checkbox', 2),
    ('Servicios Públicos', 'Gas Natural', 'checkbox', 3),
    ('Servicios Públicos', 'Internet', 'checkbox', 4),
    ('Entorno', 'Cerca de colegios', 'checkbox', 1),
    ('Entorno', 'Cerca de centros comerciales', 'checkbox', 2),
    ('Entorno', 'Cerca de transporte público', 'checkbox', 3),
    ('Entorno', 'Zona residencial', 'checkbox', 4),
    ('Área Jurídica', 'Escritura pública', 'text', 1),
    ('Área Jurídica', 'Matrícula inmobiliaria', 'text', 2),
    ('Área Jurídica', 'Estado legal', 'text', 3)
) AS attr(block_name, name, input_type, display_order)
WHERE b.name = attr.block_name;