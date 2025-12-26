-- Reconstruct Missing Base Tables  (V3 - Corrected Columns for Cleanup Migration)
-- This migration ensures the base tables exist before subsequent migrations run.
-- It forces a clean slate for these tables.

DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.suppliers CASCADE;
DROP TABLE IF EXISTS public.agent_profiles CASCADE;

-- 1. Suppliers Table
CREATE TABLE IF NOT EXISTS public.suppliers (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name text,
    website_url text,
    contact_email text,
    country_code text,
    city text, -- Added city column
    base_currency text,
    phone_number text,
    company_reg_no text,
    supplier_type text,
    subscription_status text DEFAULT 'pending', 
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. Agent Profiles Table
CREATE TABLE IF NOT EXISTS public.agent_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name text,
    last_name text,
    email text,
    role text DEFAULT 'agent', -- 'admin', 'agent'
    is_approved boolean DEFAULT false,
    verification_status text DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id uuid REFERENCES public.suppliers(id) ON DELETE CASCADE,
    name text,
    description text,
    product_category text, 
    country_code text, -- Renamed from country
    city text,
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS on these tables
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
