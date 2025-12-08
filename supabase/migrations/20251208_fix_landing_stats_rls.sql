-- Update the get_landing_stats function to exclude admins from agent count
-- Added SECURITY DEFINER to bypass RLS for public homepage
-- Added status check for products
CREATE OR REPLACE FUNCTION get_landing_stats()
RETURNS json
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT json_build_object(
    'suppliers', (SELECT COUNT(*) FROM suppliers WHERE subscription_status = 'active'),
    'products', (SELECT COUNT(*) FROM products WHERE status = 'active'),
    'agents', (SELECT COUNT(*) FROM agent_profiles WHERE verification_status = 'approved' AND role != 'admin')
  );
$$;
