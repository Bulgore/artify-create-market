
import { supabase } from '@/integrations/supabase/client';

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
