const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually parse .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^(?:export\s+)?([^=]+?)\s*=\s*(.*)$/);
    if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
        env[key] = value;
    }
});

console.log('Found keys:', Object.keys(env));

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

console.log('URL:', supabaseUrl);
console.log('Anon Key exists:', !!supabaseKey);
console.log('Service Key exists:', !!serviceKey);

if (!supabaseUrl || (!supabaseKey && !serviceKey)) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

// Use service key if available to bypass RLS, otherwise anon key
const client = createClient(supabaseUrl, serviceKey || supabaseKey);

async function run() {
    console.log('Checking products table...');

    // Check count without filters
    const { count, error: countError } = await client
        .from('products')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('Error counting products:', countError);
    } else {
        console.log('Total products in DB:', count);
    }

    // Check active products
    const { data: activeProducts, error: activeError } = await client
        .from('products')
        .select('id, product_name, status, supplier_id')
        .eq('status', 'active');

    if (activeError) {
        console.error('Error fetching active products:', activeError);
    } else {
        console.log('Active products found:', activeProducts?.length);
        if (activeProducts?.length > 0) {
            console.log('Sample active product:', activeProducts[0]);
        }
    }
}

run();
