-- Add supplier_type column
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS supplier_type text;

-- Function to sync supplier details to products
CREATE OR REPLACE FUNCTION public.sync_product_supplier_details()
RETURNS TRIGGER AS $$
BEGIN
    SELECT
        country_code,
        city,
        supplier_type
    INTO
        NEW.country_code,
        NEW.city,
        NEW.supplier_type
    FROM
        public.suppliers
    WHERE
        id = NEW.supplier_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run the function before insert or update
DROP TRIGGER IF EXISTS trigger_sync_product_supplier_details ON public.products;
CREATE TRIGGER trigger_sync_product_supplier_details
BEFORE INSERT OR UPDATE OF supplier_id ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.sync_product_supplier_details();

-- Update existing products with supplier details
UPDATE public.products p
SET
    country_code = s.country_code,
    city = s.city,
    supplier_type = s.supplier_type
FROM
    public.suppliers s
WHERE
    p.supplier_id = s.id;

-- Drop unused columns
ALTER TABLE public.products
DROP COLUMN IF EXISTS photo_url_2,
DROP COLUMN IF EXISTS photo_url_3,
DROP COLUMN IF EXISTS region,
DROP COLUMN IF EXISTS continent,
DROP COLUMN IF EXISTS currency,
DROP COLUMN IF EXISTS agent_price,
DROP COLUMN IF EXISTS validity_start_date,
DROP COLUMN IF EXISTS validity_end_date,
DROP COLUMN IF EXISTS booking_count,
DROP COLUMN IF EXISTS revenue,
DROP COLUMN IF EXISTS suggested_retail_price;
