
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { validateUserRole, logAdminAction } from '@/utils/secureAuth';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export const useUserActions = () => {
  const [isResetting, setIsResetting] = useState<string | null>(null);

  const resetUser = async (user: User) => {
    try {
      const isValidSuperAdmin = await validateUserRole('superAdmin');
      
      if (!isValidSuperAdmin) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Action non autorisée.",
        });
        return { success: false };
      }

      setIsResetting(user.id);
      
      const { error } = await supabase.rpc('reset_user_account', { 
        target_user_id: user.id 
      });
      
      if (error) throw error;
      
      await logAdminAction('RESET_USER', 'users', user.id, { 
        user_email: user.email,
        previous_role: user.role 
      });
      
      toast({
        title: "Utilisateur réinitialisé",
        description: `Le compte de ${user.email} a été réinitialisé.`,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error resetting user:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de réinitialiser l'utilisateur.",
      });
      return { success: false, error };
    } finally {
      setIsResetting(null);
    }
  };

  const deleteUser = async (user: User) => {
    try {
      const isValidSuperAdmin = await validateUserRole('superAdmin');
      
      if (!isValidSuperAdmin) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Action non autorisée.",
        });
        return { success: false };
      }

      const { error } = await supabase.rpc('delete_auth_user', { 
        user_id: user.id 
      });
      
      if (error) throw error;
      
      await logAdminAction('DELETE_USER', 'users', user.id, { 
        user_email: user.email,
        user_role: user.role 
      });
      
      toast({
        title: "Utilisateur supprimé",
        description: `Le compte de ${user.email} a été supprimé.`,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur.",
      });
      return { success: false, error };
    }
  };

  return {
    isResetting,
    resetUser,
    deleteUser
  };
};
