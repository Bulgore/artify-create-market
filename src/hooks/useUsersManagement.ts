
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { validateUserRole, logAdminAction } from '@/utils/secureAuth';
import { useUserActions } from '@/hooks/users/useUserActions';

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
  const { isSuperAdmin } = useAuth();
  const { isResetting, resetUser, deleteUser } = useUserActions();

  const fetchUsers = async () => {
    try {
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
      
      // Récupérer uniquement les profils utilisateurs avec une requête simple
      // Les emails seront affichés comme "Email non disponible" en attendant une solution pour la fonction RPC
      const { data: profiles, error: profilesError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Transformer les données en utilisant uniquement les profils
      const transformedUsers = profiles.map((profile: any) => ({
        id: profile.id,
        email: 'Email disponible via auth.users', // Placeholder en attendant la correction de la fonction RPC
        full_name: profile.full_name || profile.full_name_fr || 'Nom non défini',
        role: profile.role || 'créateur',
        is_super_admin: profile.is_super_admin || false,
        created_at: profile.created_at,
        avatar_url: profile.avatar_url,
        creator_status: profile.creator_status
      }));

      setUsers(transformedUsers);
      
      await logAdminAction('VIEW_USERS', 'users', '', { 
        user_count: transformedUsers.length 
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
    const result = await resetUser(user);
    if (result.success) {
      fetchUsers();
    }
  };

  const handleDeleteUser = async (user: User) => {
    const result = await deleteUser(user);
    if (result.success) {
      fetchUsers();
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
