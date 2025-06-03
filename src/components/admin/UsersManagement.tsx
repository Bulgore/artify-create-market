
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Trash, UserCheck, UserX, RefreshCw } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

interface User {
  id: string;
  full_name: string | null;
  role: string;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
  default_commission: number;
  avatar_url: string | null;
  // Champs supplémentaires pour l'affichage
  email?: string;
  is_active?: boolean;
}

const UsersManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Récupérer d'abord les utilisateurs de la table publique
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error("Erreur lors de la récupération des utilisateurs:", usersError);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger la liste des utilisateurs.",
        });
        return;
      }

      // Enrichir avec les données d'authentification
      const enrichedUsers = await Promise.all(
        (usersData || []).map(async (user) => {
          try {
            // Récupérer l'email depuis auth.users si on a les permissions admin
            const { data: authUser } = await supabase.auth.admin.getUserById(user.id);
            return {
              ...user,
              email: authUser.user?.email || 'N/A',
              is_active: true // Par défaut actif, vous pouvez ajouter ce champ à votre table si nécessaire
            };
          } catch (error) {
            console.warn(`Impossible de récupérer l'email pour l'utilisateur ${user.id}:`, error);
            return {
              ...user,
              email: 'N/A',
              is_active: true
            };
          }
        })
      );

      setUsers(enrichedUsers);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des utilisateurs.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // Pour l'instant, on simule le changement de statut localement
      // Vous pouvez ajouter un champ is_active à votre table users si nécessaire
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, is_active: !currentStatus }
          : user
      ));

      toast({
        title: !currentStatus ? "Utilisateur activé" : "Utilisateur désactivé",
        description: "Le statut de l'utilisateur a été mis à jour.",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de l'utilisateur.",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error("Erreur lors de la suppression:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de supprimer l'utilisateur.",
        });
        return;
      }

      setUsers(users.filter(user => user.id !== userId));
      
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur.",
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) {
        console.error("Erreur lors de la mise à jour du rôle:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de mettre à jour le rôle de l'utilisateur.",
        });
        return;
      }

      // Mettre à jour l'état local
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: newRole }
          : user
      ));

      toast({
        title: "Rôle mis à jour",
        description: "Le rôle de l'utilisateur a été modifié.",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle de l'utilisateur.",
      });
    }
  };

  const filteredUsers = users.filter(user => 
    (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'superAdmin': return 'Super Admin';
      case 'créateur': return 'Créateur';
      case 'imprimeur': return 'Imprimeur';
      default: return role;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
      case 'superAdmin':
        return "default";
      case 'créateur':
        return "secondary";
      case 'imprimeur':
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <CardTitle>Gestion des Utilisateurs</CardTitle>
            <CardDescription>Administrez les comptes créateurs et imprimeurs</CardDescription>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <div className="relative">
              <Input 
                placeholder="Rechercher un utilisateur..." 
                className="w-full md:w-64 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            <Button onClick={fetchUsers} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                    <TableCell>{user.email || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {getRoleDisplayName(user.role)}
                        {user.is_super_admin && (
                          <span className="ml-1 text-xs bg-orange-500 px-1 rounded text-white">SA</span>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" title="Modifier">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => toggleUserStatus(user.id, user.is_active || false)}
                        title={user.is_active ? "Désactiver" : "Activer"}
                      >
                        {user.is_active ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deleteUser(user.id)}
                        title="Supprimer"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersManagement;
