-- First, let's see what policies exist
-- Run this to check current policies:
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename IN ('agent_profiles', 'suppliers');

-- Disable RLS temporarily to test (DO NOT USE IN PRODUCTION)
-- ALTER TABLE agent_profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;

-- OR, create proper policies:

-- Drop ALL policies on agent_profiles
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'agent_profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON agent_profiles';
    END LOOP;
END $$;

-- Drop ALL policies on suppliers
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'suppliers') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON suppliers';
    END LOOP;
END $$;

-- Create single permissive policy for agent_profiles
CREATE POLICY "Allow all authenticated access to agent_profiles"
ON agent_profiles
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create single permissive policy for suppliers
CREATE POLICY "Allow all authenticated access to suppliers"
ON suppliers
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow anon to view active suppliers (for public portal)
CREATE POLICY "Allow anon to view active suppliers"
ON suppliers
FOR SELECT
TO anon
USING (subscription_status = 'active');
