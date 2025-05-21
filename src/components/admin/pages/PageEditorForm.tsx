
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageData } from "@/types/pages";
import PageEditor from "@/components/PageEditor";
import { ArrowLeft, Save } from "lucide-react";

interface PageEditorFormProps {
  selectedPage: PageData | null;
  pageTitle: string;
  pageContent: string;
  pageSlug?: string;
  setPageTitle: (title: string) => void;
  setPageContent: (content: string) => void;
  setPageSlug?: (slug: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const PageEditorForm: React.FC<PageEditorFormProps> = ({
  selectedPage,
  pageTitle,
  pageContent,
  pageSlug = '',
  setPageTitle,
  setPageContent,
  setPageSlug = () => {},
  onSave,
  onCancel
}) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setPageTitle(newTitle);
    
    // Mettre à jour automatiquement le slug si l'utilisateur n'a pas modifié le slug manuellement
    // ou si nous sommes en train de créer une nouvelle page
    if (!selectedPage || pageSlug === '') {
      setPageSlug(newTitle.toLowerCase().replace(/\s+/g, '-'));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{selectedPage ? "Modifier la page" : "Nouvelle page"}</CardTitle>
            <CardDescription>
              {selectedPage ? "Modifiez le contenu de la page" : "Créez une nouvelle page pour votre site"}
            </CardDescription>
          </div>
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="page-title">Titre de la page</Label>
          <Input 
            id="page-title"
            value={pageTitle} 
            onChange={handleTitleChange}
            placeholder="Entrez le titre de la page"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="page-slug">URL de la page (slug)</Label>
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">/page/</span>
            <Input 
              id="page-slug"
              value={pageSlug} 
              onChange={(e) => setPageSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="slug-de-la-page"
              className="flex-1"
            />
          </div>
          <p className="text-xs text-gray-500">L'URL sera accessible à /page/{pageSlug || 'votre-slug'}</p>
        </div>

        <div className="space-y-2">
          <Label>Contenu de la page</Label>
          <div className="min-h-[400px] border rounded-md">
            <PageEditor 
              initialContent={pageContent}
              onChange={setPageContent}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Annuler</Button>
        <Button onClick={onSave} className="bg-[#33C3F0] hover:bg-[#0FA0CE] text-white">
          <Save className="h-4 w-4 mr-2" />
          Enregistrer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PageEditorForm;
