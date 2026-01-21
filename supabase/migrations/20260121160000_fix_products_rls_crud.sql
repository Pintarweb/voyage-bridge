-- Migration to fix Products RLS: Add INSERT, UPDATE, DELETE policies
-- And update is_approved() to check the is_approved column

-- 1. Update is_approved helper function
CREATE OR REPLACE FUNCTION public.is_approved()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.suppliers 
    WHERE id = auth.uid() AND is_approved = true
  ) OR EXISTS (
    SELECT 1 FROM public.agent_profiles 
    WHERE id = auth.uid() AND is_approved = true
  );
$$;

-- 2. Add INSERT policy for products
DROP POLICY IF EXISTS "Suppliers can insert own products" ON products;
CREATE POLICY "Suppliers can insert own products"
ON products FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = supplier_id AND is_approved()
);

-- 3. Add UPDATE policy for products
DROP POLICY IF EXISTS "Suppliers can update own products" ON products;
CREATE POLICY "Suppliers can update own products"
ON products FOR UPDATE
TO authenticated
USING (
    auth.uid() = supplier_id AND is_approved()
)
WITH CHECK (
    auth.uid() = supplier_id AND is_approved()
);

-- 4. Add DELETE policy for products
DROP POLICY IF EXISTS "Suppliers can delete own products" ON products;
CREATE POLICY "Suppliers can delete own products"
ON products FOR DELETE
TO authenticated
USING (
    auth.uid() = supplier_id AND is_approved()
);
