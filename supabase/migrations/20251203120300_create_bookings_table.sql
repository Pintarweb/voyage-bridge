-- Create booking_status enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
        CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'rejected', 'cancelled');
    END IF;
END $$;

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
    agent_id uuid REFERENCES public.agent_profiles(id) ON DELETE SET NULL,
    client_name text NOT NULL,
    num_travelers int NOT NULL,
    travel_start_date date NOT NULL,
    total_agent_price numeric NOT NULL,
    inquiry_status public.booking_status DEFAULT 'pending',
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policies (Basic for now, can be refined)
-- Agents can view and create their own bookings
DROP POLICY IF EXISTS "Agents can view own bookings" ON public.bookings;
CREATE POLICY "Agents can view own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = agent_id);

DROP POLICY IF EXISTS "Agents can create bookings" ON public.bookings;
CREATE POLICY "Agents can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = agent_id);

-- Suppliers can view bookings for their products (requires join, simplified for now to allow all authenticated users to view if they have the ID, or refine later)
-- For MVP, let's allow agents to see their own. Suppliers seeing theirs would need a more complex policy involving the product owner.
-- Let's add a policy for admins/suppliers later or assume RLS is permissive enough for now if we don't strictly enforce supplier view yet.
-- Actually, for the "Admin Verification" part, admins need access.
-- Let's stick to Agent access for now as per requirements.
