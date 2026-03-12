

## Plan: Rediseño completo del Home — About Us + Sliders dinámicos

### Estructura final de la landing (de arriba a abajo)
1. Hero carrusel (ya existe, se mantiene)
2. **About Us** (nueva sección)
3. **Propiedades Destacadas** — slider automático con CTA fijo a la derecha
4. **Inversiones Destacadas** — slider automático con CTA fijo a la izquierda
5. Contacto (ya existe)
6. Footer

### Sección About Us (nueva)

Layout de 2 columnas (imagen izquierda, texto derecha). Imagen mockup webp de equipo profesional (Unsplash). Contenido:

- Headline: "Somos Q+"
- Texto principal sobre rentabilidad, inversiones seguras a corto/mediano/largo plazo
- Servicios: evaluación, seguimiento, venta y administración de capital
- Profundización del equipo: "Un equipo multidisciplinario con experiencia en marketing digital, análisis financiero y relaciones estratégicas con empresarios e inversionistas. Nuestra red de contactos y alianzas nos permite identificar oportunidades antes que el mercado, garantizando decisiones informadas y resultados medibles."
- Framer motion fade-in

### Sección Propiedades Destacadas

- Eliminar el `FeaturedSlider` actual con tabs
- Nuevo componente: fila horizontal con **CTA fijo a la derecha** + **slider automático a la izquierda** con 4 propiedades reales de la BD
- Slider: Embla carousel con autoplay lento (velocidad de scroll continuo), mostrando `PropertyCard` simplificado
- CTA fijo: bloque con fondo azul oscuro, texto "Propiedades Destacadas", subtexto, y botón "Ver todas" → `/propiedades`
- Datos: fetch de `properties` (status = 'available', limit 4) con su `property_media` (is_main)

### Sección Inversiones Destacadas

- Misma estructura pero **invertida**: CTA fijo a la **izquierda**, slider a la **derecha**
- Fetch de `investments` (active = true, limit 4)
- Cards de inversión con país, tipo, retorno esperado
- CTA: "Inversiones Internacionales", botón "Explorar" → `/inversiones`

### Archivos

| Archivo | Acción |
|---|---|
| `src/components/home/AboutSection.tsx` | Crear |
| `src/components/home/PropertiesSlider.tsx` | Crear — slider auto + CTA derecha |
| `src/components/home/InvestmentsSlider.tsx` | Crear — CTA izquierda + slider auto |
| `src/pages/Index.tsx` | Reemplazar `FeaturedSlider` por las 3 nuevas secciones |
| `src/components/home/FeaturedSlider.tsx` | Ya no se importa (puede eliminarse) |

