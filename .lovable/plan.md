

## Plan: Rediseño visual — Blanco + Negro + Azul Oscuro

### Paleta nueva
- Fondo principal: blanco (`#FFFFFF`)
- Textos: negro (`#000000`) y azul oscuro (`#050A30`)
- Acentos: azul oscuro para CTAs y badges
- Eliminar todos los dorados/gold y fondos oscuros de las paginas publicas

### Archivos a modificar

| Archivo | Cambio |
|---|---|
| `src/components/home/HeroSection.tsx` | Reescribir completo: carrusel con 2 slides (propiedades + inversiones), altura 50vh, fondo blanco, imagenes mockup webp, textos negro/azul oscuro |
| `src/components/home/FeaturedSlider.tsx` | Cambiar fondo de `bg-luxury-bg-alt` a blanco, textos negros, tabs con estilo azul oscuro, cards con bordes grises claros |
| `src/pages/Index.tsx` | Cambiar `bg-luxury-bg` a `bg-white`, seccion contacto con textos negros, cards con bordes grises, iconos azul oscuro, redes sociales en negro |
| `src/pages/Inversiones.tsx` | Rediseñar completo: fondo blanco, hero con overlay claro sobre imagen, metricas en azul oscuro, cards con fondo blanco y bordes grises, quiz CTA en azul oscuro, bloque confianza limpio |
| `src/components/home/GridBackground.tsx` | Cambiar grid sutil a version clara (lineas gris muy claro en vez de gold) |

### Hero Carrusel — Detalle

- Reemplazar el hero full-screen por un carrusel Embla (ya tenemos `embla-carousel-react` instalado) a **50vh** de altura
- **Slide 1 — Propiedades**: Imagen mockup de propiedad moderna (webp via URL placeholder), headline "Tu proxima propiedad, una decision inteligente", CTA "Ver propiedades" → `/propiedades`
- **Slide 2 — Inversiones**: Imagen mockup de skyline/inversion (webp via URL placeholder), headline "Invierte en el exterior con respaldo experto", CTA "Explorar inversiones" → `/inversiones`
- Indicadores de puntos abajo, autoplay cada 5s
- Textos sobre imagen con overlay sutil blanco/oscuro parcial
- Animaciones de entrada con framer-motion

### Imagenes mockup webp
- Usar URLs de Unsplash en formato webp (parametro `&fm=webp`) para carga rapida
- Propiedades: imagen de casa moderna/apartamento
- Inversiones: imagen de skyline/ciudad internacional

### Inversiones — Cambios especificos
- Hero: mantener imagen de fondo pero con overlay mas claro, textos en blanco sobre imagen, metricas en azul oscuro sobre fondo blanco debajo
- Grid de oportunidades: cards blancas con sombra sutil, bordes gris claro, badges de tipo en azul oscuro, retorno en verde
- Quiz CTA: fondo azul oscuro con texto blanco (en vez de gradiente gold)
- Bloque confianza: fondo blanco, iconos azul oscuro, bordes gris claro

