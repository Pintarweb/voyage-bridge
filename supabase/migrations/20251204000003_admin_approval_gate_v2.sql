-- First, let's make sure the role columns exist
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS role text DEFAULT 'supplier';
ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'agent';

-- Ensure default values for status columns
ALTER TABLE suppliers ALTER COLUMN subscription_status SET DEFAULT 'pending';
ALTER TABLE agent_profiles ALTER COLUMN verification_status SET DEFAULT 'pending';

-- Simplified trigger that only inserts required columns
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Only create a supplier entry if the role is 'supplier'
  IF new.raw_user_meta_data->>'role' = 'supplier' THEN
    INSERT INTO public.suppliers (id, contact_email)
    VALUES (new.id, new.email)
    ON CONFLICT (id) DO NOTHING;
  ELSIF new.raw_user_meta_data->>'role' = 'agent' THEN
    INSERT INTO public.agent_profiles (id, email)
    VALUES (new.id, new.email)
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$;

-- Create helper function to check if user is approved
CREATE OR REPLACE FUNCTION public.is_approved()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.suppliers 
    WHERE id = auth.uid() AND subscription_status = 'active'
  ) OR EXISTS (
    SELECT 1 FROM public.agent_profiles 
    WHERE id = auth.uid() AND verification_status = 'approved'
  );
$$;

-- Enable RLS on core tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Policy for Products: Only approved users can view
DROP POLICY IF EXISTS "Approved users can view products" ON products;
CREATE POLICY "Approved users can view products"
ON products FOR SELECT
TO authenticated
USING (is_approved());

-- Policy for Bookings: Only approved users can view
DROP POLICY IF EXISTS "Approved users can view bookings" ON bookings;
CREATE POLICY "Approved users can view bookings"
ON bookings FOR SELECT
TO authenticated
USING (is_approved());

-- Policy for Agent Profiles: Users can view their own, approved users can view others
DROP POLICY IF EXISTS "Users can view own agent profile" ON agent_profiles;
CREATE POLICY "Users can view own agent profile"
ON agent_profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Approved users can view all agent profiles" ON agent_profiles;
CREATE POLICY "Approved users can view all agent profiles"
ON agent_profiles FOR SELECT
TO authenticated
USING (is_approved());

-- Policy for Suppliers: Users can view their own, approved users can view others
DROP POLICY IF EXISTS "Users can view own supplier profile" ON suppliers;
CREATE POLICY "Users can view own supplier profile"
ON suppliers FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Approved users can view all supplier profiles" ON suppliers;
CREATE POLICY "Approved users can view all supplier profiles"
ON suppliers FOR SELECT
TO authenticated
USING (is_approved());

-- Allow Anon access (for public portal) - explicitly
DROP POLICY IF EXISTS "Anon can view suppliers" ON suppliers;
CREATE POLICY "Anon can view suppliers"
ON suppliers FOR SELECT
TO anon
USING (true);

-- Drop the old permissive policy if it exists
DROP POLICY IF EXISTS "Enable read access for all users" ON suppliers;
