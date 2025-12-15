-- Migration to add transport-specific product columns

-- 1. Product Identification
ALTER TABLE products ADD COLUMN IF NOT EXISTS service_type TEXT; -- e.g. 'Car Rental', 'Transfer', etc.
ALTER TABLE products ADD COLUMN IF NOT EXISTS coverage_area TEXT; -- Description of area/routes

-- 3. Product Details & Vehicle Configuration
ALTER TABLE products ADD COLUMN IF NOT EXISTS vehicle_config JSONB; -- To store array of { type, max_passengers, luggage_capacity }
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_model TEXT; -- e.g. 'Per hour', 'Per day', 'Per km'
ALTER TABLE products ADD COLUMN IF NOT EXISTS inclusions TEXT; -- Description/List of inclusions
-- Note: 'vehicle_types' can also be useful for filtering if we want to extract it from vehicle_config, 
-- but we can query JSONB directly or just rely on vehicle_config.
-- Let's add vehicle_types as a convenience Array column if strictly needed, but vehicle_config covers it.
-- Actually, maintaining both is error prone. Let's stick to vehicle_config for details. 
-- Wait, filtering by "Sedan" might be easier with a TEXT[] column.
ALTER TABLE products ADD COLUMN IF NOT EXISTS vehicle_types TEXT[]; -- Derived or explicit list of types available
