-- Temporary debug trigger to see what metadata is actually available
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  metadata jsonb;
  role_value text;
BEGIN
  -- Get the metadata
  metadata := new.raw_user_meta_data;
  role_value := metadata->>'role';
  
  -- Log what we're seeing (this will appear in Supabase logs)
  RAISE NOTICE 'New user created: %', new.id;
  RAISE NOTICE 'Email: %', new.email;
  RAISE NOTICE 'Role from metadata: %', role_value;
  RAISE NOTICE 'Full metadata: %', metadata::text;
  
  -- Create a supplier entry if the role is 'supplier'
  IF role_value = 'supplier' THEN
    RAISE NOTICE 'Creating supplier with company_name: %', COALESCE(metadata->>'company_name', 'NOT FOUND');
    
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
  ELSIF role_value = 'agent' THEN
    RAISE NOTICE 'Creating agent with agency_name: %', COALESCE(metadata->>'agency_name', 'NOT FOUND');
    RAISE NOTICE 'license_number: %', COALESCE(metadata->>'license_number', 'NOT FOUND');
    RAISE NOTICE 'city: %', COALESCE(metadata->>'city', 'NOT FOUND');
    
    INSERT INTO public.agent_profiles (
      id, 
      email,
      agency_name,
      license_number,
      website_url,
      city,
      country_code,
      address,
      phone_number,
      has_agreed_tc
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
      metadata->>'phone_number',
      CASE 
        WHEN metadata->>'has_agreed_tc' = 'true' THEN true
        ELSE false
      END
    )
    ON CONFLICT (id) DO NOTHING;
  ELSE
    RAISE NOTICE 'No role found or unrecognized role: %', role_value;
  END IF;

  RETURN new;
END;
$$;

-- Make sure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
