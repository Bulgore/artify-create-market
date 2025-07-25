-- Security Fixes Phase 2b: Fix remaining functions without SET search_path (without custom types)

-- Fix remaining functions to include SET search_path = '' (excluding the problematic function)
CREATE OR REPLACE FUNCTION public.sync_user_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Pour les insertions (nouveaux utilisateurs)
  IF TG_OP = 'INSERT' THEN
    -- Mettre à jour ou insérer dans la table users avec l'email
    INSERT INTO public.users (
      id,
      email,
      full_name,
      full_name_fr,
      full_name_en, 
      full_name_ty,
      bio,
      bio_fr,
      bio_en,
      bio_ty,
      role,
      is_super_admin,
      creator_status,
      creator_level,
      onboarding_completed,
      is_public_profile,
      default_commission,
      products_count,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      '',
      '',
      '',
      '',
      COALESCE(NEW.raw_user_meta_data->>'role', 'créateur'),
      false, -- Plus d'auto-promotion, toujours false par défaut
      'draft',
      'debutant',
      false,
      false,
      15.00,
      0,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = NEW.email,
      updated_at = NOW();
    
    RETURN NEW;
  END IF;
  
  -- Pour les mises à jour (changement d'email)
  IF TG_OP = 'UPDATE' AND OLD.email != NEW.email THEN
    UPDATE public.users 
    SET email = NEW.email, updated_at = NOW()
    WHERE id = NEW.id;
    
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_user_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Vérifier si l'utilisateur n'existe pas déjà dans la table users
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN
    -- Insérer le nouvel utilisateur avec les données de base
    INSERT INTO public.users (
      id,
      full_name,
      full_name_fr,
      full_name_en, 
      full_name_ty,
      bio,
      bio_fr,
      bio_en,
      bio_ty,
      role,
      is_super_admin,
      creator_status,
      creator_level,
      onboarding_completed,
      is_public_profile,
      default_commission,
      products_count,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      '',
      '',
      '',
      '',
      COALESCE(NEW.raw_user_meta_data->>'role', 'créateur'),
      CASE 
        WHEN NEW.email = 'tahiticrea@gmail.com' THEN true 
        ELSE false 
      END,
      'draft',
      'debutant',
      false,
      false,
      15.00,
      0,
      NOW(),
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_creator_products_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.users 
    SET products_count = products_count + 1 
    WHERE id = NEW.creator_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.users 
    SET products_count = GREATEST(products_count - 1, 0) 
    WHERE id = OLD.creator_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_earnings(order_id uuid)
RETURNS TABLE(creator_id uuid, printer_id uuid, creator_earnings numeric, printer_earnings numeric, platform_earnings numeric)
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    d.creator_id,
    t.printer_id,
    (o.quantity * d.creator_margin)::NUMERIC AS creator_earnings,
    (o.quantity * t.base_price)::NUMERIC AS printer_earnings,
    (o.total_price - (o.quantity * d.creator_margin) - (o.quantity * t.base_price))::NUMERIC AS platform_earnings
  FROM 
    public.orders o
  JOIN 
    public.designs d ON o.design_id = d.id
  JOIN 
    public.tshirt_templates t ON o.template_id = t.id
  WHERE 
    o.id = order_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_creator_notification(creator_id uuid, notification_type text, title text, message text)
RETURNS uuid
LANGUAGE plpgsql
SET search_path = ''
AS $function$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.creator_notifications (creator_id, type, title, message)
  VALUES (creator_id, notification_type, title, message)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_auth_users_for_admin()
RETURNS TABLE(id uuid, email text, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Vérifier que l'utilisateur appelant est super admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.is_super_admin = true
  ) THEN
    RAISE EXCEPTION 'Access denied: Super admin required';
  END IF;
  
  -- Retourner les utilisateurs auth
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.created_at
  FROM auth.users au
  ORDER BY au.created_at DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_email_exists(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Vérifier que l'utilisateur appelant est super admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.is_super_admin = true
  ) THEN
    RAISE EXCEPTION 'Access denied: Super admin required';
  END IF;
  
  -- Vérifier si l'email existe
  RETURN EXISTS (
    SELECT 1 FROM auth.users WHERE email = user_email
  );
END;
$function$;