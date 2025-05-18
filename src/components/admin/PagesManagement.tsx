
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
      const { data, error } = await fetchAllPages();
      
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
        const { error } = await updatePage(selectedPage.id, pageTitle, pageContent);

        if (error) throw error;

        toast({
          title: "Page mise à jour",
          description: "La page a été mise à jour avec succès.",
        });
      } else {
        // Create new page
        const { error } = await createPage(pageTitle, pageContent);

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

  const handleDeletePage = async (pageId: string) => {
    try {
      const { error } = await deletePage(pageId);
      
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
      <PageEditorForm
        selectedPage={selectedPage}
        pageTitle={pageTitle}
        pageContent={pageContent}
        setPageTitle={setPageTitle}
        setPageContent={setPageContent}
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
        <PagesList 
          pages={pages} 
          isLoading={isLoading}
          onEdit={selectPageForEditing}
          onDelete={handleDeletePage}
        />
      </CardContent>
    </Card>
  );
};

export default PagesManagement;
