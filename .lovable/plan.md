

## Plan: Propiedades Reales desde Base de Datos

### Situacion Actual

El componente `Index.tsx` utiliza un array `mockProperties` con datos ficticios. Necesitamos reemplazar esto con propiedades reales de la base de datos.

### Cambios Propuestos

**Archivo a modificar:** `src/pages/Index.tsx`

---

### 1. Agregar Query a Base de Datos

Usar el mismo patron que `Properties.tsx` para obtener propiedades reales:

```text
Antes:                          Despues:
+------------------+            +------------------+
| const mockProps  |    -->     | useEffect +      |
| = [...]          |            | supabase query   |
| (datos fijos)    |            | (datos reales)   |
+------------------+            +------------------+
```

**Query a implementar:**
- Obtener propiedades con `status != 'draft'`
- Incluir `property_media` para imagen principal
- Limitar a 3 resultados
- Ordenar por fecha de creacion (mas recientes primero)

---

### 2. Agregar Estado de Carga

Implementar estado loading con skeleton animado mientras cargan las propiedades:

```text
+------------+  +------------+  +------------+
| ░░░░░░░░░ |  | ░░░░░░░░░ |  | ░░░░░░░░░ |
| ░ Loading |  | ░ Loading |  |   Call    |
| ░░░░░░░░░ |  | ░░░░░░░░░ |  | to Action |
+------------+  +------------+  +------------+
  Propiedad 1    Propiedad 2    Ver todas
```

---

### 3. Tarjeta Call-to-Action

Agregar una cuarta tarjeta como call-to-action que lleve a `/propiedades`:

| Elemento | Descripcion |
|----------|-------------|
| Estilo | Mismo tamaño que PropertyCard pero con diseño diferente |
| Icono | Flecha o icono de "ver mas" |
| Texto | "Ver todas las propiedades" |
| Accion | Navegar a `/propiedades` |

**Diseño propuesto:**
```text
+------------------------+
|                        |
|     [Icono Flecha]     |
|                        |
|   Ver todas nuestras   |
|      propiedades       |
|                        |
|   [X propiedades mas]  |
+------------------------+
```

---

### 4. Estructura del Grid

El grid mantendra 2 columnas en desktop pero mostrara:

| Posicion | Contenido |
|----------|-----------|
| 1 | Propiedad real #1 |
| 2 | Propiedad real #2 |
| 3 | Propiedad real #3 |
| 4 | Tarjeta Call-to-Action |

---

## Seccion Tecnica

### Imports a Agregar

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
```

### Estado y Query

```typescript
const [properties, setProperties] = useState<Property[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadFeaturedProperties = async () => {
    const { data } = await supabase
      .from('properties')
      .select(`
        id, slug, title, address, city,
        price_sale, price_rent, display_price_mode,
        bedrooms, bathrooms, area_m2, status,
        property_media (url, is_main)
      `)
      .neq('status', 'draft')
      .order('created_at', { ascending: false })
      .limit(3);
    
    setProperties(data || []);
    setLoading(false);
  };
  
  loadFeaturedProperties();
}, []);
```

### Logica para Imagen Principal

```typescript
const getMainImage = (property: Property) => {
  const mainMedia = property.property_media?.find(m => m.is_main);
  return mainMedia?.url || property.property_media?.[0]?.url;
};
```

### Eliminar Codigo

- Eliminar el array `mockProperties` (lineas 16-73)
- Eliminar el boton "Ver todas las propiedades" que esta debajo del grid (ya que la cuarta tarjeta cumple esa funcion)

