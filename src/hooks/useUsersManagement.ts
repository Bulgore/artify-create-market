
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types/creator";

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
}

export const useUsersManagement = () => {
  const { isSuperAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isResetting, setIsResetting] = useState<string | null>(null);

  useEffect(() => {
    if (isSuperAdmin()) {
      fetchUsers();
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    const filtered = users.filter(user =>
      (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.role || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      console.log('👥 Fetching users...');
      
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          id,
          full_name_fr,
          full_name_en,
          full_name_ty,
          bio_fr,
          bio_en,
          bio_ty,
          role,
          is_super_admin,
          is_public_profile,
          creator_status,
          creator_level,
          default_commission,
          avatar_url,
          banner_url,
          website_url,
          social_links,
          keywords,
          products_count,
          onboarding_completed,
          created_at,
          updated_at,
          reviewed_at,
          reviewed_by,
          rejection_reason
        `)
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('❌ Error fetching users:', usersError);
        throw usersError;
      }

      console.log('✅ Users fetched:', usersData?.length || 0);

      const { data: authUsersData, error: authError } = await supabase.rpc('get_auth_users_for_admin');

      if (authError) {
        console.warn('⚠️ Could not fetch auth users:', authError);
      }

      const authUsers: AuthUser[] = Array.isArray(authUsersData) ? authUsersData : [];

      const mappedUsers = (usersData || []).map((user: any): User => {
        const authUser = authUsers.find((au: AuthUser) => au.id === user.id);
        
        return {
          ...user,
          full_name: user.full_name_fr || user.full_name_en || user.full_name_ty || authUser?.email || 'Utilisateur sans nom',
          bio: user.bio_fr || user.bio_en || user.bio_ty || '',
          role: user.role || 'créateur',
          email: authUser?.email || '',
          created_at: user.created_at || new Date().toISOString(),
          updated_at: user.updated_at || new Date().toISOString(),
          id: user.id || '',
          is_super_admin: user.is_super_admin || false,
          default_commission: user.default_commission || 15,
          avatar_url: user.avatar_url || null,
          is_public_profile: user.is_public_profile || false,
          website_url: user.website_url || null,
          social_links: user.social_links || {},
          creator_status: user.creator_status || undefined,
          creator_level: user.creator_level || undefined,
          products_count: user.products_count || 0,
          onboarding_completed: user.onboarding_completed || false,
          banner_url: user.banner_url || null,
          keywords: user.keywords || [],
          reviewed_at: user.reviewed_at || null,
          reviewed_by: user.reviewed_by || null,
          rejection_reason: user.rejection_reason || null
        };
      });

      console.log('✅ Mapped users:', mappedUsers.length);
      setUsers(mappedUsers);
    } catch (error: any) {
      console.error('❌ Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les utilisateurs. Vérifiez vos permissions d'admin."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetUser = async (user: User) => {
    setIsResetting(user.id);
    try {
      console.log('🔄 Resetting user account:', user.id);
      
      const { data, error } = await supabase.rpc('reset_user_account', {
        target_user_id: user.id
      });

      if (error) {
        console.error('❌ Error resetting user:', error);
        throw error;
      }

      toast({
        title: "Compte réinitialisé",
        description: `Le compte de ${user.full_name || user.email} a été réinitialisé avec succès.`,
      });

      fetchUsers();
    } catch (error: any) {
      console.error('❌ Error resetting user:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de réinitialiser le compte utilisateur.",
      });
    } finally {
      setIsResetting(null);
    }
  };

  const handleDeleteUser = async (user: User) => {
    try {
      console.log('🗑️ Deleting user:', user.id);
      
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (userError) {
        console.error('❌ Error deleting user profile:', userError);
        throw userError;
      }

      const { data: authResult, error: authError } = await supabase.rpc('delete_auth_user', {
        user_id: user.id
      });

      if (authError) {
        console.warn('⚠️ Could not delete auth user:', authError);
      }

      toast({
        title: "Utilisateur supprimé",
        description: `${user.full_name || user.email} a été supprimé avec succès.`,
      });

      fetchUsers();
    } catch (error: any) {
      console.error('❌ Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur.",
      });
    }
  };

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
