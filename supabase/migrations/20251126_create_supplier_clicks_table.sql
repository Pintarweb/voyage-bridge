-- Create supplier_clicks table for tracking agent clicks on suppliers
-- This enables lead attribution and analytics

CREATE TABLE IF NOT EXISTS public.supplier_clicks (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    supplier_id uuid REFERENCES public.suppliers(id) ON DELETE CASCADE,
    product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
    clicked_at timestamptz DEFAULT now() NOT NULL,
    referrer_page text,
    user_agent text,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_supplier_clicks_agent ON public.supplier_clicks(agent_id, clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_supplier_clicks_supplier ON public.supplier_clicks(supplier_id, clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_supplier_clicks_product ON public.supplier_clicks(product_id) WHERE product_id IS NOT NULL;

-- Enable RLS
ALTER TABLE public.supplier_clicks ENABLE ROW LEVEL SECURITY;

-- Policy: Agents can view their own clicks
CREATE POLICY "Agents can view own clicks"
    ON public.supplier_clicks
    FOR SELECT
    TO authenticated
    USING (auth.uid() = agent_id);

-- Policy: Agents can insert their own clicks
CREATE POLICY "Agents can insert own clicks"
    ON public.supplier_clicks
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = agent_id);

-- Policy: Suppliers can view clicks on their profile
CREATE POLICY "Suppliers can view clicks on their profile"
    ON public.supplier_clicks
    FOR SELECT
    TO authenticated
    USING (
        supplier_id IN (
            SELECT id FROM public.suppliers WHERE id = auth.uid()
        )
    );

COMMENT ON TABLE public.supplier_clicks IS 'Tracks when agents click through to supplier websites';
COMMENT ON COLUMN public.supplier_clicks.agent_id IS 'Agent who clicked';
COMMENT ON COLUMN public.supplier_clicks.supplier_id IS 'Supplier that was clicked';
COMMENT ON COLUMN public.supplier_clicks.product_id IS 'Optional: specific product context';
COMMENT ON COLUMN public.supplier_clicks.referrer_page IS 'Page where the click originated';
