
import React, { useState } from "react";
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

const UsersManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Pour un environnement réel, vous devriez utiliser une fonction edge pour récupérer les utilisateurs
      // car les requêtes directes à auth.users ne sont pas possibles via le client
      // Simulons des données pour la démonstration
      const mockUsers = [
        { id: '1', email: 'creator@example.com', user_metadata: { full_name: 'John Creator', role: 'creator' }, created_at: new Date().toISOString() },
        { id: '2', email: 'printer@example.com', user_metadata: { full_name: 'Jane Printer', role: 'printer' }, created_at: new Date().toISOString() },
        { id: '3', email: 'admin@example.com', user_metadata: { full_name: 'Admin User', role: 'admin' }, created_at: new Date().toISOString() },
      ];
      setUsers(mockUsers);
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

  const toggleUserStatus = (userId: string, isEnabled: boolean) => {
    toast({
      title: isEnabled ? "Utilisateur désactivé" : "Utilisateur activé",
      description: `Le statut de l'utilisateur a été mis à jour.`,
    });
    
    // Dans un environnement réel, vous feriez un appel API pour mettre à jour le statut
  };

  const deleteUser = (userId: string) => {
    toast({
      title: "Utilisateur supprimé",
      description: "L'utilisateur a été supprimé avec succès.",
    });
    
    // Dans un environnement réel, vous feriez un appel API pour supprimer l'utilisateur
    setUsers(users.filter(user => user.id !== userId));
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.user_metadata.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <CardTitle>Gestion des Utilisateurs</CardTitle>
            <CardDescription>Administrez les comptes créateurs et imprimeurs</CardDescription>
          </div>
          <div className="mt-4 md:mt-0 relative">
            <Input 
              placeholder="Rechercher un utilisateur..." 
              className="w-full md:w-64 pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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
                <TableHead>Date d'inscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.user_metadata.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={
                        user.user_metadata.role === 'admin' ? "default" : 
                        user.user_metadata.role === 'creator' ? "secondary" : "outline"
                      }>
                        {user.user_metadata.role === 'admin' ? 'Administrateur' : 
                         user.user_metadata.role === 'creator' ? 'Créateur' : 'Imprimeur'}
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
                        onClick={() => toggleUserStatus(user.id, true)}
                        title="Activer/Désactiver"
                      >
                        {Math.random() > 0.5 ? (
                          <UserCheck className="h-4 w-4" />
                        ) : (
                          <UserX className="h-4 w-4" />
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
