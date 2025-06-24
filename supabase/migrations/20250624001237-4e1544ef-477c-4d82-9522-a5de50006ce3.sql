
-- Phase 1: Critical RLS Policy Fixes (Fixed INSERT syntax)

-- 1. Clean up and recreate creator_products policies
DROP POLICY IF EXISTS "Debug: allow all authenticated inserts" ON public.creator_products;
DROP POLICY IF EXISTS "Debug: allow all authenticated reads" ON public.creator_products;
DROP POLICY IF EXISTS "Users can view own creator products" ON public.creator_products;
DROP POLICY IF EXISTS "Users can create own creator products" ON public.creator_products;
DROP POLICY IF EXISTS "Users can update own creator products" ON public.creator_products;
DROP POLICY IF EXISTS "Creators can manage their products" ON public.creator_products;
DROP POLICY IF EXISTS "Public can view published products" ON public.creator_products;
DROP POLICY IF EXISTS "Creators can manage their own products" ON public.creator_products;
DROP POLICY IF EXISTS "Admins can manage all products" ON public.creator_products;

-- Create consolidated, secure policies for creator_products
CREATE POLICY "Creators can manage their own products"
  ON public.creator_products
  FOR ALL
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Admins can manage all products"
  ON public.creator_products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND (role IN ('admin', 'superAdmin') OR is_super_admin = true)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND (role IN ('admin', 'superAdmin') OR is_super_admin = true)
    )
  );

CREATE POLICY "Public can view published products"
  ON public.creator_products
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true AND status = 'published');

-- 2. Secure admin_audit_logs table
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only super admins can access audit logs" ON public.admin_audit_logs;
CREATE POLICY "Only super admins can access audit logs"
  ON public.admin_audit_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND is_super_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND is_super_admin = true
    )
  );

-- 3. Secure rate_limit_attempts table
ALTER TABLE public.rate_limit_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only system can access rate limits" ON public.rate_limit_attempts;
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.rate_limit_attempts;

CREATE POLICY "Only system can access rate limits"
  ON public.rate_limit_attempts
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Service role can manage rate limits"
  ON public.rate_limit_attempts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 4. Secure product_mockups table
ALTER TABLE public.product_mockups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view mockups" ON public.product_mockups;
DROP POLICY IF EXISTS "Admins can insert mockups" ON public.product_mockups;
DROP POLICY IF EXISTS "Admins can update mockups" ON public.product_mockups;
DROP POLICY IF EXISTS "Admins can delete mockups" ON public.product_mockups;

CREATE POLICY "Anyone can view mockups"
  ON public.product_mockups
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert mockups"
  ON public.product_mockups
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND (role IN ('admin', 'superAdmin') OR is_super_admin = true)
    )
  );

CREATE POLICY "Admins can update mockups"
  ON public.product_mockups
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND (role IN ('admin', 'superAdmin') OR is_super_admin = true)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND (role IN ('admin', 'superAdmin') OR is_super_admin = true)
    )
  );

CREATE POLICY "Admins can delete mockups"
  ON public.product_mockups
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND (role IN ('admin', 'superAdmin') OR is_super_admin = true)
    )
  );

-- 5. Secure interface_translations table
ALTER TABLE public.interface_translations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read translations" ON public.interface_translations;
DROP POLICY IF EXISTS "Admins can insert translations" ON public.interface_translations;
DROP POLICY IF EXISTS "Admins can update translations" ON public.interface_translations;
DROP POLICY IF EXISTS "Admins can delete translations" ON public.interface_translations;

CREATE POLICY "Anyone can read translations"
  ON public.interface_translations
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert translations"
  ON public.interface_translations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND (role IN ('admin', 'superAdmin') OR is_super_admin = true)
    )
  );

CREATE POLICY "Admins can update translations"
  ON public.interface_translations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND (role IN ('admin', 'superAdmin') OR is_super_admin = true)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND (role IN ('admin', 'superAdmin') OR is_super_admin = true)
    )
  );

CREATE POLICY "Admins can delete translations"
  ON public.interface_translations
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND (role IN ('admin', 'superAdmin') OR is_super_admin = true)
    )
  );

-- 6. Secure media_files table
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own media files" ON public.media_files;
DROP POLICY IF EXISTS "Admins can view all media files" ON public.media_files;

CREATE POLICY "Users can manage their own media files"
  ON public.media_files
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all media files"
  ON public.media_files
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND (role IN ('admin', 'superAdmin') OR is_super_admin = true)
    )
  );

-- 7. Secure creator_notifications table
ALTER TABLE public.creator_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.creator_notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.creator_notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.creator_notifications;

CREATE POLICY "Users can view their own notifications"
  ON public.creator_notifications
  FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON public.creator_notifications
  FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON public.creator_notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 8. Enhanced role validation function
CREATE OR REPLACE FUNCTION public.validate_user_role_secure(required_role text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
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
$$;
