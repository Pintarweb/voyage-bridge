import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.SUPABASE_DB_URL;

    if (!connectionString) {
        return NextResponse.json({
            error: 'No database connection string found',
            availableEnvKeys: Object.keys(process.env).filter(k => k.includes('DB') || k.includes('URL') || k.includes('POSTGRES'))
        }, { status: 500 });
    }

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false } // Required for Supabase usually
    });

    try {
        await client.connect();

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

        await client.query(sql);
        await client.end();

        return NextResponse.json({ success: true, message: 'Migration applied successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
