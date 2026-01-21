
const { Client } = require('pg');

async function checkAndFix() {
    const connectionString = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log('Connected to DB');

        // 1. Check current function
        const checkRes = await client.query(`
            SELECT prosrc FROM pg_proc WHERE proname = 'get_landing_stats';
        `);

        if (checkRes.rows.length === 0) {
            console.log('Function get_landing_stats not found!');
        } else {
            console.log('Current function source contains "is_approved":', checkRes.rows[0].prosrc.includes('is_approved'));
        }

        // 2. Overwrite with strict version
        const sql = `
            CREATE OR REPLACE FUNCTION public.get_landing_stats()
            RETURNS json
            LANGUAGE sql
            STABLE
            AS $$
              SELECT json_build_object(
                'suppliers', (SELECT COUNT(*) FROM public.suppliers WHERE subscription_status = 'active' AND is_approved = true),
                'products', (
                  SELECT COUNT(*) 
                  FROM public.products p 
                  JOIN public.suppliers s ON p.supplier_id = s.id 
                  WHERE p.status = 'active' AND s.is_approved = true
                ),
                'agents', (SELECT COUNT(*) FROM public.agent_profiles WHERE verification_status = 'approved' AND role != 'admin')
              );
            $$;
        `;
        await client.query(sql);
        console.log('Function updated/created successfully in public schema');

        // 3. Verify counts
        const countRes = await client.query(`
            SELECT 
                (SELECT COUNT(*) FROM suppliers WHERE subscription_status = 'active') as active_total,
                (SELECT COUNT(*) FROM suppliers WHERE subscription_status = 'active' AND is_approved = true) as active_approved
        `);
        console.log('Current Counts:', countRes.rows[0]);

        await client.end();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkAndFix();
