-- Phase 1: Critical Security Fixes

-- 1. Fix privilege escalation vulnerability - prevent self-promotion to super admin
UPDATE public.users 
SET is_super_admin = false 
WHERE is_super_admin = true AND email != 'tahiticrea@gmail.com';

-- 2. Add constraint to prevent unauthorized super admin creation
ALTER TABLE public.users 
ADD CONSTRAINT prevent_unauthorized_super_admin 
CHECK (
  CASE 
    WHEN is_super_admin = true THEN email = 'tahiticrea@gmail.com'
    ELSE true
  END
);

-- 3. Create secure function for super admin promotion (only by existing super admins)
CREATE OR REPLACE FUNCTION public.secure_promote_to_super_admin(target_user_id uuid, target_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  current_user_id UUID;
  is_current_super_admin BOOLEAN;
BEGIN
  current_user_id := auth.uid();
  
  -- Check if current user is super admin
  SELECT is_super_admin INTO is_current_super_admin
  FROM public.users 
  WHERE id = current_user_id;
  
  IF NOT is_current_super_admin THEN
    RAISE EXCEPTION 'Access denied: Only super admins can promote users';
  END IF;
  
  -- Prevent self-promotion
  IF target_user_id = current_user_id THEN
    RAISE EXCEPTION 'Cannot promote your own account';
  END IF;
  
  -- Verify target user exists and email matches
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = target_user_id AND email = target_email
  ) THEN
    RAISE EXCEPTION 'User not found or email mismatch';
  END IF;
  
  -- Log the promotion attempt
  PERFORM public.log_admin_action(
    'SECURE_PROMOTE_TO_SUPER_ADMIN',
    'users',
    target_user_id,
    jsonb_build_object('target_email', target_email)
  );
  
  -- Promote the user
  UPDATE public.users
  SET 
    is_super_admin = true,
    role = 'admin',
    updated_at = now()
  WHERE id = target_user_id;
  
  RETURN true;
END;
$$;

-- 4. Strengthen rate limiting with enhanced security
CREATE OR REPLACE FUNCTION public.enhanced_rate_limit_check(
  identifier text, 
  attempt_type text, 
  max_attempts integer DEFAULT 5, 
  window_minutes integer DEFAULT 15,
  block_duration_minutes integer DEFAULT 30
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  current_attempts INTEGER;
  window_start TIMESTAMP WITH TIME ZONE;
  is_blocked BOOLEAN;
  block_end TIMESTAMP WITH TIME ZONE;
BEGIN
  window_start := now() - (window_minutes || ' minutes')::INTERVAL;
  
  -- Check if currently blocked
  SELECT 
    CASE 
      WHEN blocked_until IS NOT NULL AND blocked_until > now() THEN true
      ELSE false
    END,
    blocked_until
  INTO is_blocked, block_end
  FROM public.rate_limit_attempts
  WHERE identifier = enhanced_rate_limit_check.identifier 
    AND attempt_type = enhanced_rate_limit_check.attempt_type;
  
  IF is_blocked THEN
    -- Log the blocked attempt
    INSERT INTO public.admin_audit_logs (
      admin_user_id,
      action_type,
      details
    ) VALUES (
      auth.uid(),
      'RATE_LIMIT_BLOCKED_ATTEMPT',
      jsonb_build_object(
        'identifier', identifier,
        'attempt_type', attempt_type,
        'blocked_until', block_end
      )
    );
    RETURN false;
  END IF;
  
  -- Clean old attempts
  DELETE FROM public.rate_limit_attempts
  WHERE last_attempt < window_start;
  
  -- Count current attempts
  SELECT COALESCE(attempt_count, 0) INTO current_attempts
  FROM public.rate_limit_attempts
  WHERE identifier = enhanced_rate_limit_check.identifier 
    AND attempt_type = enhanced_rate_limit_check.attempt_type
    AND first_attempt >= window_start;
  
  -- Block if exceeded with escalating duration
  IF current_attempts >= max_attempts THEN
    UPDATE public.rate_limit_attempts
    SET 
      blocked_until = now() + (block_duration_minutes || ' minutes')::INTERVAL,
      last_attempt = now()
    WHERE identifier = enhanced_rate_limit_check.identifier 
      AND attempt_type = enhanced_rate_limit_check.attempt_type;
    
    -- Log security event
    INSERT INTO public.admin_audit_logs (
      admin_user_id,
      action_type,
      details
    ) VALUES (
      auth.uid(),
      'RATE_LIMIT_EXCEEDED_SECURITY_EVENT',
      jsonb_build_object(
        'identifier', identifier,
        'attempt_type', attempt_type,
        'attempts_count', current_attempts,
        'max_attempts', max_attempts,
        'blocked_for_minutes', block_duration_minutes
      )
    );
    
    RETURN false;
  END IF;
  
  -- Increment counter
  INSERT INTO public.rate_limit_attempts (identifier, attempt_type, attempt_count)
  VALUES (enhanced_rate_limit_check.identifier, attempt_type, 1)
  ON CONFLICT (identifier, attempt_type) 
  DO UPDATE SET 
    attempt_count = rate_limit_attempts.attempt_count + 1,
    last_attempt = now();
  
  RETURN true;
END;
$$;

-- 5. Strengthen RLS policies - Fix overly permissive policies

-- Fix creator_products policies
DROP POLICY IF EXISTS "Allow All" ON public.creator_products;
DROP POLICY IF EXISTS "Allow all insert templates" ON public.product_templates;
DROP POLICY IF EXISTS "Allow all select templates" ON public.product_templates;
DROP POLICY IF EXISTS "Allow all update templates" ON public.product_templates;
DROP POLICY IF EXISTS "Allow all insert printers" ON public.printers;
DROP POLICY IF EXISTS "Allow all select printers" ON public.printers;
DROP POLICY IF EXISTS "Allow all update printers" ON public.printers;
DROP POLICY IF EXISTS "Allow All" ON public.product_mockups;
DROP POLICY IF EXISTS "Allow all insert mockups" ON public.product_mockups;
DROP POLICY IF EXISTS "Allow all select mockups" ON public.product_mockups;
DROP POLICY IF EXISTS "Allow all update mockups" ON public.product_mockups;

-- Add proper DELETE policies for creator_products
CREATE POLICY "Creators can delete their own products" 
ON public.creator_products 
FOR DELETE 
USING (creator_id = auth.uid());

CREATE POLICY "Admins can delete all creator products" 
ON public.creator_products 
FOR DELETE 
USING (EXISTS ( 
  SELECT 1 FROM public.users 
  WHERE id = auth.uid() AND (role = ANY (ARRAY['admin'::text, 'superAdmin'::text]) OR is_super_admin = true)
));

-- Add DELETE policy for print_products
CREATE POLICY "Admins can delete print products" 
ON public.print_products 
FOR DELETE 
USING (EXISTS ( 
  SELECT 1 FROM public.users 
  WHERE id = auth.uid() AND (role = ANY (ARRAY['admin'::text, 'superAdmin'::text]) OR is_super_admin = true)
));

-- 6. Create security monitoring table for failed attempts
CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_id uuid,
  ip_address inet,
  user_agent text,
  details jsonb DEFAULT '{}',
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on security events
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Only super admins can access security events
CREATE POLICY "Only super admins can access security events" 
ON public.security_events 
FOR ALL 
USING (EXISTS ( 
  SELECT 1 FROM public.users 
  WHERE id = auth.uid() AND is_super_admin = true
));

-- 7. Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type text,
  user_id uuid DEFAULT NULL,
  ip_address inet DEFAULT NULL,
  user_agent text DEFAULT NULL,
  details jsonb DEFAULT '{}',
  severity text DEFAULT 'medium'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.security_events (
    event_type,
    user_id,
    ip_address,
    user_agent,
    details,
    severity
  ) VALUES (
    event_type,
    COALESCE(user_id, auth.uid()),
    ip_address,
    user_agent,
    details,
    severity
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;