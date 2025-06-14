
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { validateEmail, sanitizeText, validatePassword, checkRateLimit } from '@/utils/secureValidation';

export const fetchUserRole = async (userId: string): Promise<string | null> => {
  try {
    console.log('🔍 Fetching role for user:', userId);
    
    if (!userId) {
      console.warn('⚠️ No userId provided to fetchUserRole');
      return null;
    }

    const { data, error } = await supabase.rpc('get_user_role', { user_id: userId });
    
    if (error) {
      console.error('❌ Error fetching user role:', error);
      return 'créateur';
    }
    
    const role = data as string || 'créateur';
    console.log('✅ Role fetched successfully:', role);
    return role;
  } catch (error) {
    console.error('❌ Unexpected error fetching user role:', error);
    return 'créateur';
  }
};

export const createUserProfile = async (
  userId: string, 
  email: string, 
  fullName: string, 
  role: string
): Promise<void> => {
  try {
    console.log('👤 Creating user profile:', { userId, email, role });
    
    // Enhanced validation
    if (!validateEmail(email)) {
      throw new Error('Email invalide');
    }
    
    const sanitizedName = sanitizeText(fullName);
    const validRoles = ['créateur', 'imprimeur'];
    
    if (!validRoles.includes(role)) {
      role = 'créateur'; // Force to default role for security
    }
    
    const { error } = await supabase
      .from('users')
      .upsert({
        id: userId,
        full_name: sanitizedName || email.split('@')[0],
        full_name_fr: sanitizedName || email.split('@')[0],
        full_name_en: sanitizedName || email.split('@')[0],
        full_name_ty: sanitizedName || email.split('@')[0],
        bio: '',
        bio_fr: '',
        bio_en: '',
        bio_ty: '',
        role: role,
        is_super_admin: false, // Never allow self-elevation
        creator_status: 'draft',
        creator_level: 'debutant',
        onboarding_completed: false,
        is_public_profile: false,
        default_commission: 15.00,
        products_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('❌ Error creating user profile:', error);
      throw error;
    }
    
    console.log('✅ User profile created successfully');
  } catch (error) {
    console.error('❌ Error creating user profile:', error);
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
    // Enhanced validation
    if (!validateEmail(email)) {
      throw new Error('Adresse email invalide');
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message);
    }
    
    const sanitizedName = sanitizeText(fullName);
    if (sanitizedName.length < 2) {
      throw new Error('Le nom doit contenir au moins 2 caractères');
    }
    
    // Rate limiting
    if (!checkRateLimit(`signup_${email}`, 3, 15 * 60 * 1000)) {
      throw new Error('Trop de tentatives d\'inscription. Veuillez réessayer dans 15 minutes.');
    }
    
    console.log('📝 Signing up user:', { email, role });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: sanitizedName,
          role: role === 'créateur' || role === 'imprimeur' ? role : 'créateur', // Strict role validation
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) throw error;
    
    console.log('✅ User signed up successfully');
    toast({
      title: "Inscription réussie",
      description: "Veuillez vérifier votre email pour confirmer votre compte.",
    });
  } catch (error: any) {
    console.error("❌ Erreur lors de l'inscription:", error);
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
    // Enhanced validation
    if (!validateEmail(email)) {
      throw new Error('Adresse email invalide');
    }
    
    // Rate limiting for login attempts
    if (!checkRateLimit(`login_${email}`, 5, 15 * 60 * 1000)) {
      throw new Error('Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.');
    }
    
    console.log('🔑 Signing in user:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    console.log('✅ User signed in successfully');
    toast({
      title: "Connexion réussie",
      description: "Bienvenue sur Podsleek!",
    });
  } catch (error: any) {
    console.error("❌ Erreur lors de la connexion:", error);
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
    console.log('🚪 Signing out user');
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    console.log('✅ User signed out successfully');
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt!",
    });
  } catch (error: any) {
    console.error("❌ Erreur lors de la déconnexion:", error);
    toast({
      variant: "destructive",
      title: "Erreur de déconnexion",
      description: error.message || "Une erreur est survenue lors de la déconnexion.",
    });
    throw error;
  }
};
