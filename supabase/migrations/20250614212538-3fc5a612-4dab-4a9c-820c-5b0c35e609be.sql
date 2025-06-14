
-- 1. Suppression de l'auto-promotion admin via email hardcodé
-- Mettre à jour la fonction pour ne plus avoir d'email hardcodé
CREATE OR REPLACE FUNCTION public.sync_user_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- 2. Création de la table d'audit trail pour les actions admin
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES public.users(id) NOT NULL,
  action_type TEXT NOT NULL,
  target_table TEXT,
  target_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour les performances sur les requêtes d'audit
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_user ON public.admin_audit_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action_type ON public.admin_audit_logs(action_type);

-- 3. Fonction pour logger les actions admin de manière sécurisée
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_type TEXT,
  target_table TEXT DEFAULT NULL,
  target_id UUID DEFAULT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET DEFAULT NULL,
  user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
  current_user_id UUID;
  current_user_role TEXT;
BEGIN
  -- Récupérer l'utilisateur actuel
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Action non autorisée: utilisateur non authentifié';
  END IF;
  
  -- Vérifier que l'utilisateur est bien admin ou super admin
  SELECT 
    CASE 
      WHEN is_super_admin = true THEN 'superAdmin'
      ELSE role
    END INTO current_user_role
  FROM public.users 
  WHERE id = current_user_id;
  
  IF current_user_role NOT IN ('admin', 'superAdmin') THEN
    RAISE EXCEPTION 'Action non autorisée: droits administrateur requis';
  END IF;
  
  -- Insérer le log d'audit
  INSERT INTO public.admin_audit_logs (
    admin_user_id,
    action_type,
    target_table,
    target_id,
    details,
    ip_address,
    user_agent
  ) VALUES (
    current_user_id,
    action_type,
    target_table,
    target_id,
    details,
    ip_address,
    user_agent
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- 4. Fonction sécurisée pour promouvoir un utilisateur en super admin
CREATE OR REPLACE FUNCTION public.promote_to_super_admin(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id UUID;
  current_user_role TEXT;
  target_user_email TEXT;
BEGIN
  -- Récupérer l'utilisateur actuel
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Action non autorisée: utilisateur non authentifié';
  END IF;
  
  -- Vérifier que l'utilisateur actuel est super admin
  SELECT 
    CASE 
      WHEN is_super_admin = true THEN 'superAdmin'
      ELSE role
    END INTO current_user_role
  FROM public.users 
  WHERE id = current_user_id;
  
  IF current_user_role != 'superAdmin' THEN
    RAISE EXCEPTION 'Action non autorisée: seuls les super administrateurs peuvent promouvoir d autres utilisateurs';
  END IF;
  
  -- Récupérer l'email de l'utilisateur cible pour l'audit
  SELECT email INTO target_user_email
  FROM public.users
  WHERE id = target_user_id;
  
  IF target_user_email IS NULL THEN
    RAISE EXCEPTION 'Utilisateur introuvable';
  END IF;
  
  -- Promouvoir l'utilisateur
  UPDATE public.users
  SET 
    is_super_admin = true,
    role = 'admin',
    updated_at = now()
  WHERE id = target_user_id;
  
  -- Logger l'action
  PERFORM public.log_admin_action(
    'PROMOTE_TO_SUPER_ADMIN',
    'users',
    target_user_id,
    jsonb_build_object('target_email', target_user_email, 'promoted_by', current_user_id)
  );
  
  RETURN true;
END;
$$;

-- 5. Table pour le rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limit_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL, -- IP address ou user ID
  attempt_type TEXT NOT NULL, -- 'login', 'signup', etc.
  attempt_count INTEGER NOT NULL DEFAULT 1,
  first_attempt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_attempt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  blocked_until TIMESTAMP WITH TIME ZONE
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_rate_limit_identifier_type ON public.rate_limit_attempts(identifier, attempt_type);
CREATE INDEX IF NOT EXISTS idx_rate_limit_blocked_until ON public.rate_limit_attempts(blocked_until);

-- 6. Fonction de rate limiting
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  identifier TEXT,
  attempt_type TEXT,
  max_attempts INTEGER DEFAULT 5,
  window_minutes INTEGER DEFAULT 15
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_attempts INTEGER;
  window_start TIMESTAMP WITH TIME ZONE;
  is_blocked BOOLEAN;
BEGIN
  window_start := now() - (window_minutes || ' minutes')::INTERVAL;
  
  -- Vérifier si l'utilisateur est actuellement bloqué
  SELECT 
    CASE 
      WHEN blocked_until IS NOT NULL AND blocked_until > now() THEN true
      ELSE false
    END INTO is_blocked
  FROM public.rate_limit_attempts
  WHERE identifier = check_rate_limit.identifier 
    AND attempt_type = check_rate_limit.attempt_type;
  
  IF is_blocked THEN
    RETURN false;
  END IF;
  
  -- Nettoyer les anciennes tentatives
  DELETE FROM public.rate_limit_attempts
  WHERE last_attempt < window_start;
  
  -- Compter les tentatives dans la fenêtre
  SELECT COALESCE(attempt_count, 0) INTO current_attempts
  FROM public.rate_limit_attempts
  WHERE identifier = check_rate_limit.identifier 
    AND attempt_type = check_rate_limit.attempt_type
    AND first_attempt >= window_start;
  
  -- Si on dépasse la limite, bloquer
  IF current_attempts >= max_attempts THEN
    UPDATE public.rate_limit_attempts
    SET 
      blocked_until = now() + (window_minutes || ' minutes')::INTERVAL,
      last_attempt = now()
    WHERE identifier = check_rate_limit.identifier 
      AND attempt_type = check_rate_limit.attempt_type;
    
    RETURN false;
  END IF;
  
  -- Incrémenter ou créer le compteur
  INSERT INTO public.rate_limit_attempts (identifier, attempt_type, attempt_count)
  VALUES (check_rate_limit.identifier, check_rate_limit.attempt_type, 1)
  ON CONFLICT (identifier, attempt_type) 
  DO UPDATE SET 
    attempt_count = rate_limit_attempts.attempt_count + 1,
    last_attempt = now();
  
  RETURN true;
END;
$$;

-- Ajouter une contrainte unique pour le rate limiting
ALTER TABLE public.rate_limit_attempts 
ADD CONSTRAINT unique_identifier_type UNIQUE (identifier, attempt_type);
