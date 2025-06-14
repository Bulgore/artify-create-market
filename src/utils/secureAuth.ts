
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
    // Utiliser la nouvelle fonction RPC pour logger les actions
    const { error } = await supabase.rpc('log_admin_action', {
      action_type: actionType,
      target_table: targetTable,
      target_id: targetId,
      details: details
    });

    if (error) {
      console.error('Error logging admin action:', error);
    } else {
      console.log('✅ Admin action logged:', {
        actionType,
        targetTable,
        targetId,
        details
      });
    }
  } catch (error) {
    console.error('Error in logAdminAction:', error);
  }
};

// Fonction pour promouvoir un utilisateur (côté admin)
export const promoteUserToSuperAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('promote_to_super_admin', {
      target_user_id: userId
    });

    if (error) {
      console.error('Error promoting user:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in promoteUserToSuperAdmin:', error);
    throw error;
  }
};
