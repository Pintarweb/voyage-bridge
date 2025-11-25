-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Enable read access for authenticated users'
    ) THEN
        CREATE POLICY "Enable read access for authenticated users"
        ON products FOR SELECT
        TO authenticated
        USING (true);
    END IF;
END $$;

-- Allow read access for anon users (optional, but good for debugging if needed)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Enable read access for anon users'
    ) THEN
        CREATE POLICY "Enable read access for anon users"
        ON products FOR SELECT
        TO anon
        USING (true);
    END IF;
END $$;
