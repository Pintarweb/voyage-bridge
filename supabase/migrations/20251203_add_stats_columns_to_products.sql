-- Add stats columns to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS wishlist_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;

-- Create a function to increment view count safely
CREATE OR REPLACE FUNCTION increment_view_count(product_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.products
  SET view_count = view_count + 1
  WHERE id = product_id;
END;
$$;

-- Create a function to increment wishlist count safely
CREATE OR REPLACE FUNCTION increment_wishlist_count(product_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.products
  SET wishlist_count = wishlist_count + 1
  WHERE id = product_id;
END;
$$;
