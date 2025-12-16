-- Fix the trigger to include company_name which is NOT NULL
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Only create a supplier entry if the role is 'supplier'
  IF new.raw_user_meta_data->>'role' = 'supplier' THEN
    -- company_name is required, so we use a placeholder or get it from metadata
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
      COALESCE(new.raw_user_meta_data->>'company_name', 'Pending Setup'),
      COALESCE(new.raw_user_meta_data->>'country_code', 'US'),
      COALESCE(new.raw_user_meta_data->>'base_currency', 'USD')
    )
    ON CONFLICT (id) DO NOTHING;
  ELSIF new.raw_user_meta_data->>'role' = 'agent' THEN
    INSERT INTO public.agent_profiles (id, email)
    VALUES (new.id, new.email)
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
