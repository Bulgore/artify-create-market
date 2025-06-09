
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageData, NavigationItem } from "@/types/pages";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash, ArrowUp, ArrowDown, Link } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NavigationEditorProps {
  pages: PageData[];
}

// Services pour le stockage de la navigation
const saveNavigation = async (type: string, items: NavigationItem[]): Promise<boolean> => {
  try {
    localStorage.setItem(`navigation_${type}`, JSON.stringify(items));
    return true;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la navigation:", error);
    return false;
  }
};

const loadNavigation = (type: string): NavigationItem[] => {
  try {
    const saved = localStorage.getItem(`navigation_${type}`);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Erreur lors du chargement de la navigation:", error);
    return [];
  }
};

const NavigationEditor: React.FC<NavigationEditorProps> = ({ pages }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("header");
  const [headerNav, setHeaderNav] = useState<NavigationItem[]>([]);
  const [footerNav, setFooterNav] = useState<NavigationItem[]>([]);
  
  useEffect(() => {
    // Charger les configurations de navigation existantes
    const savedHeader = loadNavigation("header");
    const savedFooter = loadNavigation("footer");
    
    if (savedHeader.length > 0) {
      setHeaderNav(savedHeader);
    }
    
    if (savedFooter.length > 0) {
      setFooterNav(savedFooter);
    }
    
    // Log pour debug
    console.log("Pages disponibles:", pages);
  }, [pages]);

  const handleSaveNavigation = async () => {
    try {
      if (activeTab === "header") {
        await saveNavigation("header", headerNav);
      } else {
        await saveNavigation("footer", footerNav);
      }
      
      toast({
        title: "Navigation enregistrée",
        description: "La configuration de navigation a été mise à jour avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la navigation.",
      });
    }
  };

  const addNavItem = (type: string) => {
    const newItem: NavigationItem = {
      title: "Nouveau lien",
      url: "/",
      isExternal: false
    };
    
    if (type === "header") {
      setHeaderNav([...headerNav, newItem]);
    } else {
      setFooterNav([...footerNav, newItem]);
    }
  };

  const updateNavItem = (type: string, index: number, field: keyof NavigationItem, value: string | boolean) => {
    if (type === "header") {
      const updatedNav = [...headerNav];
      updatedNav[index] = { ...updatedNav[index], [field]: value };
      setHeaderNav(updatedNav);
    } else {
      const updatedNav = [...footerNav];
      updatedNav[index] = { ...updatedNav[index], [field]: value };
      setFooterNav(updatedNav);
    }
  };

  const removeNavItem = (type: string, index: number) => {
    if (type === "header") {
      const updatedNav = [...headerNav];
      updatedNav.splice(index, 1);
      setHeaderNav(updatedNav);
    } else {
      const updatedNav = [...footerNav];
      updatedNav.splice(index, 1);
      setFooterNav(updatedNav);
    }
  };

  const moveNavItem = (type: string, index: number, direction: "up" | "down") => {
    const navItems = type === "header" ? [...headerNav] : [...footerNav];
    
    if (direction === "up" && index > 0) {
      const temp = navItems[index - 1];
      navItems[index - 1] = navItems[index];
      navItems[index] = temp;
    } else if (direction === "down" && index < navItems.length - 1) {
      const temp = navItems[index + 1];
      navItems[index + 1] = navItems[index];
      navItems[index] = temp;
    }
    
    if (type === "header") {
      setHeaderNav(navItems);
    } else {
      setFooterNav(navItems);
    }
  };

  const renderNavItemEditor = (type: string, items: NavigationItem[]) => {
    return items.map((item, index) => (
      <Card key={index} className="mb-4">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Lien #{index + 1}</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => moveNavItem(type, index, "up")}
                disabled={index === 0}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => moveNavItem(type, index, "down")}
                disabled={index === items.length - 1}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-red-500 hover:text-red-700"
                onClick={() => removeNavItem(type, index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor={`title-${index}`}>Titre</Label>
              <Input
                id={`title-${index}`}
                value={item.title}
                onChange={(e) => updateNavItem(type, index, "title", e.target.value)}
                placeholder="Titre du lien"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor={`url-type-${index}`}>Type de lien</Label>
              <Select
                value={item.isExternal ? "external" : "page"}
                onValueChange={(value) => {
                  updateNavItem(type, index, "isExternal", value === "external");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de lien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="page">Page du site</SelectItem>
                  <SelectItem value="external">URL externe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {item.isExternal ? (
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor={`url-${index}`}>URL externe</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id={`url-${index}`}
                    value={item.url}
                    onChange={(e) => updateNavItem(type, index, "url", e.target.value)}
                    placeholder="https://exemple.com"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    title="Tester le lien"
                    onClick={() => window.open(item.url, "_blank")}
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor={`page-${index}`}>Page</Label>
                <Select
                  value={item.url}
                  onValueChange={(value) => updateNavItem(type, index, "url", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="/">Accueil</SelectItem>
                    <SelectItem value="/products">Produits</SelectItem>
                    <SelectItem value="/artists">Créateurs</SelectItem>
                    <SelectItem value="/printers">Imprimeurs</SelectItem>
                    {pages.map((page) => (
                      <SelectItem key={page.id} value={`/page/${page.slug || page.id}`}>
                        {page.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="header">Menu principal</TabsTrigger>
          <TabsTrigger value="footer">Menu du pied de page</TabsTrigger>
        </TabsList>
        
        <TabsContent value="header" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Configuration du menu principal</h3>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => addNavItem("header")}
                className="bg-[#33C3F0] hover:bg-[#0FA0CE] text-white"
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter un lien
              </Button>
              <Button onClick={handleSaveNavigation}>Enregistrer</Button>
            </div>
          </div>
          
          {headerNav.length === 0 ? (
            <Card className="p-6 text-center text-gray-500">
              Aucun lien dans le menu principal. Cliquez sur "Ajouter un lien" pour commencer.
            </Card>
          ) : (
            renderNavItemEditor("header", headerNav)
          )}
        </TabsContent>
        
        <TabsContent value="footer" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Configuration du menu de pied de page</h3>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => addNavItem("footer")}
                className="bg-[#33C3F0] hover:bg-[#0FA0CE] text-white"
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter un lien
              </Button>
              <Button onClick={handleSaveNavigation}>Enregistrer</Button>
            </div>
          </div>
          
          {footerNav.length === 0 ? (
            <Card className="p-6 text-center text-gray-500">
              Aucun lien dans le menu de pied de page. Cliquez sur "Ajouter un lien" pour commencer.
            </Card>
          ) : (
            renderNavItemEditor("footer", footerNav)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NavigationEditor;
