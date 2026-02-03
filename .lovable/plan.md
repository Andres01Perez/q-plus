

## Plan: Actualizar Informacion de Contacto Oficial

### Informacion a Implementar

| Campo | Valor |
|-------|-------|
| Celular | 3168754469 |
| Correo | qplusinmobiliaria@gmail.com |
| Instagram | https://www.instagram.com/qplus.inmobiliaria/ |
| TikTok | https://www.tiktok.com/@qplus_inmobiliaria |
| YouTube | https://www.youtube.com/@QPlus_Inmobiliaria |

---

### Archivos a Modificar

| Archivo | Cambios |
|---------|---------|
| `src/components/layout/Footer.tsx` | Actualizar telefono, email, redes sociales (Instagram, TikTok, YouTube) |
| `src/pages/Index.tsx` | Actualizar seccion de contacto con info oficial y redes sociales |
| `src/components/property/detail/PropertyContactCard.tsx` | Cambiar numero de WhatsApp a 573168754469 |

---

### 1. Footer - Rediseno de Redes Sociales

Actualizaremos el footer con las 3 redes oficiales:

```text
Redes Sociales Actuales:     Nuevas Redes:
+---+  +---+  +---+          +---+  +---+  +---+
| F |  | I |  | in|    -->   | I |  | TT|  | YT|
+---+  +---+  +---+          +---+  +---+  +---+
Facebook Instagram LinkedIn  Instagram TikTok YouTube
```

**Cambios especificos:**
- Quitar Facebook y LinkedIn
- Mantener Instagram con nuevo link oficial
- Agregar TikTok con icono SVG personalizado
- Agregar YouTube con icono de Lucide
- Actualizar telefono: +57 316 875 4469
- Actualizar email: qplusinmobiliaria@gmail.com

---

### 2. Seccion de Contacto en Index

La seccion de contacto en la pagina principal mostrara:

```text
+--------------------------------------------------+
|        ¿Interesado en alguna propiedad?          |
|   Contactanos y te ayudaremos a encontrar        |
|           el hogar perfecto para ti              |
|                                                  |
|  +------------+  +------------+  +------------+  |
|  |   Telefono |  |   Email    |  |  Direccion |  |
|  | 316 875    |  | qplus...   |  |  Bogota    |  |
|  | 4469       |  | @gmail.com |  |            |  |
|  +------------+  +------------+  +------------+  |
|                                                  |
|  Siguenos en redes:                              |
|  [IG] [TT] [YT]                                  |
+--------------------------------------------------+
```

---

### 3. PropertyContactCard - WhatsApp Funcional

Actualizar el numero de WhatsApp para que los usuarios puedan contactar directamente:

```typescript
// Cambiar de:
const phoneNumber = "573001234567";

// A:
const phoneNumber = "573168754469";
```

---

## Seccion Tecnica

### Iconos SVG Personalizados

Se creara un componente SVG para TikTok ya que Lucide no incluye este icono. YouTube si esta disponible en Lucide como `Youtube`.

### Formato del Numero de Telefono

- **Display:** +57 316 875 4469 (legible para humanos)
- **WhatsApp API:** 573168754469 (sin espacios ni simbolos)
- **Link tel:** +573168754469

### Links de Redes Sociales

Todos los links abriran en nueva pestana (`target="_blank"`) con `rel="noopener noreferrer"` por seguridad.

