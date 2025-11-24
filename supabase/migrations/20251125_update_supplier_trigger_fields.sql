-- Update handle_new_user function to include required fields from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Only create a supplier entry if the role is 'supplier'
  IF new.raw_user_meta_data->>'role' = 'supplier' THEN
    INSERT INTO public.suppliers (
      id, 
      contact_email,
      company_name,
      country_code,
      base_currency
    )
    VALUES (
      new.id, 
      new.email, -- Use the auth email as the initial contact email
      new.raw_user_meta_data->>'company_name',
      new.raw_user_meta_data->>'country_code',
      new.raw_user_meta_data->>'base_currency'
    );
  END IF;

  RETURN new;
END;
$$;
