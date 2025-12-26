-- ==========================================
-- SEED DATA FOR LOCAL DEVELOPMENT
-- ==========================================

-- DISABLE TRIGGERS
SET session_replication_role = replica;

-- 1. Clean up existing data to avoid conflicts
-- Truncating auth.users cascades to public tables (suppliers, profiles, products)
TRUNCATE TABLE auth.users CASCADE;
TRUNCATE TABLE public.system_metrics CASCADE;
TRUNCATE TABLE public.system_settings CASCADE;

-- 2. Insert Users (Password is 'password123' for all)
INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at, aud, role, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
)
VALUES
    -- Admin User
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '00000000-0000-0000-0000-000000000000', 'admin@voyage.com', crypt('password123', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"],"role":"admin"}', '{"full_name":"Super Admin", "role":"admin"}', now(), now(), '', '', '', ''),
    -- Supplier 1 (Hotel)
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', '00000000-0000-0000-0000-000000000000', 'hotel@voyage.com', crypt('password123', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"],"role":"supplier"}', '{"company_name":"Grand Plaza Hotel", "role":"supplier"}', now(), now(), '', '', '', ''),
    -- Supplier 2 (Transport)
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', '00000000-0000-0000-0000-000000000000', 'transport@voyage.com', crypt('password123', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"],"role":"supplier"}', '{"company_name":"Rapid Transfers", "role":"supplier"}', now(), now(), '', '', '', ''),
    -- Agent 1
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', '00000000-0000-0000-0000-000000000000', 'agent@voyage.com', crypt('password123', gen_salt('bf')), now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"],"role":"agent"}', '{"full_name":"Jane Agent", "role":"agent"}', now(), now(), '', '', '', '');

-- 3. Insert Identities
INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES
    (gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '{"sub":"a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11","email":"admin@voyage.com"}', 'email', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', now(), now(), now()),
    (gen_random_uuid(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', '{"sub":"b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22","email":"hotel@voyage.com"}', 'email', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', now(), now(), now()),
    (gen_random_uuid(), 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', '{"sub":"c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33","email":"transport@voyage.com"}', 'email', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', now(), now(), now()),
    (gen_random_uuid(), 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', '{"sub":"d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44","email":"agent@voyage.com"}', 'email', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', now(), now(), now());


-- 4. Insert Profiles & Suppliers (Upsert to handle trigger conflicts)
-- Admin Profile
INSERT INTO public.agent_profiles (id, first_name, last_name, email, role, is_approved, verification_status)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Super', 'Admin', 'admin@voyage.com', 'admin', true, 'approved')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, is_approved = EXCLUDED.is_approved, verification_status = EXCLUDED.verification_status;

INSERT INTO public.admin_profiles (id, internal_notes, last_verification_date)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Seed Admin', now())
ON CONFLICT (id) DO NOTHING;

-- Agent Profile
INSERT INTO public.agent_profiles (id, first_name, last_name, email, role, is_approved, verification_status)
VALUES ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', 'Jane', 'Agent', 'agent@voyage.com', 'agent', true, 'approved')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, is_approved = EXCLUDED.is_approved, verification_status = EXCLUDED.verification_status;

-- Hotel Supplier (Ensure not in agent_profiles if trigger put it there)
DELETE FROM public.agent_profiles WHERE id IN ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33');

INSERT INTO public.suppliers (id, company_name, website_url, contact_email, country_code, city, supplier_type, subscription_status, phone_number)
VALUES ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Grand Plaza Hotel', 'https://grandplaza.com', 'hotel@voyage.com', 'US', 'New York', 'HOTEL', 'active', '+12125550199')
ON CONFLICT (id) DO UPDATE SET subscription_status = EXCLUDED.subscription_status;

-- Transport Supplier
INSERT INTO public.suppliers (id, company_name, website_url, contact_email, country_code, city, supplier_type, subscription_status, phone_number)
VALUES ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'Rapid Transfers', 'https://rapidtransfers.co.uk', 'transport@voyage.com', 'GB', 'London', 'TRANSPORT', 'active', '+442079460000')
ON CONFLICT (id) DO UPDATE SET subscription_status = EXCLUDED.subscription_status;


-- 5. Insert Products
INSERT INTO public.products (supplier_id, name, description, product_category, country_code, city, status)
VALUES
    -- Hotel Products
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Presidential Suite', 'Top floor suite with panoramic views.', 'Accommodation', 'US', 'New York', 'active'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Deluxe Double', 'Spacious room with two double beds.', 'Accommodation', 'US', 'New York', 'active'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Standard King', 'Cozy room with king size bed.', 'Accommodation', 'US', 'New York', 'active'),
    
    -- Transport Products
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'Heathrow Express Transfer', 'Private car from Heathrow to City Center.', 'Transportation', 'GB', 'London', 'active'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'Gatwick Shuttle Bus', 'Shared shuttle service.', 'Transportation', 'GB', 'London', 'active');


-- 6. Insert System Settings
INSERT INTO public.system_settings (key, value, description, updated_by)
VALUES ('maintenance_mode', 'false'::jsonb, 'System-wide maintenance mode flag', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');


-- 7. Insert System Metrics (Past 14 Days Data for Charts)
-- Generates hourly data points
INSERT INTO public.system_metrics (system_load, active_users, api_latency_ms, health_status, recorded_at)
SELECT
    floor(random() * 40 + 20)::int as load,        -- 20-60%
    floor(random() * 150 + 50)::int as users,     -- 50-200 users
    floor(random() * 200 + 50)::int as latency,   -- 50-250ms
    CASE WHEN random() > 0.9 THEN 'degraded' ELSE 'optimal' END as health,
    NOW() - (i || ' hours')::interval
FROM generate_series(0, 336) i; -- 14 days * 24 hours

-- RESTORE TRIGGERS
SET session_replication_role = DEFAULT;

