-- Add missing columns to agent_profiles for registration
ALTER TABLE public.agent_profiles
ADD COLUMN IF NOT EXISTS agency_name text,
ADD COLUMN IF NOT EXISTS license_number text,
ADD COLUMN IF NOT EXISTS website_url text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS country_code text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS has_agreed_tc boolean DEFAULT false;

-- Add role column to suppliers for registration consistency
-- Use DO block to handle conditional adding of typed column safer
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'suppliers' AND column_name = 'role') THEN
        ALTER TABLE public.suppliers ADD COLUMN role user_role DEFAULT 'pending_supplier';
    END IF;
END $$;
