-- Replace the handle_new_user function to respect user roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Only create a supplier entry if the role is 'supplier'
  IF new.raw_user_meta_data->>'role' = 'supplier' THEN
    INSERT INTO public.suppliers (id, contact_email)
    VALUES (new.id, new.email);
  END IF;

  -- Note: Agent profiles are currently created by the frontend.
  -- If you want to automate agent profile creation here, you can add:
  -- ELSIF new.raw_user_meta_data->>'role' = 'agent' THEN
  --   INSERT INTO public.agent_profiles (id, email) VALUES (new.id, new.email);
  
  RETURN new;
END;
$$;

-- Ensure the trigger exists (re-creating it ensures it uses the updated function)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
