import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash, RefreshCw, Save } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import PageEditor from "@/components/PageEditor";
import { PageData } from "@/types/pages";

const PagesManagement = () => {
  const { toast } = useToast();
  const [pages, setPages] = useState<PageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState<PageData | null>(null);
  const [pageContent, setPageContent] = useState<string>("");
  const [pageTitle, setPageTitle] = useState<string>("");
  const [editingPage, setEditingPage] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*') as { data: PageData[] | null; error: any };
      
      if (error) {
        console.error("Error fetching pages:", error);
        throw error;
      }
      
      setPages(data || []);
    } catch (error: any) {
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

  const selectPageForEditing = (page: PageData) => {
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

  if (editingPage) {
    return (
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
    );
  }

  return (
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
  );
};

export default PagesManagement;
