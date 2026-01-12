-- Restore original logic: using SQL language (not plpgsql), STABLE, and specific filtering logic
CREATE OR REPLACE FUNCTION get_landing_stats()
RETURNS json
LANGUAGE sql
STABLE
AS $$
  SELECT json_build_object(
    'suppliers', (SELECT COUNT(*) FROM suppliers), -- Original didn't have subscription check in first versions, but let's check safety. File 09 said fix. File 03 said exclude admins. 
    -- user said "copy that logic". The file I just read is 03.
    -- File 03 content:
    -- suppliers: WHERE subscription_status = 'active'
    -- products: count(*)
    -- agents: WHERE verification_status = 'approved' AND role != 'admin'
    
    -- Wait, looking at file 20251207...03.
    'suppliers', (SELECT COUNT(*) FROM suppliers WHERE subscription_status = 'active'),
    'products', (SELECT COUNT(*) FROM products),
    'agents', (SELECT COUNT(*) FROM agent_profiles WHERE verification_status = 'approved' AND role != 'admin')
  );
$$;
