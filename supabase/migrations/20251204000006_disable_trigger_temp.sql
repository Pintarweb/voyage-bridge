-- TEMPORARY FIX: Disable the trigger to allow registration
-- This will let us see if the issue is with the trigger or something else

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- We'll re-enable it after we figure out what's wrong
-- For now, users will need to be created manually in the suppliers/agent_profiles tables
