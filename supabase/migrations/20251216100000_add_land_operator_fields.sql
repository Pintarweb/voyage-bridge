-- Migration to add Land Operator specific product columns

-- 1. Product Identification & Location
ALTER TABLE products ADD COLUMN IF NOT EXISTS meeting_point TEXT; -- Description of pick-up/meeting location

-- 3. Experience Details & Pricing
ALTER TABLE products ADD COLUMN IF NOT EXISTS duration TEXT; -- e.g. "4 hours", "3 Days / 2 Nights"
ALTER TABLE products ADD COLUMN IF NOT EXISTS activity_level TEXT; -- e.g. "Easy", "Moderate", "Strenuous"
ALTER TABLE products ADD COLUMN IF NOT EXISTS max_group_size NUMERIC; -- Maximum participants
ALTER TABLE products ADD COLUMN IF NOT EXISTS languages TEXT[]; -- Languages conducted in
ALTER TABLE products ADD COLUMN IF NOT EXISTS itinerary TEXT; -- Rich text/Step-by-step summary
ALTER TABLE products ADD COLUMN IF NOT EXISTS exclusions TEXT; -- List of what is not covered

-- Note: 'inclusions' was added in the transport migration, so we reuse it.
-- Note: 'service_type' from transport migration can be used for 'Product Type' (Day Tour, etc.)
