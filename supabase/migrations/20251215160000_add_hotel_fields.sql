-- Migration to add hotel-specific product columns

-- 1. Product Identification
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_url TEXT; -- Already added in some versions, ensuring safety
ALTER TABLE products ADD COLUMN IF NOT EXISTS accommodation_type TEXT[]; -- Multi-select
ALTER TABLE products ADD COLUMN IF NOT EXISTS star_rating NUMERIC; -- 1-5 (Already exists? check)
-- Country/City/Address already exist

-- 2. Contact Info
ALTER TABLE products ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- 3. Details & Pricing
ALTER TABLE products ADD COLUMN IF NOT EXISTS room_type TEXT[]; -- Multi-select
ALTER TABLE products ADD COLUMN IF NOT EXISTS min_occupancy INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS max_occupancy INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS base_price NUMERIC; -- Starting Price
ALTER TABLE products ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD'; 
ALTER TABLE products ADD COLUMN IF NOT EXISTS check_in_time TIME;
ALTER TABLE products ADD COLUMN IF NOT EXISTS check_out_time TIME;
ALTER TABLE products ADD COLUMN IF NOT EXISTS amenities TEXT[]; -- Array of strings

-- 4. Visuals
-- photo_urls already exists
-- special_offer can go into existing 'description' or new
ALTER TABLE products ADD COLUMN IF NOT EXISTS special_offer TEXT;
