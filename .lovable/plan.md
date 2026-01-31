

## Plan: Herramientas de Optimizacion de Imagenes

### Situacion Actual

Actualmente las imagenes se cargan directamente desde la URL completa sin ninguna optimizacion:

| Problema | Impacto |
|----------|---------|
| Imagenes a resolucion completa | Cargas lentas, especialmente en movil |
| Sin lazy loading | Todas las imagenes cargan de inmediato |
| Sin placeholder mientras carga | Experiencia visual pobre |
| Sin srcset/sizes | Imagenes no optimizadas para cada dispositivo |

### Solucion Propuesta

Implementar un sistema de optimizacion de imagenes con las siguientes caracteristicas:

---

### 1. Componente OptimizedImage

Crear un componente reutilizable que maneje todas las optimizaciones:

```text
+------------------------------------------+
|  OptimizedImage Component                 |
|  +------------------------------------+  |
|  |  - Lazy loading nativo            |  |
|  |  - Placeholder blur mientras carga |  |
|  |  - srcset para diferentes tamaños  |  |
|  |  - Transicion suave al cargar      |  |
|  |  - Fallback en caso de error       |  |
|  +------------------------------------+  |
+------------------------------------------+
```

**Archivo:** `src/components/ui/optimized-image.tsx`

```tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean; // Para imagenes above-the-fold
  aspectRatio?: "video" | "square" | "portrait";
}
```

---

### 2. Utilidad para Transformar URLs de Storage

Aprovechando que Lovable Cloud Storage soporta transformaciones de imagenes, crear una utilidad para generar diferentes tamaños:

**Archivo:** `src/lib/image-utils.ts`

```typescript
// Generar URL optimizada con parametros de transformacion
export function getOptimizedUrl(url: string, options: {
  width?: number;
  quality?: number;
}): string;

// Generar srcset para imagenes responsivas
export function generateSrcSet(url: string): string;

// Generar URL de thumbnail para previews
export function getThumbnailUrl(url: string): string;
```

---

### 3. Actualizar Componentes Existentes

| Componente | Cambios |
|------------|---------|
| `PropertyGallery.tsx` | Usar OptimizedImage con lazy loading, thumbnails optimizados para grid |
| `PropertyCard.tsx` | Usar OptimizedImage con placeholder blur |
| `PropertyMediaSection.tsx` | Thumbnails de 96px para previews del formulario |

---

### 4. Implementar Lazy Loading Inteligente

- **Imagen principal de galeria:** `priority={true}` - carga inmediata
- **Imagenes secundarias del grid:** lazy loading nativo
- **Imagenes en carousel movil:** solo cargar las visibles +1
- **Imagenes en lightbox:** cargar bajo demanda

---

### 5. Estados de Carga con Skeleton

Agregar estados visuales durante la carga:

```text
Estado: Cargando          Estado: Cargado
+------------------+      +------------------+
|  ░░░░░░░░░░░░░  |      |                  |
|  ░░ Skeleton ░░  | -->  |     Imagen       |
|  ░░░░░░░░░░░░░  |      |    (fade-in)     |
+------------------+      +------------------+
```

---

## Archivos a Crear

| Archivo | Descripcion |
|---------|-------------|
| `src/lib/image-utils.ts` | Utilidades para transformar URLs |
| `src/components/ui/optimized-image.tsx` | Componente de imagen optimizada |

## Archivos a Modificar

| Archivo | Cambios |
|---------|---------|
| `src/components/property/PropertyCard.tsx` | Usar OptimizedImage |
| `src/components/property/detail/PropertyGallery.tsx` | Lazy loading + OptimizedImage |
| `src/components/property/form/PropertyMediaSection.tsx` | Thumbnails optimizados |

---

## Seccion Tecnica

### Estrategia de Optimizacion

1. **Lazy Loading Nativo**: Usar el atributo `loading="lazy"` que es soportado por todos los navegadores modernos (+95% de usuarios).

2. **Placeholder con Skeleton**: Mostrar un skeleton animado mientras la imagen carga, con transicion fade-in cuando termina.

3. **Deteccion de Storage**: Si la URL viene de Lovable Cloud Storage, aplicar parametros de transformacion para redimensionar en servidor.

4. **Sizes Attribute**: Definir tamaños esperados para que el navegador descargue la imagen correcta:
   - Cards: `(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw`
   - Galeria principal: `(max-width: 768px) 100vw, 60vw`

5. **IntersectionObserver para Lightbox**: Solo cargar imagenes del lightbox cuando el usuario las solicita.

### Beneficios Esperados

| Metrica | Mejora Estimada |
|---------|-----------------|
| Tiempo de carga inicial | -40% a -60% |
| Datos transferidos en lista | -50% a -70% |
| Core Web Vitals (LCP) | Mejora significativa |
| Experiencia en movil | Mucho mas fluida |

