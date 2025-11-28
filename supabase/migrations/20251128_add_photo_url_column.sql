-- Add photo_urls array column to products table for storing multiple Supabase Storage image URLs
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS photo_urls TEXT[] DEFAULT '{}';

COMMENT ON COLUMN public.products.photo_urls IS 'Array of URLs to product images stored in Supabase Storage bucket (supports multiple images)';
