
## Plan: Corregir Logo del Sidebar Admin

### Problema Identificado

El logo en el sidebar del panel administrativo aparece como un cuadrado blanco debido a los filtros CSS `brightness-0 invert` aplicados en la línea 89 de `AdminLayout.tsx`.

### Causa Raíz

```css
brightness-0  /* Convierte toda la imagen a negro solido */
invert        /* Invierte negro a blanco */
```

Esta combinacion aplana cualquier logo con detalles o colores a un rectangulo blanco solido.

---

### Solucion Propuesta

**Archivo a modificar:** `src/pages/admin/AdminLayout.tsx`

**Cambio:** Remover los filtros CSS problematicos y ajustar el contraste de forma mas sutil.

```text
Antes (linea 89):
<img src={logo} className="h-10 w-auto brightness-0 invert" />
                                    ^^^^^^^^^^^^^^^^^^^^
                                    Causa el cuadrado blanco

Despues:
<img src={logo} className="h-10 w-auto" />
```

---

### Alternativas de Estilo

Si el logo necesita adaptarse al fondo oscuro del sidebar, hay opciones mas elegantes:

| Opcion | Clase CSS | Efecto |
|--------|-----------|--------|
| Sin filtro | (ninguna) | Logo original |
| Contraste suave | `contrast-125 brightness-110` | Mejora visibilidad |
| Drop shadow | `drop-shadow-lg` | Agrega sombra para destacar |

---

### Impacto

Solo afecta el logo del sidebar en el panel de administracion. Los otros usos del logo (loading screen, mobile header) no tienen estos filtros y se mostraran correctamente.

---

## Seccion Tecnica

### Ubicaciones del Logo en AdminLayout.tsx

| Linea | Contexto | Clases actuales | Cambio necesario |
|-------|----------|-----------------|------------------|
| 60 | Loading screen | `h-12 w-auto` | Ninguno |
| 72 | Mobile header | `h-8 w-auto` | Ninguno |
| 89 | Sidebar | `h-10 w-auto brightness-0 invert` | Remover filtros |

### Codigo Final

```tsx
// Linea 89 - Cambiar de:
<img src={logo} alt="Q+ Inmobiliaria" className="h-10 w-auto brightness-0 invert" />

// A:
<img src={logo} alt="Q+ Inmobiliaria" className="h-10 w-auto" />
```
