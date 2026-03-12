

## Plan: Pagina /inversiones + tabla `investments`

### 1. Database Migration

Crear tabla `investments`:

```sql
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

-- Public read for active
CREATE POLICY "Anyone can view active investments"
  ON public.investments FOR SELECT TO public
  USING (active = true);

-- Auth users manage
CREATE POLICY "Auth users can manage investments"
  ON public.investments FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL);
```

### 2. Nuevo archivo: `src/pages/Inversiones.tsx`

Pagina completa con 4 secciones:

**Seccion 1 — Hero**: Fondo con imagen de skyline + overlay oscuro semi-transparente. Badge dorado "Inversiones Internacionales". Headline grande "Invierte en el exterior con respaldo experto". Tres metricas animadas con `framer-motion` (contadores que suben): "USD 2M+ gestionados", "15+ paises", "200+ inversores". CTA boton dorado "Descubre tu perfil de inversor" que lleva a `#quiz`.

**Seccion 2 — Grid de oportunidades**: Fetch de `investments` (active=true). Cards premium oscuras con: bandera emoji del pais + nombre, badge de tipo (residencial/comercial/fondo), retorno esperado en badge verde, monto minimo formateado. Grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Animacion stagger con framer-motion.

**Seccion 3 — CTA Quiz**: Bloque centrado con gradiente dorado, icono TrendingUp, titulo "Que tipo de inversor eres?", descripcion corta, boton grande "Hacer el test gratuito" → `#quiz`.

**Seccion 4 — Bloque de confianza**: 3 columnas con iconos (Shield, PieChart, FileCheck), titulos y descripciones de 2 lineas. Fondo oscuro con bordes dorados sutiles.

### 3. Modificar `src/App.tsx`

Agregar ruta `/inversiones` → `<Inversiones />`.

### 4. Modificar `src/components/layout/Header.tsx`

Agregar link "Inversiones" entre "Propiedades" y "Contacto" en desktop y mobile nav.

### Archivos

| Archivo | Accion |
|---|---|
| DB migration | Crear tabla `investments` |
| `src/pages/Inversiones.tsx` | Crear |
| `src/App.tsx` | Agregar ruta |
| `src/components/layout/Header.tsx` | Agregar link nav |

