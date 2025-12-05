-- Fix the trigger to read from the correct metadata field
-- Supabase stores custom data in raw_user_meta_data at trigger time
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  metadata jsonb;
BEGIN
  -- Get the metadata
  metadata := new.raw_user_meta_data;
  
  -- Create a supplier entry if the role is 'supplier'
  IF metadata->>'role' = 'supplier' THEN
    INSERT INTO public.suppliers (
      id, 
      contact_email, 
      company_name,
      country_code,
      base_currency
    )
    VALUES (
      new.id, 
      new.email,
      COALESCE(metadata->>'company_name', 'Pending Setup'),
      COALESCE(metadata->>'country_code', 'US'),
      COALESCE(metadata->>'base_currency', 'USD')
    )
    ON CONFLICT (id) DO NOTHING;
    
  -- Create an agent entry if the role is 'agent'
  ELSIF metadata->>'role' = 'agent' THEN
    INSERT INTO public.agent_profiles (
      id, 
      email,
      agency_name,
      license_number,
      website_url,
      city,
      country_code,
      address,
      phone_number
    )
    VALUES (
      new.id, 
      new.email,
      COALESCE(metadata->>'agency_name', 'Pending Setup'),
      COALESCE(metadata->>'license_number', 'Pending'),
      metadata->>'website_url',
      metadata->>'city',
      metadata->>'country_code',
      metadata->>'address',
      metadata->>'phone_number'
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$;

-- Make sure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
