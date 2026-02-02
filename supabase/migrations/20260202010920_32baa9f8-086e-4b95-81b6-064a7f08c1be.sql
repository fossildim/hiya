-- Fix 1: Add admin policies for user_roles table to allow role management
-- Currently user_roles has no INSERT, UPDATE, or DELETE policies

-- Allow admins to insert new user roles
CREATE POLICY "Admins can insert user roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update user roles
CREATE POLICY "Admins can update user roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete user roles
CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to view all user roles (not just their own)
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Tighten profiles table RLS - remove admin-wide access to emails
-- Drop the existing policy that lets admins view all profiles with emails
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a more restrictive admin view policy using a view approach
-- Instead of exposing emails to admins, they should only see non-sensitive profile data
-- For now, we remove the admin-wide access since profiles should only be visible to the owner
-- Admins don't need to see all user profiles with emails for this application