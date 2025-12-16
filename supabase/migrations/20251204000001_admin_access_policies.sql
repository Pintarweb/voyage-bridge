-- Add policies to allow admin access to all agent and supplier profiles
-- This assumes you have an admin user or will add admin role logic

-- For now, we'll allow service role to bypass RLS (which is already the case)
-- But for the frontend admin page, we need to allow reading pending profiles

-- Update agent_profiles policy to allow reading pending profiles for admin purposes
DROP POLICY IF EXISTS "Admins can view all agent profiles" ON agent_profiles;
CREATE POLICY "Admins can view all agent profiles"
ON agent_profiles FOR SELECT
TO authenticated
USING (
  -- Allow if user is viewing their own profile
  auth.uid() = id
  OR
  -- Allow if user is approved (existing logic)
  (
    EXISTS (
      SELECT 1 FROM public.suppliers 
      WHERE id = auth.uid() AND subscription_status = 'active'
    ) OR EXISTS (
      SELECT 1 FROM public.agent_profiles 
      WHERE id = auth.uid() AND verification_status = 'approved'
    )
  )
  OR
  -- TODO: Add admin check here when you implement admin roles
  -- For now, you can temporarily allow all authenticated users to view pending agents
  -- Remove this in production and add proper admin role check
  true
);

-- Update suppliers policy similarly
DROP POLICY IF EXISTS "Admins can view all supplier profiles" ON suppliers;
CREATE POLICY "Admins can view all supplier profiles"
ON suppliers FOR SELECT
TO authenticated
USING (
  -- Allow if user is viewing their own profile
  auth.uid() = id
  OR
  -- Allow if user is approved
  (
    EXISTS (
      SELECT 1 FROM public.suppliers 
      WHERE id = auth.uid() AND subscription_status = 'active'
    ) OR EXISTS (
      SELECT 1 FROM public.agent_profiles 
      WHERE id = auth.uid() AND verification_status = 'approved'
    )
  )
  OR
  -- TODO: Add admin check here
  true
);

-- Note: The "true" at the end temporarily allows all authenticated users to view all profiles
-- In production, replace this with a proper admin role check like:
-- auth.jwt() ->> 'role' = 'admin'
