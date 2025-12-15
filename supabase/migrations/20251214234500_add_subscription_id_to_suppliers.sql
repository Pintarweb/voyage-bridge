-- Add subscription_id and stripe_customer_id to suppliers table if they don't exist

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'suppliers' AND column_name = 'subscription_id') THEN
        ALTER TABLE public.suppliers ADD COLUMN subscription_id text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'suppliers' AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE public.suppliers ADD COLUMN stripe_customer_id text;
    END IF;
END $$;
