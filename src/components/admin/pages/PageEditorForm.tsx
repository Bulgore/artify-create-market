
import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import PageEditor from "@/components/PageEditor";
import { PageData } from "@/types/pages";

interface PageEditorFormProps {
  selectedPage: PageData | null;
  pageTitle: string;
  pageContent: string;
  setPageTitle: (title: string) => void;
  setPageContent: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const PageEditorForm: React.FC<PageEditorFormProps> = ({
  selectedPage,
  pageTitle,
  pageContent,
  setPageTitle,
  setPageContent,
  onSave,
  onCancel,
}) => {
  const [pageSlug, setPageSlug] = useState<string>(selectedPage?.slug || '');
  
  useEffect(() => {
    if (selectedPage?.slug) {
      setPageSlug(selectedPage.slug);
    }
  }, [selectedPage]);
  
  // Générer un slug automatique basé sur le titre
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageTitle(e.target.value);
    if (!selectedPage || !pageSlug) {
      setPageSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
    }
  };

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
            <Button onClick={onCancel} variant="outline">
              Annuler
            </Button>
            <Button onClick={onSave} className="bg-[#33C3F0] hover:bg-[#0FA0CE] text-white">
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="page-title" className="text-sm font-medium">
              Titre de la page
            </label>
            <Input
              id="page-title"
              placeholder="Titre de la page"
              value={pageTitle}
              onChange={handleTitleChange}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="page-slug" className="text-sm font-medium">
              URL de la page
            </label>
            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-500 mr-1">/page/</span>
              <Input
                id="page-slug"
                placeholder="url-de-la-page"
                value={pageSlug}
                onChange={(e) => setPageSlug(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Cette URL sera utilisée pour accéder à la page: /page/{pageSlug || 'nom-de-la-page'}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <PageEditor content={pageContent} setContent={setPageContent} />
      </CardContent>
    </Card>
  );
};

export default PageEditorForm;
