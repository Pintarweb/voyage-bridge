-- Add missing columns to products table for product creation functionality
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS product_name TEXT,
ADD COLUMN IF NOT EXISTS product_description TEXT,
ADD COLUMN IF NOT EXISTS product_category TEXT,
ADD COLUMN IF NOT EXISTS photo_urls TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';

COMMENT ON COLUMN public.products.product_name IS 'Name/title of the product (e.g., hotel name, tour name)';
COMMENT ON COLUMN public.products.product_description IS 'Detailed description of the product including features, amenities, etc.';
COMMENT ON COLUMN public.products.product_category IS 'Category of the product (Accommodation, Transportation, Tours & Activities)';
COMMENT ON COLUMN public.products.photo_urls IS 'Array of URLs to product images stored in Supabase Storage bucket (supports multiple images)';
COMMENT ON COLUMN public.products.status IS 'Product status (draft, active, archived)';
