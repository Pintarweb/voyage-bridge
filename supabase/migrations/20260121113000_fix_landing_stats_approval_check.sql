-- Update the get_landing_stats function to only count approved suppliers and active products
CREATE OR REPLACE FUNCTION get_landing_stats()
RETURNS json
LANGUAGE sql
STABLE
AS $$
  SELECT json_build_object(
    -- Suppliers must be both active (paid) AND approved by admin to be considered "Verified"
    'suppliers', (SELECT COUNT(*) FROM suppliers WHERE subscription_status = 'active' AND is_approved = true),
    -- Only count products that are 'active' AND belong to an approved supplier
    'products', (
      SELECT COUNT(*) 
      FROM products p 
      JOIN suppliers s ON p.supplier_id = s.id 
      WHERE p.status = 'active' AND s.is_approved = true
    ),
    -- Agents must be approved and not admins
    'agents', (SELECT COUNT(*) FROM agent_profiles WHERE verification_status = 'approved' AND role != 'admin')
  );
$$;
