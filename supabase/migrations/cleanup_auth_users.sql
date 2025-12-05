-- Clean up orphaned auth users (users without profiles)
-- Run this in Supabase SQL Editor

-- First, let's see which users exist
SELECT id, email, raw_user_meta_data->>'role' as role, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- Delete all auth users (this will cascade and delete any remaining profile records)
-- WARNING: This will delete ALL users including any real accounts!
-- Only run this if you're sure you want to start fresh
DELETE FROM auth.users;

-- Alternative: Delete only users with specific role
-- DELETE FROM auth.users WHERE raw_user_meta_data->>'role' = 'agent';
-- DELETE FROM auth.users WHERE raw_user_meta_data->>'role' = 'supplier';

-- After deletion, you can register fresh users
