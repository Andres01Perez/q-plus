

## Plan: Slider continuo infinito (CSS marquee) para Propiedades e Inversiones

### Problema actual
Los sliders usan Embla Carousel con `scrollNext()` cada 4s — produce saltos discretos y solo carga 4 items.

### Solucion
Reemplazar Embla por una animacion CSS tipo **marquee continuo**: duplicar los items en el DOM y usar `@keyframes` con `translateX` para scroll infinito sin cortes ni pausas.

### Cambios

| Archivo | Cambio |
|---|---|
| `src/components/home/PropertiesSlider.tsx` | Eliminar Embla, usar CSS marquee continuo, quitar `.limit(4)` para traer todas las propiedades |
| `src/components/home/InvestmentsSlider.tsx` | Igual: eliminar Embla, CSS marquee continuo, quitar `.limit(4)` para traer todas las inversiones |

### Detalle tecnico

- Quitar `useEmblaCarousel` y el `setInterval` autoplay
- Renderizar los items duplicados (`[...items, ...items]`) dentro de un contenedor con animacion CSS
- Animacion: `@keyframes scroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }` aplicada con `animation: scroll Xs linear infinite`
- Velocidad calculada segun cantidad de items (~8s por item para movimiento lento y elegante)
- Pausar al hover (`animation-play-state: paused`) para permitir interaccion
- Quitar `.limit(4)` de ambas queries para traer todos los registros

