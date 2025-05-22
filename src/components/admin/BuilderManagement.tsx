
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BUILDER_API_KEY } from "@/integrations/builder-io/config";
import { ExternalLink, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BuilderManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState<string>(BUILDER_API_KEY);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const builderDashboardUrl = "https://builder.io/content";

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Dans un cas réel, vous enregistreriez cela dans une base de données ou des variables d'environnement
    setTimeout(() => {
      toast({
        title: "Paramètres enregistrés",
        description: "Les paramètres de Builder.io ont été mis à jour. Un redémarrage peut être nécessaire."
      });
      setIsSaving(false);
    }, 1000);
  };

  const openBuilderEditor = (page: string) => {
    const url = `${builderDashboardUrl}/edit/${page}`;
    window.open(url, '_blank');
  };

  const previewPage = (path: string) => {
    navigate(path);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Integration Builder.io</CardTitle>
        <CardDescription>
          Gérez et personnalisez vos pages avec l'éditeur visuel Builder.io
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="pages" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pages">Pages & Édition</TabsTrigger>
            <TabsTrigger value="settings">Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pages" className="space-y-6">
            <div className="text-sm text-blue-600 pb-4 bg-blue-50 p-4 rounded-lg">
              <p className="mb-2 font-medium">Éditer vos pages visuellement avec Builder.io</p>
              <p>
                Vous pouvez utiliser Builder.io pour créer et éditer les pages principales de votre site
                avec une interface visuelle de type "glisser-déposer".
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Page d'accueil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500">
                  Personnalisez l'apparence de votre page d'accueil avec des images, du texte et des sections personnalisées.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={() => openBuilderEditor('homepage')}
                    className="flex items-center gap-2"
                  >
                    Éditer la page d'accueil
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => previewPage('/')}
                  >
                    Prévisualiser
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Page À propos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500">
                  Présentez votre entreprise, votre équipe et votre mission.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={() => openBuilderEditor('about')}
                    className="flex items-center gap-2"
                  >
                    Éditer la page À propos
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => previewPage('/builder-page/about')}
                  >
                    Prévisualiser
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Page FAQ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500">
                  Répondez aux questions fréquemment posées par vos clients.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={() => openBuilderEditor('faq')}
                    className="flex items-center gap-2"
                  >
                    Éditer la page FAQ
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => previewPage('/builder-page/faq')}
                  >
                    Prévisualiser
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuration de Builder.io</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">Clé API Builder.io</Label>
                  <Input
                    id="api-key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Entrez votre clé API Builder.io"
                  />
                  <p className="text-xs text-gray-500">
                    Vous pouvez trouver votre clé API dans les paramètres de votre compte Builder.io.
                    <a 
                      href="https://builder.io/account/space" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 ml-1 hover:underline"
                    >
                      Ouvrir les paramètres Builder.io
                    </a>
                  </p>
                </div>
                
                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="mt-4"
                >
                  {isSaving && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                  Enregistrer les paramètres
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md text-yellow-800 text-sm">
          <p className="font-medium mb-1">Important</p>
          <p>Pour que Builder.io fonctionne correctement, vous devez :</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Créer un compte sur <a href="https://builder.io" target="_blank" rel="noopener noreferrer" className="underline">Builder.io</a></li>
            <li>Ajouter votre clé API dans la section Configuration</li>
            <li>Créer des modèles correspondant aux pages que vous souhaitez éditer</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default BuilderManagement;
