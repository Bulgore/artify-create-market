
-- 1. Ajouter la colonne email dans la table users si elle n'existe pas déjà
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS email text;

-- 2. Fonction pour synchroniser l'email depuis auth.users vers users
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

-- 3. Supprimer l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS create_user_on_signup_trigger ON auth.users;
DROP TRIGGER IF EXISTS sync_user_email_trigger ON auth.users;

-- 4. Créer le nouveau trigger pour les insertions et mises à jour
CREATE TRIGGER sync_user_email_trigger
  AFTER INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_email();

-- 5. Migration pour synchroniser les emails existants
-- Mettre à jour tous les utilisateurs existants avec leurs emails depuis auth.users
UPDATE public.users 
SET email = auth_users.email,
    updated_at = NOW()
FROM auth.users auth_users
WHERE public.users.id = auth_users.id 
  AND (public.users.email IS NULL OR public.users.email != auth_users.email);

-- 6. Rendre la colonne email obligatoire maintenant qu'elle est remplie
ALTER TABLE public.users 
ALTER COLUMN email SET NOT NULL;

-- 7. Ajouter un index sur email pour les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 8. Commentaire de documentation
COMMENT ON COLUMN public.users.email IS 'Email synchronisé automatiquement depuis auth.users via trigger. Ne pas modifier manuellement.';
COMMENT ON FUNCTION public.sync_user_email() IS 'Fonction de synchronisation automatique des emails entre auth.users et public.users. Déclenchée par trigger sur INSERT/UPDATE.';
