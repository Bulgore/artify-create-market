
import { supabase } from '@/integrations/supabase/client';

export interface SecureRoleCheck {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isCreator: boolean;
  isPrinter: boolean;
  userRole: string | null;
}

export const getSecureUserRole = async (userId: string): Promise<SecureRoleCheck> => {
  try {
    // Use the security definer function we created
    const { data, error } = await supabase.rpc('get_user_role', { user_id: userId });
    
    if (error) {
      console.error('Error fetching secure user role:', error);
      return {
        isAdmin: false,
        isSuperAdmin: false,
        isCreator: false,
        isPrinter: false,
        userRole: null
      };
    }

    const role = data as string;
    
    return {
      isAdmin: role === 'admin' || role === 'superAdmin',
      isSuperAdmin: role === 'superAdmin',
      isCreator: role === 'créateur',
      isPrinter: role === 'imprimeur',
      userRole: role
    };
  } catch (error) {
    console.error('Exception in getSecureUserRole:', error);
    return {
      isAdmin: false,
      isSuperAdmin: false,
      isCreator: false,
      isPrinter: false,
      userRole: null
    };
  }
};

export const validateAdminAccess = async (userId: string): Promise<boolean> => {
  const roleCheck = await getSecureUserRole(userId);
  return roleCheck.isAdmin || roleCheck.isSuperAdmin;
};
