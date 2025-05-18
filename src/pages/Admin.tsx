import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash, UserCheck, UserX, RefreshCw, FileText, Save } from "lucide-react";
import PageEditor from "@/components/PageEditor";

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [designs, setDesigns] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [pageContent, setPageContent] = useState<string>("");
  const [pageTitle, setPageTitle] = useState<string>("");
  const [editingPage, setEditingPage] = useState(false);
  
  // Redirect if not logged in or not an admin
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    } else if (!isAdmin()) {
      navigate("/");
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
      });
    }
  }, [user, navigate, isAdmin, toast]);

  useEffect(() => {
    if (user && isAdmin()) {
      fetchUsers();
      fetchProducts();
      fetchDesigns();
      fetchPages();
    }
  }, [user, isAdmin]);

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

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('tshirt_templates')
        .select('*');
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des produits.",
      });
    }
  };

  const fetchDesigns = async () => {
    try {
      const { data, error } = await supabase
        .from('designs')
        .select('*');
      
      if (error) throw error;
      setDesigns(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des designs:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des designs.",
      });
    }
  };

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      // Fetch pages from the database
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('title', { ascending: true });
      
      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des pages:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des pages.",
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

  const selectPageForEditing = (page: any) => {
    setSelectedPage(page);
    setPageTitle(page.title);
    setPageContent(page.content);
    setEditingPage(true);
  };

  const createNewPage = () => {
    setSelectedPage(null);
    setPageTitle("");
    setPageContent("");
    setEditingPage(true);
  };

  const savePage = async () => {
    try {
      if (selectedPage) {
        // Update existing page
        const { error } = await supabase
          .from('pages')
          .update({ 
            title: pageTitle,
            content: pageContent,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedPage.id);

        if (error) throw error;

        toast({
          title: "Page mise à jour",
          description: "La page a été mise à jour avec succès.",
        });
      } else {
        // Create new page
        const { error } = await supabase
          .from('pages')
          .insert({ 
            title: pageTitle,
            content: pageContent,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;

        toast({
          title: "Page créée",
          description: "La nouvelle page a été créée avec succès.",
        });
      }

      // Refresh pages list and exit editing mode
      fetchPages();
      setEditingPage(false);
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement de la page:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement de la page.",
      });
    }
  };

  const deletePage = async (pageId: string) => {
    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', pageId);
      
      if (error) throw error;

      toast({
        title: "Page supprimée",
        description: "La page a été supprimée avec succès.",
      });

      // Refresh pages list
      fetchPages();
    } catch (error: any) {
      console.error("Erreur lors de la suppression de la page:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression de la page.",
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.user_metadata.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || !isAdmin()) {
    return null; // Ne rien rendre pendant la redirection
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12"
      >
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-600 mt-2">Gérez tous les aspects de la plateforme Podsleek</p>
        </header>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="designs">Designs</TabsTrigger>
            <TabsTrigger value="pages">Pages du Site</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
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
          </TabsContent>
          
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Produits</CardTitle>
                <CardDescription>Administrez tous les produits disponibles sur la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Imprimeur</TableHead>
                        <TableHead>Prix de base</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                            Aucun produit disponible
                          </TableCell>
                        </TableRow>
                      ) : (
                        products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.printer_id || 'Non assigné'}</TableCell>
                            <TableCell>{product.base_price} €</TableCell>
                            <TableCell>{product.stock_quantity}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700">
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
          </TabsContent>
          
          <TabsContent value="designs">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Designs</CardTitle>
                <CardDescription>Administrez tous les designs créés sur la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Créateur</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {designs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                            Aucun design disponible
                          </TableCell>
                        </TableRow>
                      ) : (
                        designs.map((design) => (
                          <TableRow key={design.id}>
                            <TableCell className="font-medium">{design.name}</TableCell>
                            <TableCell>{design.creator_id || 'Non assigné'}</TableCell>
                            <TableCell>{design.price} €</TableCell>
                            <TableCell>
                              <Badge variant={design.is_published ? "success" : "secondary"}>
                                {design.is_published ? 'Publié' : 'Brouillon'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700">
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
          </TabsContent>
          
          <TabsContent value="pages">
            {editingPage ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{selectedPage ? "Modifier la Page" : "Nouvelle Page"}</CardTitle>
                      <CardDescription>
                        {selectedPage ? "Modifier le contenu de cette page" : "Créer une nouvelle page"}
                      </CardDescription>
                    </div>
                    <div className="space-x-2">
                      <Button onClick={() => setEditingPage(false)} variant="outline">
                        Annuler
                      </Button>
                      <Button onClick={savePage} className="bg-[#33C3F0] hover:bg-[#0FA0CE] text-white">
                        <Save className="h-4 w-4 mr-2" />
                        Enregistrer
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Input
                      placeholder="Titre de la page"
                      value={pageTitle}
                      onChange={(e) => setPageTitle(e.target.value)}
                      className="mb-4"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <PageEditor content={pageContent} setContent={setPageContent} />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between md:items-center">
                    <div>
                      <CardTitle>Gestion des Pages</CardTitle>
                      <CardDescription>Modifiez ou créez des pages pour votre site</CardDescription>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Button 
                        onClick={createNewPage}
                        className="bg-[#33C3F0] hover:bg-[#0FA0CE] text-white"
                      >
                        Nouvelle Page
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Titre</TableHead>
                          <TableHead>Dernière mise à jour</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-10">
                              <RefreshCw className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                            </TableCell>
                          </TableRow>
                        ) : pages.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-10 text-gray-500">
                              Aucune page trouvée. Créez votre première page !
                            </TableCell>
                          </TableRow>
                        ) : (
                          pages.map((page) => (
                            <TableRow key={page.id}>
                              <TableCell className="font-medium">{page.title}</TableCell>
                              <TableCell>
                                {new Date(page.updated_at).toLocaleDateString()} {new Date(page.updated_at).toLocaleTimeString()}
                              </TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  onClick={() => selectPageForEditing(page)}
                                  title="Modifier"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => deletePage(page.id)}
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
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du Site</CardTitle>
                <CardDescription>Configurez les paramètres généraux de la plateforme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Informations du Site</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Nom du site</label>
                      <Input defaultValue="Podsleek" />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Description</label>
                      <Input defaultValue="Plateforme de création et d'impression à la demande" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Configurations Avancées</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Commission par vente (%)</label>
                      <Input type="number" defaultValue="10" min="0" max="100" />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Délai de traitement maximum (jours)</label>
                      <Input type="number" defaultValue="5" min="1" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button className="bg-[#33C3F0] hover:bg-[#0FA0CE] text-white">
                    Enregistrer les modifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
      <Footer />
    </div>
  );
};

export default Admin;
