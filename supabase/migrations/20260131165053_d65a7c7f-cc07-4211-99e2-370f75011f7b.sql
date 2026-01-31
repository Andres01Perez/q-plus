-- Eliminar política actual de UPDATE
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

-- Eliminar política actual de DELETE
DROP POLICY IF EXISTS "Owners can delete properties" ON properties;

-- Crear nueva política de DELETE para consistencia
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