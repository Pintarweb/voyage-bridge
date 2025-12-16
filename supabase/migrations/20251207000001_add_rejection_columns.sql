-- Migration: Add rejection reason and date columns
-- Description: Adds 'rejection_reason' and 'rejected_at' to agent_profiles table.

ALTER TABLE public.agent_profiles
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP WITH TIME ZONE;
