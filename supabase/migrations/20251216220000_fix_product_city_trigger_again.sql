-- Re-apply the fix to prevent overwriting product city
CREATE OR REPLACE FUNCTION public.sync_product_supplier_details()
RETURNS TRIGGER AS $$
BEGIN
    -- Only sync country_code and supplier_type from supplier
    -- Do NOT overwrite city as it's product-specific
    SELECT
        country_code,
        supplier_type
    INTO
        NEW.country_code,
        NEW.supplier_type
    FROM
        public.suppliers
    WHERE
        id = NEW.supplier_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
