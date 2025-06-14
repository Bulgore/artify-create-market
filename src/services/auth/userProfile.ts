
import { supabase } from '@/integrations/supabase/client';
import { validateEmail, sanitizeText } from '@/utils/secureValidation';

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
        email: email, // Email sera synchronisé automatiquement via le trigger
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
