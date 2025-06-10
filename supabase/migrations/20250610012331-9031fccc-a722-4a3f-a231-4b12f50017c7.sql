
-- Migration corrigée pour normaliser tous les anciens comptes utilisateurs
-- Traiter uniquement les champs qui existent réellement dans la table

-- 1. Mettre à jour tous les utilisateurs qui n'ont pas de champs multilingues
UPDATE public.users 
SET 
  full_name_fr = COALESCE(full_name_fr, 'Utilisateur'),
  full_name_en = COALESCE(full_name_en, 'User'),
  full_name_ty = COALESCE(full_name_ty, 'Utilisateur'),
  bio_fr = COALESCE(bio_fr, ''),
  bio_en = COALESCE(bio_en, ''),
  bio_ty = COALESCE(bio_ty, ''),
  role = COALESCE(role, 'créateur'),
  updated_at = now()
WHERE 
  full_name_fr IS NULL 
  OR full_name_en IS NULL 
  OR full_name_ty IS NULL 
  OR bio_fr IS NULL 
  OR bio_en IS NULL 
  OR bio_ty IS NULL
  OR role IS NULL;

-- 2. S'assurer que tous les champs obligatoires ont des valeurs non vides
UPDATE public.users 
SET 
  full_name_fr = CASE 
    WHEN full_name_fr = '' OR full_name_fr IS NULL THEN 'Utilisateur'
    ELSE full_name_fr 
  END,
  role = CASE 
    WHEN role = '' OR role IS NULL THEN 'créateur'
    ELSE role 
  END,
  updated_at = now()
WHERE 
  (full_name_fr = '' OR full_name_fr IS NULL)
  OR (role = '' OR role IS NULL);

-- 3. Fonction pour réinitialiser un compte utilisateur
CREATE OR REPLACE FUNCTION public.reset_user_account(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  auth_user_email text;
BEGIN
  -- Vérifier que l'utilisateur appelant est super admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.is_super_admin = true
  ) THEN
    RAISE EXCEPTION 'Access denied: Super admin required';
  END IF;
  
  -- Récupérer l'email de l'utilisateur depuis auth.users
  SELECT email INTO auth_user_email
  FROM auth.users 
  WHERE id = target_user_id;
  
  IF auth_user_email IS NULL THEN
    RAISE EXCEPTION 'User not found in auth.users';
  END IF;
  
  -- Réinitialiser le profil utilisateur avec des valeurs par défaut
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
$$;
