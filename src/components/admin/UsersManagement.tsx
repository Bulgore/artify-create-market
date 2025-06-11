
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus } from "lucide-react";
import EditUserModal from "./EditUserModal";
import UserCard from "./users/UserCard";
import UserActions from "./users/UserActions";
import UserSearch from "./users/UserSearch";
import UserResetDialog from "./users/UserResetDialog";
import UserDeleteDialog from "./users/UserDeleteDialog";
import { User } from "@/types/creator";
import { useUsersManagement } from "@/hooks/useUsersManagement";

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

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [resetDialogUser, setResetDialogUser] = useState<User | null>(null);
  const [deleteDialogUser, setDeleteDialogUser] = useState<User | null>(null);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUserUpdated = () => {
    fetchUsers();
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleResetClick = (user: User) => {
    setResetDialogUser(user);
  };

  const handleResetConfirm = async (user: User) => {
    await handleResetUser(user);
    setResetDialogUser(null);
  };

  const handleDeleteClick = (user: User) => {
    setDeleteDialogUser(user);
  };

  const handleDeleteConfirm = async (user: User) => {
    await handleDeleteUser(user);
    setDeleteDialogUser(null);
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
          <UserSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des utilisateurs...</p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <UserCard key={user.id} user={user}>
                    <UserActions
                      user={user}
                      isResetting={isResetting === user.id}
                      onEdit={handleEditUser}
                      onReset={handleResetClick}
                      onDelete={handleDeleteClick}
                    />
                  </UserCard>
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

      {resetDialogUser && (
        <UserResetDialog
          user={resetDialogUser}
          onConfirm={handleResetConfirm}
        >
          <div />
        </UserResetDialog>
      )}

      {deleteDialogUser && (
        <UserDeleteDialog
          user={deleteDialogUser}
          onConfirm={handleDeleteConfirm}
        >
          <div />
        </UserDeleteDialog>
      )}
    </div>
  );
};

export default UsersManagement;
