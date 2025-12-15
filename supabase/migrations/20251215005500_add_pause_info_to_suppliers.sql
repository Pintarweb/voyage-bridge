-- Add current_period_end and is_paused to suppliers table

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'suppliers' AND column_name = 'current_period_end') THEN
        ALTER TABLE public.suppliers ADD COLUMN current_period_end timestamptz;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'suppliers' AND column_name = 'is_paused') THEN
        ALTER TABLE public.suppliers ADD COLUMN is_paused boolean DEFAULT false;
    END IF;
END $$;
