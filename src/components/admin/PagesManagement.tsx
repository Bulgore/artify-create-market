
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { PageData } from "@/types/pages";
import PagesList from "./pages/PagesList";
import PageEditorForm from "./pages/PageEditorForm";
import { fetchAllPages, createPage, updatePage, deletePage } from "@/services/pagesService";
import NavigationEditor from "./pages/NavigationEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, RefreshCw } from "lucide-react";

const PagesManagement = () => {
  const { toast } = useToast();
  const [pages, setPages] = useState<PageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState<PageData | null>(null);
  const [pageContent, setPageContent] = useState<string>("");
  const [pageTitle, setPageTitle] = useState<string>("");
  const [pageSlug, setPageSlug] = useState<string>("");
  const [editingPage, setEditingPage] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("pages");
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchPages();
  }, []);
  
  const fetchPages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Récupération des pages...");
      const { data, error } = await fetchAllPages();
      
      if (error) {
        console.error("Erreur lors de la récupération des pages:", error);
        setError("Erreur lors du chargement des pages");
        throw error;
      }
      
      console.log("Pages récupérées:", data);
      setPages(data || []);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des pages:", error);
      setError("Impossible de charger la liste des pages");
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
    setPageSlug(page.slug || '');
    setEditingPage(true);
  };

  const createNewPage = () => {
    setSelectedPage(null);
    setPageTitle("");
    setPageContent("");
    setPageSlug("");
    setEditingPage(true);
  };

  const savePage = async () => {
    try {
      if (!pageTitle) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Le titre de la page est obligatoire.",
        });
        return;
      }
      
      const slug = pageSlug || pageTitle.toLowerCase().replace(/\s+/g, '-');
      
      if (selectedPage) {
        // Mise à jour d'une page existante
        const { error } = await updatePage(
          selectedPage.id, 
          pageTitle, 
          pageContent,
          slug
        );

        if (error) throw error;

        toast({
          title: "Page mise à jour",
          description: "La page a été mise à jour avec succès.",
        });
      } else {
        // Création d'une nouvelle page
        const { error } = await createPage(pageTitle, pageContent, slug);

        if (error) throw error;

        toast({
          title: "Page créée",
          description: "La nouvelle page a été créée avec succès.",
        });
      }

      // Rafraîchir la liste des pages et quitter le mode d'édition
      await fetchPages();
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

  const handleDeletePage = async (pageId: string) => {
    try {
      const { error } = await deletePage(pageId);
      
      if (error) throw error;

      toast({
        title: "Page supprimée",
        description: "La page a été supprimée avec succès.",
      });

      // Rafraîchir la liste des pages
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
      <PageEditorForm
        selectedPage={selectedPage}
        pageTitle={pageTitle}
        pageContent={pageContent}
        pageSlug={pageSlug}
        setPageTitle={setPageTitle}
        setPageContent={setPageContent}
        setPageSlug={setPageSlug}
        onSave={savePage}
        onCancel={() => setEditingPage(false)}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <CardTitle>Gestion des Pages et Navigation</CardTitle>
            <CardDescription>Modifiez ou créez des pages pour votre site et configurez la navigation</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchPages}
            className="mt-2 md:mt-0"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pages" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button 
                onClick={createNewPage}
                className="bg-[#33C3F0] hover:bg-[#0FA0CE] text-white"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Nouvelle Page
              </Button>
            </div>
            
            {error ? (
              <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-600">
                {error}
                <Button variant="outline" size="sm" onClick={fetchPages} className="ml-4">
                  Réessayer
                </Button>
              </div>
            ) : (
              <PagesList 
                pages={pages} 
                isLoading={isLoading}
                onEdit={selectPageForEditing}
                onDelete={handleDeletePage}
              />
            )}
          </TabsContent>
          
          <TabsContent value="navigation">
            <NavigationEditor pages={pages} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PagesManagement;
