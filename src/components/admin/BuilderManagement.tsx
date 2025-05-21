
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
import { useAuth } from "@/contexts/AuthContext";
import { ExternalLink } from "lucide-react";

const BuilderManagement = () => {
  const { user } = useAuth();
  const builderUrl = "https://builder.io";
  const editorUrl = "https://builder.io/content";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Builder.io CMS</CardTitle>
        <CardDescription>
          Gérez votre contenu avec l'éditeur visuel Builder.io
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-md">
            <h3 className="font-medium text-blue-700 mb-2">Comment ça marche</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-blue-600">
              <li>Builder.io vous permet de créer et modifier votre contenu avec un éditeur visuel</li>
              <li>Créez des pages, des sections ou des composants visuellement</li>
              <li>Publiez vos modifications en temps réel</li>
              <li>Utilisez des animations, popups, sliders et bien plus</li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Commencer avec Builder.io</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>Inscrivez-vous sur <a href={builderUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Builder.io</a></li>
              <li>Créez un nouveau projet</li>
              <li>Obtenez votre clé API et remplacez-la dans le fichier src/integrations/builder-io/config.ts</li>
              <li>Créez un nouveau modèle "page" et "homepage" dans Builder.io</li>
              <li>Commencez à construire votre contenu</li>
            </ol>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        <Button 
          onClick={() => window.open(builderUrl, '_blank')}
          variant="outline"
        >
          Créer un compte
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
        <Button 
          onClick={() => window.open(editorUrl, '_blank')}
          className="bg-[#33C3F0] hover:bg-[#0FA0CE] text-white"
        >
          Ouvrir l'éditeur
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BuilderManagement;
