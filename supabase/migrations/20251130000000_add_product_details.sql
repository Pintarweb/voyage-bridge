ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS star_rating numeric,
ADD COLUMN IF NOT EXISTS address text;
