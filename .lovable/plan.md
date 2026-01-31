

## Diagnóstico del Problema

### Causa Raíz Identificada

El problema NO es un bug de código, sino una **restricción de seguridad (RLS)** que funciona correctamente.

**Evidencia encontrada en los logs de red:**
- La solicitud PATCH se envía con `"area_m2": 211` (valor correcto)
- El servidor responde `204 No Content` (sin error)
- Pero la base de datos NO actualiza la fila porque el usuario actual NO es el creador

**Datos relevantes:**
| Campo | Valor |
|-------|-------|
| Creador original de la propiedad | `517bd35c-fffe-4404-a5d6-6a47c7b4fa4d` |
| Usuario actual intentando editar | `e273dfb1-0af7-45b9-85f3-ee2a924c6cb3` |

**Política RLS actual:**
```sql
Policy Name: Owners can update properties
Command: UPDATE
USING (auth.uid() = created_by)
```

Esto significa que solo el usuario que creó la propiedad puede editarla.

---

## Plan de Solución

Proponemos **dos mejoras** para resolver este problema:

### 1. Agregar Rol de Administrador a la Política RLS

Modificar la política para que los administradores (usuarios con `is_admin = true` en la tabla `profiles`) también puedan editar cualquier propiedad.

**Migración SQL:**
```sql
-- Eliminar política actual
DROP POLICY IF EXISTS "Owners can update properties" ON properties;

-- Crear nueva política que permite a propietarios Y administradores
CREATE POLICY "Owners and admins can update properties"
  ON properties FOR UPDATE
  USING (
    auth.uid() = created_by 
    OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- También actualizar la política de DELETE para consistencia
DROP POLICY IF EXISTS "Owners can delete properties" ON properties;

CREATE POLICY "Owners and admins can delete properties"
  ON properties FOR DELETE
  USING (
    auth.uid() = created_by 
    OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.is_admin = true
    )
  );
```

### 2. Mejorar el Manejo de Errores en el Código

Modificar `usePropertyForm.ts` para verificar si el UPDATE realmente afectó filas y mostrar un mensaje de error claro si no se pudo actualizar.

**Cambios en `src/hooks/usePropertyForm.ts`:**

```typescript
// En la función saveProperty, después del update:
if (propertyId) {
  const { data, error, count } = await supabase
    .from("properties")
    .update(propertyData)
    .eq("id", propertyId)
    .select()  // Agregar select para obtener datos
    .single(); // Obtener una fila

  if (error) throw error;
  
  // Verificar si se actualizó algo
  if (!data) {
    toast({
      title: "Sin permisos",
      description: "No tienes permisos para editar esta propiedad",
      variant: "destructive",
    });
    return null;
  }
  
  savedPropertyId = propertyId;
}
```

---

## Resumen de Archivos a Modificar

| Archivo | Cambio |
|---------|--------|
| **Migración SQL** | Actualizar políticas RLS para incluir administradores |
| `src/hooks/usePropertyForm.ts` | Mejorar detección de errores de permisos |

---

## Sección Tecnica

### Por que el Status 204 no indica error

Supabase/PostgREST devuelve `204 No Content` para operaciones UPDATE exitosas, pero esto NO garantiza que se haya modificado alguna fila. Cuando RLS filtra las filas, el UPDATE simplemente no encuentra coincidencias y devuelve exito sin modificar nada.

### Solucion Robusta

Usar `.select()` despues del `.update()` nos permite obtener la fila actualizada. Si no hay datos devueltos, significa que:
1. La fila no existe, o
2. RLS impidio la actualizacion

En ambos casos, debemos informar al usuario en lugar de mostrar un mensaje de exito falso.

