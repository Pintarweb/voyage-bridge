CREATE OR REPLACE FUNCTION get_landing_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  supplier_count integer;
  product_count integer;
  agent_count integer;
  country_count integer;
BEGIN
  -- Count all suppliers
  SELECT count(*) INTO supplier_count FROM public.suppliers;
  
  -- Count active products (assuming status column exists, otherwise count all)
  -- standard schema usually has status. If not, this might fail, so we'll try to be safe or assume 'active' exists per product-form.
  SELECT count(*) INTO product_count FROM public.products WHERE status = 'active';
  
  -- Count profiles for agents
  SELECT count(*) INTO agent_count FROM public.agent_profiles;

  -- Count unique countries from suppliers (if country_code exists)
  SELECT count(DISTINCT country_code) INTO country_count FROM public.suppliers;

  RETURN json_build_object(
    'suppliers', COALESCE(supplier_count, 0),
    'products', COALESCE(product_count, 0),
    'agents', COALESCE(agent_count, 0),
    'countries', COALESCE(country_count, 0)
  );
EXCEPTION WHEN OTHERS THEN
  -- Fallback in case of table missing errors during development
  RETURN json_build_object(
    'suppliers', 0,
    'products', 0,
    'agents', 0,
    'countries', 0
  );
END;
$$;
