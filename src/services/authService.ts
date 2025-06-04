import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { validateEmail, sanitizeText } from '@/utils/inputValidation';

export const fetchUserRole = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc('get_user_role', { user_id: userId });
    
    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
    
    return data as string || null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};

export const createUserProfile = async (
  userId: string, 
  email: string, 
  fullName: string, 
  role: string
): Promise<void> => {
  try {
    // Validate and sanitize inputs
    if (!validateEmail(email)) {
      throw new Error('Email invalide');
    }
    
    const sanitizedName = sanitizeText(fullName);
    const validRoles = ['créateur', 'imprimeur'];
    
    if (!validRoles.includes(role)) {
      role = 'créateur'; // Default to creator for security
    }
    
    const { error } = await supabase
      .from('users')
      .upsert({
        id: userId,
        full_name: sanitizedName,
        role: role,
        is_super_admin: false, // Never set this to true via code
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const signUpUser = async (
  email: string, 
  password: string, 
  fullName: string, 
  role: string = 'créateur'
): Promise<void> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        }
      }
    });

    if (error) throw error;
    
    toast({
      title: "Inscription réussie",
      description: "Veuillez vérifier votre email pour confirmer votre compte.",
    });
  } catch (error: any) {
    console.error("Erreur lors de l'inscription:", error);
    toast({
      variant: "destructive",
      title: "Erreur d'inscription",
      description: error.message || "Une erreur est survenue lors de l'inscription.",
    });
    throw error;
  }
};

export const signInUser = async (email: string, password: string): Promise<void> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    toast({
      title: "Connexion réussie",
      description: "Bienvenue sur Podsleek!",
    });
  } catch (error: any) {
    console.error("Erreur lors de la connexion:", error);
    toast({
      variant: "destructive",
      title: "Erreur de connexion",
      description: error.message || "Email ou mot de passe incorrect.",
    });
    throw error;
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt!",
    });
  } catch (error: any) {
    console.error("Erreur lors de la déconnexion:", error);
    toast({
      variant: "destructive",
      title: "Erreur de déconnexion",
      description: error.message || "Une erreur est survenue lors de la déconnexion.",
    });
    throw error;
  }
};
