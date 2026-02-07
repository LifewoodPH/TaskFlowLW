-- Migration: Add is_admin field to profiles table
-- This migration adds admin functionality to the TaskFlow application

-- Add is_admin column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Update RLS policies to allow admins to view all spaces
DROP POLICY IF EXISTS "Enable read for owners and members" ON public.spaces;
CREATE POLICY "Enable read for owners and members" ON public.spaces 
FOR SELECT TO authenticated 
USING (
  auth.uid() = owner_id 
  OR public.is_space_member(id)
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Update RLS policies to allow admins to view all space members
DROP POLICY IF EXISTS "Enable read for members of the space" ON public.space_members;
CREATE POLICY "Enable read for members of the space" ON public.space_members 
FOR SELECT TO authenticated 
USING (
  public.is_space_member(space_id) 
  OR user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Update RLS policies to allow admins to view and manage all tasks
DROP POLICY IF EXISTS "Enable access for space members" ON public.tasks;
CREATE POLICY "Enable access for space members" ON public.tasks 
FOR ALL TO authenticated 
USING (
  public.is_space_member(space_id)
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Optional: Set specific users as admins (update with actual user IDs)
-- UPDATE public.profiles SET is_admin = true WHERE id = 'YOUR_ADMIN_USER_ID';

COMMENT ON COLUMN public.profiles.is_admin IS 'Indicates if user has admin privileges to view all departments and tasks';
