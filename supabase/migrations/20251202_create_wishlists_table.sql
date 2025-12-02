-- Create wishlists table for tracking user-favorited products
-- This enables wishlist functionality and counters across the application

CREATE TABLE IF NOT EXISTS public.wishlists (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    UNIQUE(user_id, product_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON public.wishlists(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wishlists_product ON public.wishlists(product_id);

-- Enable RLS
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own wishlist items
CREATE POLICY "Users can view own wishlist"
    ON public.wishlists
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own wishlist items
CREATE POLICY "Users can insert own wishlist"
    ON public.wishlists
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own wishlist items
CREATE POLICY "Users can delete own wishlist"
    ON public.wishlists
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

COMMENT ON TABLE public.wishlists IS 'Tracks user-favorited products for wishlist functionality';
COMMENT ON COLUMN public.wishlists.user_id IS 'User who added the product to wishlist';
COMMENT ON COLUMN public.wishlists.product_id IS 'Product that was added to wishlist';
