
import React from "react";
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
};

export default PageEditorForm;
