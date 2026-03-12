

## Plan: Rediseno Home Page — Dark/Gold Luxury con Featured Sliders

### Resumen

Redisenar la pagina principal con estetica dark/gold luxury, hero premium con gradientes dorados, seccion de sliders con tabs alimentados desde base de datos, y mantener la seccion de contacto existente. Se necesita instalar `framer-motion`.

---

### 1. Nueva tabla en base de datos: `featured_sections`

```sql
CREATE TYPE public.featured_section_type AS ENUM ('servicios', 'propiedades', 'inversiones');

CREATE TABLE public.featured_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type featured_section_type NOT NULL,
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

-- Public read for active items
CREATE POLICY "Anyone can view active featured sections"
  ON public.featured_sections FOR SELECT TO public
  USING (active = true);

-- Auth users can manage
CREATE POLICY "Auth users can manage featured sections"
  ON public.featured_sections FOR ALL TO public
  USING (auth.uid() IS NOT NULL);
```

---

### 2. Instalar dependencia

Agregar `framer-motion` al proyecto para animaciones fluidas.

---

### 3. Nuevos componentes

| Componente | Descripcion |
|---|---|
| `src/components/home/HeroSection.tsx` | Hero fullscreen con fondo oscuro, grid sutil animado, headline con texto gradiente dorado, dos CTAs |
| `src/components/home/FeaturedSlider.tsx` | Tabs (Servicios / Propiedades Destacadas / Inversiones) con cards horizontales scrolleables, datos de Supabase |
| `src/components/home/GridBackground.tsx` | Componente de fondo con grid sutil animado |

---

### 4. HeroSection — Estructura

```text
+--------------------------------------------------+
|  [Grid sutil animado de fondo]                   |
|                                                   |
|   Tu proxima propiedad,                          |
|   una decision inteligente  <-- gradiente dorado  |
|                                                   |
|   Subtitulo corto en blanco/gris                 |
|                                                   |
|   [Ver propiedades]  [Quiero invertir]           |
|     (dorado filled)    (dorado outline)           |
+--------------------------------------------------+
```

**Detalles:**
- Fondo: `bg-[#0a0a0a]` con grid pattern SVG sutil
- Headline: `bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent`
- CTA primario: fondo dorado, texto oscuro
- CTA secundario: borde dorado, texto dorado
- Animaciones con `framer-motion` (fade-in + slide-up secuencial)

---

### 5. FeaturedSlider — Estructura

```text
+--------------------------------------------------+
|  [Servicios] [Propiedades Destacadas] [Inversiones]
|                                                   |
|  +--------+  +--------+  +--------+  +--------+  |
|  | Card 1 |  | Card 2 |  | Card 3 |  | Card 4 |  |
|  | img    |  | img    |  | img    |  | img    |  |
|  | titulo |  | titulo |  | titulo |  | titulo |  |
|  | subtit |  | subtit |  | subtit |  | subtit |  |
|  | [CTA]  |  | [CTA]  |  | [CTA]  |  | [CTA]  |  |
|  +--------+  +--------+  +--------+  +--------+  |
|        <--- scroll horizontal --->                |
+--------------------------------------------------+
```

**Detalles:**
- Tabs con estilo dorado (borde inferior activo)
- Cards con imagen, titulo, subtitulo y CTA
- Scroll horizontal con `overflow-x-auto snap-x snap-mandatory`
- Fondo oscuro (`bg-[#0f0f0f]`), bordes dorados sutiles
- Data desde `featured_sections` filtrado por `type` y `active = true`, ordenado por `display_order`

---

### 6. Modificar `src/pages/Index.tsx`

- Reemplazar hero actual por `<HeroSection />`
- Reemplazar seccion de propiedades destacadas por `<FeaturedSlider />`
- Mantener seccion de contacto con redes sociales (adaptar colores al tema dark/gold)
- La seccion de contacto se oscurece: fondo `bg-[#0a0a0a]`, textos blancos/dorados

---

### 7. Paleta de colores Gold/Dark

| Uso | Color |
|---|---|
| Fondo principal | `#0a0a0a` |
| Fondo secundario | `#0f0f0f` |
| Dorado principal | `#d4af37` |
| Dorado claro | `#f5d780` |
| Dorado gradiente | `from-amber-200 via-yellow-400 to-amber-200` |
| Texto primario | `#ffffff` |
| Texto secundario | `#9ca3af` (gray-400) |
| Bordes | `#d4af37/20` |

---

### 8. CSS Additions (`index.css`)

Agregar utilidades para el grid background y el gradiente dorado.

---

### Archivos a crear/modificar

| Archivo | Accion |
|---|---|
| `src/components/home/HeroSection.tsx` | Crear |
| `src/components/home/FeaturedSlider.tsx` | Crear |
| `src/components/home/GridBackground.tsx` | Crear |
| `src/pages/Index.tsx` | Reescribir |
| `src/index.css` | Agregar utilidades gold |
| DB migration | Crear tabla `featured_sections` |
| `package.json` | Agregar `framer-motion` |

