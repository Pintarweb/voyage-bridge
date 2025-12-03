-- ============================================================================
-- MANUAL MIGRATION SCRIPT - Apply via Supabase Dashboard SQL Editor
-- ============================================================================
-- This script contains the new migrations that need to be applied:
-- 1. Create wishlists table
-- 2. Add product_url column to products table
--
-- HOW TO APPLY:
-- 1. Go to https://supabase.com/dashboard/project/syizulzpjbttpydtclrt/sql/new
-- 2. Copy and paste this entire file into the SQL Editor
-- 3. Click "Run" to execute
-- ============================================================================

-- Migration: Create wishlists table
-- From: 20251202_create_wishlists_table.sql
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.wishlists (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.agent_profiles(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON public.wishlists(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_created_at ON public.wishlists(created_at DESC);

-- Enable RLS
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view their own wishlist" ON public.wishlists;
    DROP POLICY IF EXISTS "Users can add to their wishlist" ON public.wishlists;
    DROP POLICY IF EXISTS "Users can remove from their wishlist" ON public.wishlists;
    
    -- Create policies
    CREATE POLICY "Users can view their own wishlist"
        ON public.wishlists FOR SELECT
        USING (auth.uid() = user_id);

    CREATE POLICY "Users can add to their wishlist"
        ON public.wishlists FOR INSERT
        WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can remove from their wishlist"
        ON public.wishlists FOR DELETE
        USING (auth.uid() = user_id);
END $$;

-- Migration: Add product_url column
-- From: 20251203_add_product_url.sql
-- ============================================================================

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS product_url text;

COMMENT ON COLUMN public.products.product_url IS 'URL for the specific product, defaults to supplier website';

-- ============================================================================
-- END OF MIGRATIONS
-- ============================================================================
