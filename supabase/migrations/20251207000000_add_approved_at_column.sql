-- Migration: Add approved_at column
-- Description: Adds 'approved_at' to agent_profiles table to track when an agent was approved.

ALTER TABLE public.agent_profiles
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;
