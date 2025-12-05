-- Disable RLS again
ALTER TABLE agent_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "agent_view_own" ON agent_profiles;
DROP POLICY IF EXISTS "agent_update_own" ON agent_profiles;
DROP POLICY IF EXISTS "agent_view_all" ON agent_profiles;
DROP POLICY IF EXISTS "supplier_view_own" ON suppliers;
DROP POLICY IF EXISTS "supplier_update_own" ON suppliers;
DROP POLICY IF EXISTS "supplier_view_all" ON suppliers;
DROP POLICY IF EXISTS "supplier_view_active_anon" ON suppliers;

-- Re-enable RLS
ALTER TABLE agent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Create SINGLE comprehensive SELECT policy for agent_profiles
CREATE POLICY "agent_profiles_select_policy"
ON agent_profiles FOR SELECT
USING (true);  -- Allow all reads for now

-- Create UPDATE policy for agent_profiles (users can only update their own)
CREATE POLICY "agent_profiles_update_policy"
ON agent_profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create SINGLE comprehensive SELECT policy for suppliers
CREATE POLICY "suppliers_select_policy"
ON suppliers FOR SELECT
USING (true);  -- Allow all reads for now

-- Create UPDATE policy for suppliers (users can only update their own)
CREATE POLICY "suppliers_update_policy"
ON suppliers FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Note: USING (true) allows all authenticated AND anonymous users to read
-- This is intentional for the admin dashboard and public portal
-- In production, you should add role-based checks
