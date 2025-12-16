-- Enable RLS on suppliers table
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Allow read access for all users (authenticated and anon)
-- This is necessary for the portal to display supplier details
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'suppliers' AND policyname = 'Enable read access for all users'
    ) THEN
        CREATE POLICY "Enable read access for all users"
        ON suppliers FOR SELECT
        USING (true);
    END IF;
END $$;
