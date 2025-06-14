
import { supabase } from '@/integrations/supabase/client';

export const validateUserRole = async (requiredRole: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const { data: roleData, error } = await supabase.rpc('get_user_role', { 
      user_id: user.id 
    });

    if (error) {
      console.error('Error validating user role:', error);
      return false;
    }

    const userRole = roleData as string;
    
    // Check role hierarchy
    if (requiredRole === 'superAdmin') {
      return userRole === 'superAdmin';
    }
    
    if (requiredRole === 'admin') {
      return userRole === 'admin' || userRole === 'superAdmin';
    }
    
    return userRole === requiredRole;
  } catch (error) {
    console.error('Error in validateUserRole:', error);
    return false;
  }
};

export const logAdminAction = async (
  actionType: string,
  targetTable: string,
  targetId: string,
  details: Record<string, any> = {}
): Promise<void> => {
  try {
    // For now, just log to console until the RPC function is available
    console.log('Admin Action:', {
      actionType,
      targetTable,
      targetId,
      details,
      timestamp: new Date().toISOString(),
      adminId: (await supabase.auth.getUser()).data.user?.id
    });
  } catch (error) {
    console.error('Error in logAdminAction:', error);
  }
};
