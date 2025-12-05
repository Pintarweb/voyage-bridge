-- Update the get_landing_stats function to only count approved/active users
CREATE OR REPLACE FUNCTION get_landing_stats()
RETURNS json
LANGUAGE sql
STABLE
AS $$
  SELECT json_build_object(
    'suppliers', (SELECT COUNT(*) FROM suppliers WHERE subscription_status = 'active'),
    'products', (SELECT COUNT(*) FROM products),
    'agents', (SELECT COUNT(*) FROM agent_profiles WHERE verification_status = 'approved')
  );
$$;
