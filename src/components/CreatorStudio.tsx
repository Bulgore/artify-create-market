
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TemplateType {
  id: string;
  name: string;
  images: string[];
  base_price: number;
}

const CreatorStudio: React.FC = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch available templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tshirt_templates')
        .select('id, name, images, base_price');
      
      if (error) throw error;
      
      setTemplates(data || []);
      // Auto-select the first template if available
      if (data && data.length > 0 && !selectedTemplate) {
        setSelectedTemplate(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les modèles disponibles."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Here we would implement the logic to upload the design to Supabase
    toast({
      title: "Design sauvegardé",
      description: "Votre design a été sauvegardé avec succès."
    });
  };

  const selectedTemplateData = selectedTemplate ? 
    templates.find(t => t.id === selectedTemplate) : null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Mon Studio de Création</h1>
      
      <Tabs defaultValue="newDesign" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="newDesign">Nouveau Design</TabsTrigger>
          <TabsTrigger value="myDesigns">Mes Designs</TabsTrigger>
          <TabsTrigger value="sales">Mes Ventes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="newDesign">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Créer un nouveau design</CardTitle>
                <CardDescription>
                  Téléchargez votre œuvre pour la placer sur des produits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="designName">Nom du design</Label>
                    <Input id="designName" placeholder="Mon super design" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="designDescription">Description</Label>
                    <Textarea 
                      id="designDescription" 
                      placeholder="Décrivez votre design et son inspiration" 
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="productTemplate">Produit à personnaliser</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {isLoading ? (
                        <p>Chargement des produits...</p>
                      ) : templates.length > 0 ? (
                        templates.map(template => (
                          <div 
                            key={template.id}
                            className={`border rounded-md p-2 cursor-pointer transition-all ${
                              selectedTemplate === template.id ? 
                              'border-[#33C3F0] bg-blue-50' : 
                              'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <img 
                              src={template.images[0] || "/placeholder.svg"} 
                              alt={template.name} 
                              className="w-full h-24 object-contain mb-2"
                            />
                            <p className="text-sm font-medium truncate">{template.name}</p>
                            <p className="text-xs text-gray-500">{template.base_price} €</p>
                          </div>
                        ))
                      ) : (
                        <p className="col-span-3 text-center py-4 text-gray-500">
                          Aucun produit disponible pour le moment.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="designFile">Image du design</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                      <Input 
                        id="designFile" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                      {previewUrl ? (
                        <div className="space-y-4 w-full">
                          <img 
                            src={previewUrl} 
                            alt="Aperçu" 
                            className="max-h-64 mx-auto object-contain" 
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setSelectedFile(null);
                              setPreviewUrl(null);
                            }}
                            className="w-full"
                          >
                            Changer d'image
                          </Button>
                        </div>
                      ) : (
                        <Label 
                          htmlFor="designFile" 
                          className="cursor-pointer w-full flex flex-col items-center space-y-2"
                        >
                          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#33C3F0]">
                              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                              <line x1="16" x2="22" y1="5" y2="5"></line>
                              <line x1="19" x2="19" y1="2" y2="8"></line>
                              <circle cx="9" cy="9" r="2"></circle>
                              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                            </svg>
                          </div>
                          <span className="text-center font-medium">
                            Cliquez pour sélectionner une image
                          </span>
                          <span className="text-center text-sm text-gray-500">
                            PNG, JPG jusqu'à 5MB
                          </span>
                        </Label>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="designPrice">Prix du design (€)</Label>
                    <Input id="designPrice" type="number" min="0" step="0.01" placeholder="9.99" />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-[#33C3F0] hover:bg-[#0FA0CE] w-full"
                    disabled={!selectedFile || !selectedTemplate}
                  >
                    Télécharger et créer
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Prévisualisation</CardTitle>
                <CardDescription>
                  Voici comment votre design apparaîtra sur le produit sélectionné
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                {previewUrl && selectedTemplateData ? (
                  <div className="space-y-6">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2 text-center">{selectedTemplateData.name}</h3>
                      <div className="relative h-64 w-64 mx-auto">
                        <img 
                          src={selectedTemplateData.images[0] || "/placeholder.svg"} 
                          alt="Produit" 
                          className="w-full h-full object-contain" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img 
                            src={previewUrl} 
                            alt="Design" 
                            className="max-w-[80%] max-h-[80%] object-contain" 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      Voir plus de produits
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <p>{!previewUrl ? "Téléchargez un design pour voir la prévisualisation" : "Sélectionnez un produit pour voir la prévisualisation"}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="myDesigns">
          <Card>
            <CardHeader>
              <CardTitle>Mes Designs</CardTitle>
              <CardDescription>
                Tous vos designs téléchargés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <p>Vous n'avez pas encore téléchargé de designs.</p>
                <Button 
                  className="mt-4 bg-[#33C3F0] hover:bg-[#0FA0CE]"
                  onClick={() => document.querySelector('[data-value="newDesign"]')?.dispatchEvent(new MouseEvent('click'))}
                >
                  Créer mon premier design
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Mes Ventes</CardTitle>
              <CardDescription>
                Historique et statistiques de vos ventes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <p>Vous n'avez pas encore de ventes.</p>
                <p className="mt-2">Commencez par télécharger vos designs et les rendre publics.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorStudio;
