-- Add missing columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS star_rating integer;
