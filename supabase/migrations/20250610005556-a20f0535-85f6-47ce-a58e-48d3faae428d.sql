
-- Fonction pour récupérer les utilisateurs auth pour les admins
CREATE OR REPLACE FUNCTION public.get_auth_users_for_admin()
RETURNS TABLE(
  id uuid,
  email text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Fonction pour supprimer un utilisateur auth (super admin uniquement)
CREATE OR REPLACE FUNCTION public.delete_auth_user(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Vérifier que l'utilisateur appelant est super admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.is_super_admin = true
  ) THEN
    RAISE EXCEPTION 'Access denied: Super admin required';
  END IF;
  
  -- Supprimer l'utilisateur de auth.users (ceci déclenchera la suppression en cascade)
  DELETE FROM auth.users WHERE id = user_id;
  
  RETURN true;
END;
$$;

-- Fonction pour vérifier si un email existe déjà
CREATE OR REPLACE FUNCTION public.check_email_exists(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;
