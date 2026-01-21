
const { Client } = require('pg');
const fs = require('fs');

async function debugData() {
    const connectionString = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
    const client = new Client({ connectionString });

    try {
        await client.connect();
        const res = await client.query('SELECT p.id, p.name, p.status, s.company_name, s.is_approved FROM products p JOIN suppliers s ON p.supplier_id = s.id');
        fs.writeFileSync('debug_products.json', JSON.stringify(res.rows, null, 2));
        console.log('Results written to debug_products.json');
        await client.end();
    } catch (err) {
        console.error(err.message);
    }
}
debugData();
