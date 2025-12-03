-- Add contact_email column to suppliers table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'suppliers' AND column_name = 'contact_email') THEN
        ALTER TABLE public.suppliers ADD COLUMN contact_email text;
    END IF;
END $$;
