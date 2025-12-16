const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

// Try to find a connection string
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.SUPABASE_DB_URL;

if (!connectionString) {
    console.error('Error: DATABASE_URL not found in .env.local');
    // Debug: print available keys safely
    console.log('Available Env Keys:', Object.keys(process.env).filter(k => k.includes('DB') || k.includes('URL')));
    process.exit(1);
}

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

const sql = `
  -- 1. Product Identification & Location
  ALTER TABLE products ADD COLUMN IF NOT EXISTS meeting_point TEXT;

  -- 3. Experience Details & Pricing
  ALTER TABLE products ADD COLUMN IF NOT EXISTS duration TEXT;
  ALTER TABLE products ADD COLUMN IF NOT EXISTS activity_level TEXT;
  ALTER TABLE products ADD COLUMN IF NOT EXISTS max_group_size NUMERIC;
  ALTER TABLE products ADD COLUMN IF NOT EXISTS languages TEXT[];
  ALTER TABLE products ADD COLUMN IF NOT EXISTS itinerary TEXT;
  ALTER TABLE products ADD COLUMN IF NOT EXISTS exclusions TEXT;
`;

async function run() {
    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('Applying migration...');
        await client.query(sql);
        console.log('Migration applied successfully!');
        await client.end();
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
}

run();
