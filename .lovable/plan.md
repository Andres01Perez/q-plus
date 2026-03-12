

## Plan: CRUD de Contenido Destacado en Admin

### 1. Nuevo archivo: `src/pages/admin/contenido/FeaturedSectionsList.tsx`

Pagina de listado + crear/editar inline (dialog modal). Sigue el patron de `PropertyList.tsx`:

- Tabla con columnas: Titulo, Tipo (badge), Orden, Activo (badge verde/gris), Acciones
- Boton "Nuevo" en header
- Dialog con formulario para crear/editar:
  - Tipo: Select dropdown (servicios / propiedades / inversiones)
  - Titulo: Input text
  - Subtitulo: Textarea
  - URL de imagen: Input text + preview de imagen debajo si hay URL
  - Label CTA: Input text
  - URL CTA: Input text
  - Orden: Input number
  - Activo: Switch toggle
- Eliminar con AlertDialog de confirmacion
- CRUD via Supabase client directo (sin react-query, consistente con PropertyList)

### 2. Modificar `src/pages/admin/AdminLayout.tsx`

Agregar nuevo item en `menuItems` entre Propiedades y Configuracion:

```text
{
  label: 'Contenido Destacado',
  icon: Star,  // de lucide-react
  path: '/admin/contenido-destacado'
}
```

### 3. Modificar `src/App.tsx`

Agregar ruta:
```text
<Route path="contenido-destacado" element={<FeaturedSectionsList />} />
```

### Archivos

| Archivo | Accion |
|---|---|
| `src/pages/admin/contenido/FeaturedSectionsList.tsx` | Crear |
| `src/pages/admin/AdminLayout.tsx` | Agregar menu item |
| `src/App.tsx` | Agregar ruta |

No se necesitan cambios de base de datos — la tabla `featured_sections` ya existe con los campos necesarios y RLS configurado.

