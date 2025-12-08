-- Allow admins to view all suppliers
DROP POLICY IF EXISTS "Admins can view all suppliers" ON suppliers;
CREATE POLICY "Admins can view all suppliers"
ON suppliers FOR SELECT
TO authenticated
USING (
  is_admin() OR 
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Allow admins to update suppliers (for approval/rejection)
DROP POLICY IF EXISTS "Admins can update suppliers" ON suppliers;
CREATE POLICY "Admins can update suppliers"
ON suppliers FOR UPDATE
TO authenticated
USING (
  is_admin() OR 
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
