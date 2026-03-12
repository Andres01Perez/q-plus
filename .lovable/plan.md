

## Plan: Paginación 8-por-página con Card "Ver Más"

### Cambios en `src/pages/Properties.tsx`

**1. Grid layout**: Cambiar de 3 columnas a 4 en desktop.

```text
Desktop:  grid-cols-4    (4 columnas)
Tablet:   grid-cols-2    (2 columnas)
Móvil:    grid-cols-1    (1 columna)
```

**2. Paginación offset con estado**

- Nuevo estado `page` (inicia en 0)
- Mostrar `page * 8` hasta `(page + 1) * 8` de `filteredProperties`
- Si hay más de 8 propiedades restantes, la posición 8 se reemplaza por el card especial "Ver más"
- Es decir: se muestran 7 propiedades + 1 card CTA cuando hay más páginas

**3. Card especial "Ver más"**

- Mismo tamaño que PropertyCard
- Fondo con gradiente sutil, icono de flecha
- Muestra conteo restante: `+ {remaining} propiedades más`
- Al hacer clic, incrementa `page` y muestra las siguientes 8 (o las que queden)
- Si quedan 8 o menos en la página actual, se muestran todas sin card especial

**4. Framer Motion stagger**

- Cada card envuelto en `motion.div` con `initial/animate` y `transition.delay` basado en índice
- Fade-in + slide-up con stagger de ~0.05s por card

**5. Reset de página al filtrar**

- Cuando cambie `searchQuery` o `cityFilter`, resetear `page` a 0

**6. Skeletons**: Actualizar a 8 skeletons con el nuevo grid de 4 columnas

### Lógica de paginación

```text
totalFiltered = filteredProperties.length
pageStart = page * PAGE_SIZE          // PAGE_SIZE = 8
pageItems = filteredProperties.slice(pageStart, pageStart + PAGE_SIZE)
hasMore = pageStart + PAGE_SIZE < totalFiltered
remaining = totalFiltered - pageStart - (hasMore ? 7 : pageItems.length)

Si hasMore:
  → Mostrar pageItems[0..6] (7 cards) + 1 card "Ver más"
Si no:
  → Mostrar todos los pageItems normalmente
```

### Archivos a modificar

| Archivo | Cambio |
|---|---|
| `src/pages/Properties.tsx` | Paginación, grid 4-col, card CTA, framer-motion stagger, reset al filtrar |

