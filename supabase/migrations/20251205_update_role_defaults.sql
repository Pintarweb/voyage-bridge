-- Update role column defaults to pending_agent and pending_supplier
-- And create trigger to update role on approval

-- 1. Update default values for role column
ALTER TABLE agent_profiles 
ALTER COLUMN role SET DEFAULT 'pending_agent';

ALTER TABLE suppliers 
ALTER COLUMN role SET DEFAULT 'pending_supplier';

-- 2. Update existing pending users to have the new role values
UPDATE agent_profiles 
SET role = 'pending_agent' 
WHERE verification_status = 'pending' AND role = 'agent';

UPDATE suppliers 
SET role = 'pending_supplier' 
WHERE subscription_status IN ('pending', 'pending_payment') AND role = 'supplier';

-- 3. Create function to update role on approval
CREATE OR REPLACE FUNCTION update_role_on_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- For agent_profiles: change role from pending_agent to agent when approved
  IF TG_TABLE_NAME = 'agent_profiles' THEN
    IF NEW.verification_status = 'approved' AND OLD.verification_status != 'approved' THEN
      NEW.role = 'agent';
    END IF;
  END IF;

  -- For suppliers: change role from pending_supplier to supplier when active
  IF TG_TABLE_NAME = 'suppliers' THEN
    IF NEW.subscription_status = 'active' AND OLD.subscription_status != 'active' THEN
      NEW.role = 'supplier';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- 4. Create triggers to automatically update role on approval
DROP TRIGGER IF EXISTS agent_role_update_trigger ON agent_profiles;
CREATE TRIGGER agent_role_update_trigger
  BEFORE UPDATE ON agent_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_role_on_approval();

DROP TRIGGER IF EXISTS supplier_role_update_trigger ON suppliers;
CREATE TRIGGER supplier_role_update_trigger
  BEFORE UPDATE ON suppliers
  FOR EACH ROW
  EXECUTE FUNCTION update_role_on_approval();

-- 5. Update the handle_new_user trigger to not set role (let default handle it)
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
  
  -- Create a supplier entry if the role is 'supplier'
  IF role_value = 'supplier' THEN
    RAISE NOTICE 'Creating supplier with company_name: %', COALESCE(metadata->>'company_name', 'NOT FOUND');
    
    INSERT INTO public.suppliers (
      id, 
      contact_email, 
      company_name,
      country_code,
      base_currency
      -- role will be set by DEFAULT to 'pending_supplier'
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
      -- role will be set by DEFAULT to 'pending_agent'
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
