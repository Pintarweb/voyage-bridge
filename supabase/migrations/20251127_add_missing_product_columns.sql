-- Add missing columns to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS cancellation_policy text,
ADD COLUMN IF NOT EXISTS inclusions text[],
ADD COLUMN IF NOT EXISTS exclusions text[],
ADD COLUMN IF NOT EXISTS terms_conditions text,
ADD COLUMN IF NOT EXISTS min_pax integer,
ADD COLUMN IF NOT EXISTS max_pax integer,
ADD COLUMN IF NOT EXISTS validity_start_date date,
ADD COLUMN IF NOT EXISTS photo_url_2 text,
ADD COLUMN IF NOT EXISTS photo_url_3 text;
