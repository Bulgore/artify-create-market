
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Plus, ShoppingCart, BarChart3 } from "lucide-react";
import ProductsList from "./ProductsList";
import AddProductForm from "./AddProductForm";
import OrdersList from "./OrdersList";
import SalesPanel from "./SalesPanel";

interface PrintProduct {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  material: string;
  stock_quantity: number;
  images: string[];
  available_sizes: string[];
  available_colors: string[];
  template_id: string | null;
  is_active: boolean;
}

interface FormData {
  name: string;
  description: string;
  base_price: number;
  material: string;
  stock_quantity: number;
  template_id: string | null;
  selectedTemplate: any | null;
  available_sizes: string[];
  available_colors: string[];
}

interface PrinterTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  printProducts: PrintProduct[];
  isLoading: boolean;
  onRefreshProducts: () => void;
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onTemplateSelect: (templateId: string, template: any) => void;
  onSizeToggle: (size: string) => void;
  onColorToggle: (color: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const PrinterTabs: React.FC<PrinterTabsProps> = ({
  activeTab,
  setActiveTab,
  printProducts,
  isLoading,
  onRefreshProducts,
  formData,
  onInputChange,
  onTemplateSelect,
  onSizeToggle,
  onColorToggle,
  onSubmit
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="products" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Mes produits
        </TabsTrigger>
        <TabsTrigger value="addProduct" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter produit
        </TabsTrigger>
        <TabsTrigger value="orders" className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Commandes
        </TabsTrigger>
        <TabsTrigger value="sales" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Ventes
        </TabsTrigger>
      </TabsList>

      <TabsContent value="products" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Mes produits d'impression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductsList 
              isLoading={isLoading} 
              printProducts={printProducts} 
              onRefreshProducts={onRefreshProducts}
              onAddProduct={() => setActiveTab("addProduct")}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="addProduct" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Ajouter un nouveau produit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AddProductForm
              formData={formData}
              onInputChange={onInputChange}
              onTemplateSelect={onTemplateSelect}
              onSizeToggle={onSizeToggle}
              onColorToggle={onColorToggle}
              onSubmit={onSubmit}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="orders" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Commandes reçues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersList />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sales" className="space-y-6">
        <SalesPanel />
      </TabsContent>
    </Tabs>
  );
};

export default PrinterTabs;
