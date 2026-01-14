-- Fix handle_new_user to include first_name and last_name
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
  
  -- Create a supplier entry if the role is 'supplier' or 'pending_supplier'
  IF role_value = 'supplier' OR role_value = 'pending_supplier' THEN
    RAISE NOTICE 'Creating supplier with company_name: %', COALESCE(metadata->>'company_name', 'NOT FOUND');
    
    INSERT INTO public.suppliers (
      id, 
      contact_email, 
      company_name,
      country_code,
      base_currency,
      role -- Explicitly set role
    )
    VALUES (
      new.id, 
      new.email,
      COALESCE(metadata->>'company_name', 'Pending Setup'),
      COALESCE(metadata->>'country_code', 'US'),
      COALESCE(metadata->>'base_currency', 'USD'),
      'pending_supplier' -- Always start as pending
    )
    ON CONFLICT (id) DO NOTHING;
    
  -- Create an agent entry if the role is 'agent' or 'pending_agent'
  ELSIF role_value = 'agent' OR role_value = 'pending_agent' THEN
    RAISE NOTICE 'Creating agent with agency_name: %', COALESCE(metadata->>'agency_name', 'NOT FOUND');
    
    INSERT INTO public.agent_profiles (
      id, 
      email,
      first_name,
      last_name,
      agency_name,
      license_number,
      website_url,
      city,
      country_code,
      address,
      phone_number,
      has_agreed_tc,
      role -- Explicitly set role
    )
    VALUES (
      new.id, 
      new.email,
      metadata->>'first_name',
      metadata->>'last_name',
      COALESCE(metadata->>'agency_name', 'Pending Setup'),
      COALESCE(metadata->>'license_number', 'Pending'),
      metadata->>'website_url',
      metadata->>'city',
      metadata->>'country_code',
      metadata->>'address',
      metadata->>'phone_number',
      CASE 
        WHEN metadata->>'has_agreed_tc' = 'true' OR metadata->'has_agreed_tc' = 'true' THEN true
        ELSE false
      END,
      'pending_agent'::user_role -- Explicitly cast to user_role enum
    )
    ON CONFLICT (id) DO NOTHING;
  ELSE
    RAISE NOTICE 'No role found or unrecognized role: %', role_value;
  END IF;

  RETURN new;
END;
$$;
