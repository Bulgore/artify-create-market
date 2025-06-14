
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { validateUserRole, logAdminAction } from '@/utils/secureAuth';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_super_admin: boolean;
  created_at: string;
  avatar_url?: string;
  creator_status?: string;
}

export const useUsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isResetting, setIsResetting] = useState<string | null>(null);
  const { isSuperAdmin } = useAuth();

  const fetchUsers = async () => {
    try {
      // Validate super admin status server-side before fetching
      const isValidSuperAdmin = await validateUserRole('superAdmin');
      
      if (!isValidSuperAdmin) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous n'avez pas les droits pour accéder à cette section.",
        });
        return;
      }

      setIsLoading(true);
      
      // Get auth users (server-side validation will be done by RLS)
      const { data: authUsers, error: authError } = await supabase.rpc('get_auth_users_for_admin');
      
      if (authError) throw authError;

      // Get profiles data
      const { data: profiles, error: profilesError } = await supabase
        .from('users')
        .select('*');

      if (profilesError) throw profilesError;

      // Merge auth and profile data
      const mergedUsers = authUsers.map((authUser: any) => {
        const profile = profiles.find(p => p.id === authUser.id);
        return {
          ...authUser,
          ...profile,
          full_name: profile?.full_name || profile?.full_name_fr || 'Utilisateur',
          role: profile?.role || 'créateur'
        };
      });

      setUsers(mergedUsers);
      
      await logAdminAction('VIEW_USERS', 'users', '', { 
        user_count: mergedUsers.length 
      });
      
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des utilisateurs.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetUser = async (user: User) => {
    try {
      // Validate super admin status
      const isValidSuperAdmin = await validateUserRole('superAdmin');
      
      if (!isValidSuperAdmin) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Action non autorisée.",
        });
        return;
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
      
      fetchUsers();
    } catch (error) {
      console.error('Error resetting user:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de réinitialiser l'utilisateur.",
      });
    } finally {
      setIsResetting(null);
    }
  };

  const handleDeleteUser = async (user: User) => {
    try {
      // Validate super admin status
      const isValidSuperAdmin = await validateUserRole('superAdmin');
      
      if (!isValidSuperAdmin) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Action non autorisée.",
        });
        return;
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
      
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur.",
      });
    }
  };

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    filteredUsers,
    isLoading,
    searchTerm,
    isResetting,
    setSearchTerm,
    fetchUsers,
    handleResetUser,
    handleDeleteUser,
    isSuperAdmin
  };
};
