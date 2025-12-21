-- Migration to add verification fields to suppliers table
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS verification_notes TEXT;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS risk_level INTEGER DEFAULT 1;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS verification_checklist JSONB DEFAULT '{}'::jsonb;
