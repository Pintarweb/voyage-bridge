
const { Client } = require('pg');

async function runMigration() {
    const connectionString = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
    const client = new Client({
        connectionString,
        ssl: false
    });

    try {
        await client.connect();
        console.log('Connected to database');

        const sql = `
      -- Fix Landing Stats (Approval Check)
      CREATE OR REPLACE FUNCTION get_landing_stats()
      RETURNS json
      LANGUAGE sql
      STABLE
      AS $$
        SELECT json_build_object(
          'suppliers', (SELECT COUNT(*) FROM suppliers WHERE subscription_status = 'active' AND is_approved = true),
          -- Only count products from approved suppliers
          'products', (
            SELECT COUNT(*) 
            FROM products p 
            JOIN suppliers s ON p.supplier_id = s.id 
            WHERE p.status = 'active' AND s.is_approved = true
          ),
          'agents', (SELECT COUNT(*) FROM agent_profiles WHERE verification_status = 'approved' AND role != 'admin')
        );
      $$;
    `;

        await client.query(sql);
        console.log('Successfully updated get_landing_stats function');

        await client.end();
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
}

runMigration();
