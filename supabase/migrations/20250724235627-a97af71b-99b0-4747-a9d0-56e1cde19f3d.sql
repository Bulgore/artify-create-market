-- Critical Security Fixes - Phase 1: Database Security

-- 1. Remove overly permissive RLS policy
DROP POLICY IF EXISTS "Users can view basic profile info" ON public.users;

-- 2. Create more secure, specific RLS policies for user profile viewing
CREATE POLICY "Authenticated users can view approved public profiles" 
ON public.users 
FOR SELECT 
TO authenticated
USING (
  is_public_profile = true 
  AND creator_status = 'approved'
);

CREATE POLICY "Unauthenticated users can view limited public profiles" 
ON public.users 
FOR SELECT 
TO anon
USING (
  is_public_profile = true 
  AND creator_status = 'approved'
);

-- 3. Fix security definer functions with proper search path
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN (
    SELECT 
      CASE 
        WHEN is_super_admin = true THEN 'superAdmin'
        ELSE role
      END
    FROM public.users 
    WHERE id = user_id
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_user_role_secure(required_role text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  user_role_result text;
  is_super_admin_result boolean;
BEGIN
  -- Get current user's role and super admin status
  SELECT 
    role,
    is_super_admin
  INTO 
    user_role_result,
    is_super_admin_result
  FROM public.users 
  WHERE id = auth.uid();
  
  -- If no user found, deny access
  IF user_role_result IS NULL THEN
    RETURN false;
  END IF;
  
  -- Super admins have access to everything
  IF is_super_admin_result = true THEN
    RETURN true;
  END IF;
  
  -- Check specific role requirements
  CASE required_role
    WHEN 'superAdmin' THEN
      RETURN is_super_admin_result = true;
    WHEN 'admin' THEN
      RETURN user_role_result IN ('admin', 'superAdmin') OR is_super_admin_result = true;
    WHEN 'créateur' THEN
      RETURN user_role_result = 'créateur';
    WHEN 'imprimeur' THEN
      RETURN user_role_result = 'imprimeur';
    ELSE
      RETURN user_role_result = required_role;
  END CASE;
END;
$function$;

-- 4. Create secure role validation function
CREATE OR REPLACE FUNCTION public.validate_admin_operation(operation_type text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  current_user_id UUID;
  user_role_result text;
  is_super_admin_result boolean;
BEGIN
  current_user_id := auth.uid();
  
  -- Must be authenticated
  IF current_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get user role
  SELECT 
    role,
    is_super_admin
  INTO 
    user_role_result,
    is_super_admin_result
  FROM public.users 
  WHERE id = current_user_id;
  
  -- Must be admin or super admin
  IF user_role_result NOT IN ('admin', 'superAdmin') AND is_super_admin_result != true THEN
    RETURN false;
  END IF;
  
  -- Super admin operations require super admin role
  IF operation_type IN ('DELETE_USER', 'PROMOTE_USER', 'RESET_USER') THEN
    RETURN is_super_admin_result = true;
  END IF;
  
  RETURN true;
END;
$function$;

-- 5. Update admin functions to use validation
CREATE OR REPLACE FUNCTION public.delete_auth_user(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Validate admin operation
  IF NOT public.validate_admin_operation('DELETE_USER') THEN
    RAISE EXCEPTION 'Access denied: Super admin required for user deletion';
  END IF;
  
  -- Prevent self-deletion
  IF user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot delete your own account';
  END IF;
  
  -- Log the action before deletion
  PERFORM public.log_admin_action(
    'DELETE_USER_ATTEMPT',
    'auth.users',
    user_id,
    jsonb_build_object('target_user_id', user_id)
  );
  
  -- Delete the user
  DELETE FROM auth.users WHERE id = user_id;
  
  RETURN true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.reset_user_account(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  auth_user_email text;
BEGIN
  -- Validate admin operation
  IF NOT public.validate_admin_operation('RESET_USER') THEN
    RAISE EXCEPTION 'Access denied: Super admin required for user reset';
  END IF;
  
  -- Prevent self-reset
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot reset your own account';
  END IF;
  
  -- Get user email for logging
  SELECT email INTO auth_user_email
  FROM auth.users 
  WHERE id = target_user_id;
  
  IF auth_user_email IS NULL THEN
    RAISE EXCEPTION 'User not found in auth.users';
  END IF;
  
  -- Log the action
  PERFORM public.log_admin_action(
    'RESET_USER_ACCOUNT',
    'users',
    target_user_id,
    jsonb_build_object('target_email', auth_user_email)
  );
  
  -- Reset the user profile
  UPDATE public.users 
  SET 
    full_name_fr = COALESCE(NULLIF(full_name_fr, ''), split_part(auth_user_email, '@', 1)),
    full_name_en = COALESCE(NULLIF(full_name_en, ''), split_part(auth_user_email, '@', 1)),
    full_name_ty = COALESCE(NULLIF(full_name_ty, ''), split_part(auth_user_email, '@', 1)),
    bio_fr = '',
    bio_en = '',
    bio_ty = '',
    role = COALESCE(NULLIF(role, ''), 'créateur'),
    creator_status = 'draft',
    creator_level = 'debutant',
    onboarding_completed = false,
    is_public_profile = false,
    default_commission = 15.00,
    products_count = 0,
    updated_at = now()
  WHERE id = target_user_id;
  
  RETURN true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.promote_to_super_admin(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  current_user_id UUID;
  target_user_email TEXT;
BEGIN
  current_user_id := auth.uid();
  
  -- Validate admin operation
  IF NOT public.validate_admin_operation('PROMOTE_USER') THEN
    RAISE EXCEPTION 'Access denied: Super admin required for user promotion';
  END IF;
  
  -- Cannot promote yourself
  IF target_user_id = current_user_id THEN
    RAISE EXCEPTION 'Cannot promote your own account';
  END IF;
  
  -- Get target user email for logging
  SELECT email INTO target_user_email
  FROM public.users
  WHERE id = target_user_id;
  
  IF target_user_email IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Log the promotion
  PERFORM public.log_admin_action(
    'PROMOTE_TO_SUPER_ADMIN',
    'users',
    target_user_id,
    jsonb_build_object('target_email', target_user_email, 'promoted_by', current_user_id)
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
$function$;

-- 6. Enhanced rate limiting with IP tracking
CREATE OR REPLACE FUNCTION public.check_rate_limit_enhanced(
  identifier text, 
  attempt_type text, 
  max_attempts integer DEFAULT 5, 
  window_minutes integer DEFAULT 15,
  ip_address inet DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  current_attempts INTEGER;
  window_start TIMESTAMP WITH TIME ZONE;
  is_blocked BOOLEAN;
  tracking_key TEXT;
BEGIN
  window_start := now() - (window_minutes || ' minutes')::INTERVAL;
  
  -- Create tracking key (combine identifier with IP if provided)
  tracking_key := identifier;
  IF ip_address IS NOT NULL THEN
    tracking_key := identifier || '_' || host(ip_address);
  END IF;
  
  -- Check if blocked
  SELECT 
    CASE 
      WHEN blocked_until IS NOT NULL AND blocked_until > now() THEN true
      ELSE false
    END INTO is_blocked
  FROM public.rate_limit_attempts
  WHERE identifier = tracking_key 
    AND attempt_type = check_rate_limit_enhanced.attempt_type;
  
  IF is_blocked THEN
    RETURN false;
  END IF;
  
  -- Clean old attempts
  DELETE FROM public.rate_limit_attempts
  WHERE last_attempt < window_start;
  
  -- Count current attempts
  SELECT COALESCE(attempt_count, 0) INTO current_attempts
  FROM public.rate_limit_attempts
  WHERE identifier = tracking_key 
    AND attempt_type = check_rate_limit_enhanced.attempt_type
    AND first_attempt >= window_start;
  
  -- Block if exceeded
  IF current_attempts >= max_attempts THEN
    UPDATE public.rate_limit_attempts
    SET 
      blocked_until = now() + (window_minutes * 2 || ' minutes')::INTERVAL, -- Double the block time
      last_attempt = now()
    WHERE identifier = tracking_key 
      AND attempt_type = check_rate_limit_enhanced.attempt_type;
    
    -- Log the rate limit breach
    INSERT INTO public.admin_audit_logs (
      admin_user_id,
      action_type,
      details
    ) VALUES (
      auth.uid(),
      'RATE_LIMIT_EXCEEDED',
      jsonb_build_object(
        'identifier', tracking_key,
        'attempt_type', attempt_type,
        'max_attempts', max_attempts,
        'ip_address', ip_address
      )
    );
    
    RETURN false;
  END IF;
  
  -- Increment counter
  INSERT INTO public.rate_limit_attempts (identifier, attempt_type, attempt_count)
  VALUES (tracking_key, attempt_type, 1)
  ON CONFLICT (identifier, attempt_type) 
  DO UPDATE SET 
    attempt_count = rate_limit_attempts.attempt_count + 1,
    last_attempt = now();
  
  RETURN true;
END;
$function$;