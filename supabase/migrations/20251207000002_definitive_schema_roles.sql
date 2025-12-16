-- 1. Create User Role Enum
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'agent', 'supplier', 'pending_agent', 'pending_supplier');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create helper function to check for admin role
-- This function checks the JWT app_metadata for the 'admin' role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    FALSE
  );
$$;

-- 3. Refactor agent_profiles Table
-- Convert role column from text to user_role enum
ALTER TABLE agent_profiles
  ALTER COLUMN role DROP DEFAULT;

ALTER TABLE agent_profiles
  ALTER COLUMN role TYPE user_role 
  USING role::user_role;

ALTER TABLE agent_profiles
  ALTER COLUMN role SET DEFAULT 'pending_agent'::user_role;

-- Ensure other columns exist (idempotent checks)
ALTER TABLE agent_profiles 
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE agent_profiles 
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- Enable RLS
ALTER TABLE agent_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS Policy for Admin
-- First drop to ensure clean slate or avoid errors if exists
DROP POLICY IF EXISTS "Admins can manage all agent profiles" ON agent_profiles;

CREATE POLICY "Admins can manage all agent profiles"
  ON agent_profiles
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Also allow users to read their own profile (basic requirement usually, but prompt didn't specify, likely existing policies handle it)
-- Retaining existing policies or creating a basic read own policy might be needed if "simple_rls_policies" was too broad.
-- Assuming previous policies might interfere, but the prompt asked to create the Admin policy specifically.

-- 4. Create admin_profiles Table
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  internal_notes TEXT,
  last_verification_date TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS Policy for Admin Profiles
DROP POLICY IF EXISTS "Admins can view own profile" ON admin_profiles;

CREATE POLICY "Admins can view own profile"
  ON admin_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 5. Update triggers to handle ENUM (if necessary)
-- The existing function update_role_on_approval sets role = 'agent'. 
-- Since 'agent' is a valid enum value, the cast should happen automatically or work fine.
-- But it's good practice to ensure the function works with the Enum.

CREATE OR REPLACE FUNCTION update_role_on_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- For agent_profiles: change role from pending_agent to agent when approved
  IF TG_TABLE_NAME = 'agent_profiles' THEN
    IF NEW.verification_status = 'approved' AND OLD.verification_status != 'approved' THEN
      NEW.role = 'agent'::user_role;
    END IF;
  END IF;

  -- For suppliers: change role from pending_supplier to supplier when active
  -- Note: We haven't converted suppliers table role yet, but assuming we should only touch agent_profiles as per prompt?
  -- Prompt said "Define and implement the definitive database schema for user roles... Task 2 Refactor agent_profiles".
  -- It didn't explicitly say refactor suppliers, but 'user_role' enum includes 'supplier' and 'pending_supplier'.
  -- It's safer to leave suppliers alone unless asked, to avoid breaking it, OR cast it if we want consistency. 
  -- For now, I'll update the agent logic in the trigger only.
  
  -- If suppliers table exists and we want to be safe about the trigger
  IF TG_TABLE_NAME = 'suppliers' THEN
     -- Keep existing logic for now, it's text based unless we altered table.
    IF NEW.subscription_status = 'active' AND OLD.subscription_status != 'active' THEN
      -- If we didn't change suppliers.role to enum, this must remain text.
      -- If we did, we need cast.
      -- Prompt didn't ask to refactor suppliers table. sticking to agent_profiles.
      NEW.role = 'supplier'; 
    END IF;
  END IF;

  RETURN NEW;
END; 
$$;
