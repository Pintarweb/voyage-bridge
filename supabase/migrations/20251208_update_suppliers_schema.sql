-- Migration to update suppliers table
-- 1. Ensure RLS is enabled
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- 2. Update role to use ENUM if not already
-- First check if we need to convert. If role is text, we cast it.
DO $$ BEGIN
    -- Cast existing 'pending_supplier' text to enum if column is text
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'suppliers' AND column_name = 'role' AND data_type = 'text') THEN
        ALTER TABLE suppliers
          ALTER COLUMN role DROP DEFAULT,
          ALTER COLUMN role TYPE user_role USING role::user_role,
          ALTER COLUMN role SET DEFAULT 'pending_supplier'::user_role;
    END IF;
END $$;

-- 3. Add new columns if they don't exist
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- 4. Ensure NOT NULL constraints where appropriate (based on prompt implying defaults are handled)
-- prompt: "role (Type: user_role ENUM, value: 'pending_supplier')" handled above.

-- 5. Create Policy for Insert (Registration)
-- Allow authenticated users (who just signed up) to insert their own profile
DROP POLICY IF EXISTS "Users can insert their own supplier profile" ON suppliers;
CREATE POLICY "Users can insert their own supplier profile"
ON suppliers FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 6. Create Policy for Select (Dashboard)
DROP POLICY IF EXISTS "Suppliers can view own profile" ON suppliers;
CREATE POLICY "Suppliers can view own profile"
ON suppliers FOR SELECT
TO authenticated
USING (auth.uid() = id);
