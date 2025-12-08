-- Add rejection_reason column to suppliers table
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
