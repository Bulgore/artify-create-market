
-- Migration pour corriger la structure utilisateur et les problèmes d'inscription
-- 1. S'assurer que la table users a la bonne structure pour les champs multilingues
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS bio text;

-- 2. Mettre à jour la fonction de création d'utilisateur pour gérer les anciens et nouveaux formats
CREATE OR REPLACE FUNCTION public.create_user_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- 3. Recréer le trigger si nécessaire
DROP TRIGGER IF EXISTS create_user_on_signup_trigger ON auth.users;
CREATE TRIGGER create_user_on_signup_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user_on_signup();

-- 4. Normaliser les utilisateurs existants qui n'ont pas de champs multilingues
UPDATE public.users 
SET 
  full_name = COALESCE(full_name, full_name_fr, full_name_en, full_name_ty, 'Utilisateur'),
  full_name_fr = COALESCE(full_name_fr, full_name, 'Utilisateur'),
  full_name_en = COALESCE(full_name_en, full_name, 'User'),
  full_name_ty = COALESCE(full_name_ty, full_name, 'Utilisateur'),
  bio = COALESCE(bio, bio_fr, bio_en, bio_ty, ''),
  bio_fr = COALESCE(bio_fr, bio, ''),
  bio_en = COALESCE(bio_en, bio, ''),
  bio_ty = COALESCE(bio_ty, bio, ''),
  role = COALESCE(role, 'créateur'),
  creator_status = COALESCE(creator_status, 'draft'),
  creator_level = COALESCE(creator_level, 'debutant'),
  updated_at = now()
WHERE 
  full_name IS NULL 
  OR full_name_fr IS NULL 
  OR full_name_en IS NULL 
  OR full_name_ty IS NULL 
  OR bio IS NULL
  OR bio_fr IS NULL 
  OR bio_en IS NULL 
  OR bio_ty IS NULL
  OR role IS NULL
  OR creator_status IS NULL
  OR creator_level IS NULL;
