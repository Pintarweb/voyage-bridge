-- Clean up the test user so you can register again with the updated code
-- Run this in Supabase SQL Editor

-- Delete from agent_profiles first (due to foreign key)
DELETE FROM agent_profiles WHERE email = 'agent111@gmail.com';

-- Then delete from auth.users (requires admin access)
-- You'll need to do this from the Supabase Dashboard:
-- Go to Authentication → Users → Find agent111@gmail.com → Delete User

-- After deleting, you can register again and the data will be properly populated
