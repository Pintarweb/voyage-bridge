-- Temporarily disable RLS for testing
-- WARNING: This removes all access control - only use for testing!

ALTER TABLE agent_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;

-- To re-enable later (after we fix the policies):
-- ALTER TABLE agent_profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
