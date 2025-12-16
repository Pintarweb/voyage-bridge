-- Add created_at column to suppliers table if it doesn't exist
ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
