-- Add product_url column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS product_url text;

-- Add comment
COMMENT ON COLUMN public.products.product_url IS 'URL for the specific product, defaults to supplier website';
