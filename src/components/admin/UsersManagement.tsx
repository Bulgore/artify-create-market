
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, UserPlus, Edit2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import EditUserModal from "./EditUserModal";
import { User } from "@/types/creator";

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
}

const UsersManagement = () => {
  const { isSuperAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

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
      console.log('Fetching users...');
      
      // Récupérer d'abord les utilisateurs depuis la table users
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
        console.error('Error fetching users:', usersError);
        throw usersError;
      }

      console.log('Users fetched:', usersData?.length || 0);

      // Récupérer les emails depuis auth.users via la nouvelle fonction RPC
      const { data: authUsersData, error: authError } = await supabase.rpc('get_auth_users_for_admin');

      if (authError) {
        console.warn('Could not fetch auth users:', authError);
      }

      // Assurer que authUsersData est un tableau
      const authUsers: AuthUser[] = Array.isArray(authUsersData) ? authUsersData : [];

      // Mapper les données avec les emails
      const mappedUsers = (usersData || []).map((user: any): User => {
        const authUser = authUsers.find((au: AuthUser) => au.id === user.id);
        
        return {
          ...user,
          // Champs obligatoires avec fallbacks sécurisés
          full_name: user.full_name_fr || user.full_name_en || user.full_name_ty || authUser?.email || 'Utilisateur sans nom',
          bio: user.bio_fr || user.bio_en || user.bio_ty || '',
          role: user.role || 'créateur',
          email: authUser?.email || '',
          created_at: user.created_at || new Date().toISOString(),
          updated_at: user.updated_at || new Date().toISOString(),
          id: user.id || '',
          // Champs optionnels avec valeurs par défaut
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

      console.log('Mapped users:', mappedUsers.length, mappedUsers[0]);
      setUsers(mappedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les utilisateurs. Vérifiez vos permissions d'admin."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUserUpdated = () => {
    fetchUsers();
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (user: User) => {
    try {
      console.log('Deleting user:', user.id);
      
      // Supprimer d'abord de la table users
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (userError) {
        console.error('Error deleting user profile:', userError);
        throw userError;
      }

      // Ensuite supprimer de auth.users via la fonction RPC
      const { data: authResult, error: authError } = await supabase.rpc('delete_auth_user', {
        user_id: user.id
      });

      if (authError) {
        console.warn('Could not delete auth user:', authError);
        // Ne pas échouer si l'utilisateur auth n'existe pas
      }

      toast({
        title: "Utilisateur supprimé",
        description: `${user.full_name || user.email} a été supprimé avec succès.`,
      });

      // Rafraîchir la liste
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur.",
      });
    } finally {
      setUserToDelete(null);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'créateur': return 'bg-blue-100 text-blue-800';
      case 'imprimeur': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isSuperAdmin()) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Accès refusé. Seuls les super administrateurs peuvent gérer les utilisateurs.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Gestion des Utilisateurs ({filteredUsers.length})
            </CardTitle>
            <Button onClick={fetchUsers} disabled={isLoading}>
              {isLoading ? 'Chargement...' : 'Actualiser'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email ou rôle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des utilisateurs...</p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {user.avatar_url && (
                            <img
                              src={user.avatar_url}
                              alt={user.full_name || 'Avatar'}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <h3 className="font-medium">{user.full_name || 'Nom non défini'}</h3>
                            <p className="text-sm text-muted-foreground">{user.email || 'Email non défini'}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className={getRoleColor(user.role || 'créateur')}>
                            {user.role || 'créateur'}
                          </Badge>
                          {user.is_super_admin && (
                            <Badge variant="destructive">Super Admin</Badge>
                          )}
                          {user.creator_status && (
                            <Badge className={getStatusColor(user.creator_status)}>
                              {user.creator_status}
                            </Badge>
                          )}
                          {user.creator_level && (
                            <Badge variant="outline">
                              {user.creator_level}
                            </Badge>
                          )}
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <p>Inscription: {new Date(user.created_at).toLocaleDateString()}</p>
                          {user.products_count !== undefined && (
                            <p>Produits: {user.products_count}</p>
                          )}
                          {user.bio && <p className="mt-1">{user.bio}</p>}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{user.full_name || user.email}</strong> ?
                                Cette action est irréversible et supprimera définitivement son compte et toutes ses données.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredUsers.length === 0 && !isLoading && (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun utilisateur trouvé.
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <EditUserModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
};

export default UsersManagement;
