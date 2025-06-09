import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, UserPlus, Edit2 } from "lucide-react";
import EditUserModal from "./EditUserModal";
import { User, mapUserWithCompatibility } from "@/types/creator";

const UsersManagement = () => {
  const { isSuperAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (isSuperAdmin()) {
      fetchUsers();
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          full_name_fr,
          full_name_en,
          full_name_ty,
          bio_fr,
          bio_en,
          bio_ty,
          role,
          is_super_admin,
          is_active,
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

      if (error) throw error;

      // Mapper avec compatibilité pour tous les utilisateurs
      const mappedUsers = (data || []).map((user: any) => mapUserWithCompatibility({
        ...user,
        full_name: user.full_name_fr ?? '',
        bio: user.bio_fr ?? ''
      }));

      setUsers(mappedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les utilisateurs."
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
              Gestion des Utilisateurs
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
                            alt={user.full_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-medium">{user.full_name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
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

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
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
