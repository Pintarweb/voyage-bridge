-- Add supplier discovery fields to suppliers table
-- This migration adds website_url and supplier_type columns needed for the new supplier discovery model

-- Add website_url if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'suppliers' AND column_name = 'website_url') THEN
        ALTER TABLE public.suppliers ADD COLUMN website_url text;
    END IF;
END $$;

-- Add supplier_type column with enum constraint
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'suppliers' AND column_name = 'supplier_type') THEN
        ALTER TABLE public.suppliers ADD COLUMN supplier_type text CHECK (supplier_type IN ('LAND OPERATOR', 'TRANSPORT', 'HOTEL'));
    END IF;
END $$;

-- Create index on supplier_type for performance
CREATE INDEX IF NOT EXISTS idx_suppliers_type ON public.suppliers(supplier_type);

-- Backfill supplier_type from product categories
-- Logic: If supplier has products in a category, assign that as their type
-- Priority: HOTEL > LAND OPERATOR > TRANSPORT (if they have multiple)
UPDATE public.suppliers s
SET supplier_type = (
    SELECT CASE
        WHEN COUNT(*) FILTER (WHERE p.product_category ILIKE '%hotel%' OR p.product_category ILIKE '%accommodation%') > 0 THEN 'HOTEL'
        WHEN COUNT(*) FILTER (WHERE p.product_category ILIKE '%tour%' OR p.product_category ILIKE '%activity%' OR p.product_category ILIKE '%land%') > 0 THEN 'LAND OPERATOR'
        WHEN COUNT(*) FILTER (WHERE p.product_category ILIKE '%transport%' OR p.product_category ILIKE '%transfer%') > 0 THEN 'TRANSPORT'
        ELSE 'LAND OPERATOR' -- Default fallback
    END
    FROM public.products p
    WHERE p.supplier_id = s.id AND p.status = 'active'
)
WHERE s.supplier_type IS NULL;

-- Set default for any remaining NULL values
UPDATE public.suppliers
SET supplier_type = 'LAND OPERATOR'
WHERE supplier_type IS NULL;

COMMENT ON COLUMN public.suppliers.website_url IS 'Supplier website URL for external redirects';
COMMENT ON COLUMN public.suppliers.supplier_type IS 'Supplier category: LAND OPERATOR, TRANSPORT, or HOTEL';
