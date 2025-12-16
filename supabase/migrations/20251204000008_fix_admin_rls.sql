-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own profile" ON agent_profiles;
DROP POLICY IF EXISTS "Approved users can view all profiles" ON agent_profiles;
DROP POLICY IF EXISTS "Admins can view all agent profiles" ON agent_profiles;

-- Create a simple policy that allows all authenticated users to SELECT
-- This is temporary for testing - in production you should add proper admin role checks
DROP POLICY IF EXISTS "Allow authenticated users to view agent profiles" ON agent_profiles;
CREATE POLICY "Allow authenticated users to view agent profiles"
ON agent_profiles FOR SELECT
TO authenticated
USING (true);

-- Do the same for suppliers
DROP POLICY IF EXISTS "Users can view own supplier profile" ON suppliers;
DROP POLICY IF EXISTS "Approved users can view all suppliers" ON suppliers;
DROP POLICY IF EXISTS "Admins can view all supplier profiles" ON suppliers;
DROP POLICY IF EXISTS "Anon can view suppliers" ON suppliers;

DROP POLICY IF EXISTS "Allow authenticated users to view suppliers" ON suppliers;
CREATE POLICY "Allow authenticated users to view suppliers"
ON suppliers FOR SELECT
TO authenticated
USING (true);

-- Keep the anon policy for public portal
DROP POLICY IF EXISTS "Allow anon to view active suppliers" ON suppliers;
CREATE POLICY "Allow anon to view active suppliers"
ON suppliers FOR SELECT
TO anon
USING (subscription_status = 'active');
