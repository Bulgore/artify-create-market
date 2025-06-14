
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Search, RotateCcw, Trash2, Edit, Mail } from "lucide-react";
import { useUsersManagement } from "@/hooks/useUsersManagement";
import UserResetDialog from "./users/UserResetDialog";
import UserDeleteDialog from "./users/UserDeleteDialog";
import EditUserModal from "./EditUserModal";

const UsersManagement = () => {
  const {
    filteredUsers,
    isLoading,
    searchTerm,
    isResetting,
    setSearchTerm,
    fetchUsers,
    handleResetUser,
    handleDeleteUser,
    isSuperAdmin
  } = useUsersManagement();

  const [selectedUser, setSelectedUser] = React.useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [resetDialogUser, setResetDialogUser] = React.useState(null);
  const [deleteDialogUser, setDeleteDialogUser] = React.useState(null);

  if (!isSuperAdmin()) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Accès réservé aux super administrateurs.</p>
        </CardContent>
      </Card>
    );
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superAdmin':
        return 'bg-red-100 text-red-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'imprimeur':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestion des Utilisateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, email ou rôle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={fetchUsers} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des utilisateurs...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
              </p>
              
              {filteredUsers.map((user) => (
                <Card key={user.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>
                          {user.full_name ? user.full_name.charAt(0).toUpperCase() : '?'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {user.full_name || 'Nom non défini'}
                          </h3>
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                          {user.is_super_admin && (
                            <Badge variant="destructive">SUPER ADMIN</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span>{user.email || 'Email non disponible'}</span>
                        </div>
                        
                        <p className="text-sm text-gray-500">
                          Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </p>
                        
                        {user.creator_status && (
                          <Badge variant="outline" className="text-xs">
                            Statut créateur: {user.creator_status}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setResetDialogUser(user)}
                        disabled={isResetting === user.id}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        {isResetting === user.id ? 'Reset...' : 'Reset'}
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteDialogUser(user)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals et dialogs */}
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          onSave={fetchUsers}
        />
      )}

      {resetDialogUser && (
        <UserResetDialog
          user={resetDialogUser}
          isOpen={!!resetDialogUser}
          onClose={() => setResetDialogUser(null)}
          onConfirm={() => {
            handleResetUser(resetDialogUser);
            setResetDialogUser(null);
          }}
        />
      )}

      {deleteDialogUser && (
        <UserDeleteDialog
          user={deleteDialogUser}
          isOpen={!!deleteDialogUser}
          onClose={() => setDeleteDialogUser(null)}
          onConfirm={() => {
            handleDeleteUser(deleteDialogUser);
            setDeleteDialogUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UsersManagement;
