-- Re-enable RLS with proper policies
ALTER TABLE agent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Agent Profiles Policies
-- 1. Users can view their own profile
CREATE POLICY "agent_view_own"
ON agent_profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 2. Users can update their own profile
CREATE POLICY "agent_update_own"
ON agent_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 3. Allow all authenticated users to view all agent profiles (for admin dashboard)
-- In production, replace this with a proper admin role check
CREATE POLICY "agent_view_all"
ON agent_profiles FOR SELECT
TO authenticated
USING (true);

-- Supplier Policies
-- 1. Users can view their own profile
CREATE POLICY "supplier_view_own"
ON suppliers FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 2. Users can update their own profile
CREATE POLICY "supplier_update_own"
ON suppliers FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 3. Allow all authenticated users to view all suppliers (for admin dashboard)
-- In production, replace this with a proper admin role check
CREATE POLICY "supplier_view_all"
ON suppliers FOR SELECT
TO authenticated
USING (true);

-- 4. Allow anonymous users to view active suppliers (for public portal)
CREATE POLICY "supplier_view_active_anon"
ON suppliers FOR SELECT
TO anon
USING (subscription_status = 'active');
