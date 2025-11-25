-- Seed data for products
DO $$
DECLARE
    target_supplier_id uuid;
BEGIN
    -- Try to get an existing supplier ID
    SELECT id INTO target_supplier_id FROM public.suppliers LIMIT 1;

    -- If no supplier found, try to get from existing products (if any exist)
    IF target_supplier_id IS NULL THEN
        SELECT supplier_id INTO target_supplier_id FROM public.products LIMIT 1;
    END IF;

    IF target_supplier_id IS NOT NULL THEN
        -- Insert Products
        INSERT INTO public.products (
            product_name,
            description,
            photo_url_1,
            city,
            country_code,
            continent,
            region,
            currency,
            suggested_retail_price,
            agent_price,
            product_category,
            status,
            validity_end_date,
            supplier_id
        ) VALUES
        (
            'Luxury Bali Escape',
            'Experience the ultimate relaxation in a private villa in Ubud.',
            'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
            'Ubud',
            'ID',
            'Asia',
            'Southeast Asia',
            'USD',
            1200,
            960,
            'Hotel Chain',
            'active',
            NOW() + INTERVAL '1 year',
            target_supplier_id
        ),
        (
            'Parisian City Tour',
            'Guided tour of the most iconic landmarks in Paris.',
            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
            'Paris',
            'FR',
            'Europe',
            'Western Europe',
            'EUR',
            150,
            120,
            'Tour Operator',
            'active',
            NOW() + INTERVAL '1 year',
            target_supplier_id
        ),
        (
            'Safari Adventure',
            '3-day safari in Serengeti National Park.',
            'https://images.unsplash.com/photo-1516426122078-c23e76319801',
            'Serengeti',
            'TZ',
            'Africa',
            'East Africa',
            'USD',
            3000,
            2400,
            'DMC',
            'active',
            NOW() + INTERVAL '1 year',
            target_supplier_id
        ),
        (
            'Tokyo Tech & Culture',
            'Explore the fusion of modern tech and traditional culture.',
            'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
            'Tokyo',
            'JP',
            'Asia',
            'East Asia',
            'JPY',
            200000,
            160000,
            'DMC',
            'active',
            NOW() + INTERVAL '1 year',
            target_supplier_id
        ),
        (
            'Caribbean Cruise',
            '7-night cruise through the crystal clear waters of the Caribbean.',
            'https://images.unsplash.com/photo-1548574505-5e239809ee19',
            'Nassau',
            'BS',
            'North America',
            'Caribbean',
            'USD',
            1500,
            1200,
            'Cruise Line',
            'active',
            NOW() + INTERVAL '1 year',
            target_supplier_id
        )
        ON CONFLICT DO NOTHING;
    ELSE
        RAISE NOTICE 'No supplier found. Skipping product seed.';
    END IF;
END $$;
