
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

interface PrinterTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  templates: ProductTemplate[];
  isLoading: boolean;
  onRefreshTemplates: () => void;
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onTemplateSelect: (templateId: string, template: any) => void;
  onSizeToggle: (size: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const PrinterTabs: React.FC<PrinterTabsProps> = ({
  activeTab,
  setActiveTab,
  templates,
  isLoading,
  onRefreshTemplates,
  formData,
  onInputChange,
  onTemplateSelect,
  onSizeToggle,
  onSubmit
}) => {
  const handleAddProduct = () => {
    setActiveTab("addProduct");
  };

  return (
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
                // TODO: Implement edit functionality
                console.log("Edit product:", id);
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
              onInputChange={onInputChange}
              onTemplateSelect={onTemplateSelect}
              onSizeToggle={onSizeToggle}
              onSubmit={onSubmit}
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
  );
};

export default PrinterTabs;
