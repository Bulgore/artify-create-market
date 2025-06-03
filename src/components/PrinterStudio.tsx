
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import ProductsList from "@/components/printer/ProductsList";
import AddProductForm from "@/components/printer/AddProductForm";
import OrdersList from "@/components/printer/OrdersList";
import SalesPanel from "@/components/printer/SalesPanel";

interface ProductTemplate {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  material: string;
  stock_quantity: number;
  images: string[];
  available_sizes: string[];
  template_id: string | null;
}

interface SelectedTemplate {
  id: string;
  name: string;
  type: string;
  mockup_image_url: string;
  design_area: any;
  available_positions: string[];
  available_colors: string[];
  technical_instructions: string;
}

const PrinterStudio: React.FC = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<ProductTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: 0,
    material: "",
    stock_quantity: 0,
    template_id: null as string | null,
    selectedTemplate: null as SelectedTemplate | null,
    available_sizes: [] as string[]
  });

  // Fetch templates on component mount
  useEffect(() => {
    if (user) {
      fetchTemplates();
    }
  }, [user]);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tshirt_templates')
        .select('*')
        .eq('printer_id', user?.id);
      
      if (error) throw error;
      
      console.log("Printer's products loaded:", data?.length || 0, "products");
      setTemplates(data || []);
    } catch (error: any) {
      console.error("Error fetching templates:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger vos produits."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "base_price" || name === "stock_quantity" ? parseFloat(value) || 0 : value
    }));
  };

  const handleTemplateSelect = (templateId: string, template: SelectedTemplate) => {
    console.log("Template selected:", templateId, template);
    setFormData(prev => ({
      ...prev,
      template_id: templateId,
      selectedTemplate: template
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      available_sizes: prev.available_sizes.includes(size)
        ? prev.available_sizes.filter(s => s !== size)
        : [...prev.available_sizes, size]
    }));
  };

  const handleAddProduct = () => {
    setActiveTab("addProduct");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter un produit."
      });
      return;
    }
    
    if (!formData.template_id) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un gabarit de produit."
      });
      return;
    }

    if (formData.available_sizes.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner au moins une taille."
      });
      return;
    }

    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez saisir un nom pour le produit."
      });
      return;
    }

    if (formData.base_price <= 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le prix de base doit être supérieur à 0."
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const productData = {
        printer_id: user.id,
        template_id: formData.template_id,
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        base_price: formData.base_price,
        material: formData.material.trim(),
        stock_quantity: formData.stock_quantity,
        print_area: formData.selectedTemplate?.design_area || { width: 20, height: 30, unit: "cm" },
        images: [formData.selectedTemplate?.mockup_image_url || "/placeholder.svg"],
        available_sizes: formData.available_sizes
      };
      
      console.log("Submitting product data:", productData);
      
      const { data, error } = await supabase
        .from('tshirt_templates')
        .insert([productData])
        .select();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      
      console.log("Product created successfully:", data);
      
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté avec succès à votre catalogue."
      });
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        base_price: 0,
        material: "",
        stock_quantity: 0,
        template_id: null,
        selectedTemplate: null,
        available_sizes: []
      });
      
      // Refresh the templates list
      await fetchTemplates();
      
      // Switch to products tab
      setActiveTab("products");
      
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'ajout du produit."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Imprimeur</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="products">Mes Produits</TabsTrigger>
          <TabsTrigger value="addProduct">Ajouter un Produit</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="sales">Mes Ventes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Mes Produits</CardTitle>
              <CardDescription>
                Gérez les produits que vous proposez aux créateurs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductsList 
                isLoading={isLoading}
                templates={templates}
                onEditProduct={(id) => {
                  toast({
                    title: "Fonctionnalité à venir",
                    description: "La modification de produits sera bientôt disponible."
                  });
                }}
                onAddProduct={handleAddProduct}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="addProduct">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un nouveau produit</CardTitle>
              <CardDescription>
                Créez un nouveau produit basé sur un gabarit disponible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddProductForm
                formData={formData}
                isLoading={isLoading}
                onInputChange={handleInputChange}
                onTemplateSelect={handleTemplateSelect}
                onSizeToggle={handleSizeToggle}
                onSubmit={handleSubmit}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Commandes à imprimer</CardTitle>
              <CardDescription>
                Consultez et gérez les commandes à produire.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <SalesPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrinterStudio;
