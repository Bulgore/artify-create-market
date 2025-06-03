
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Package, ShoppingBag, BarChart3, Plus } from "lucide-react";
import CustomProductCreator from "./creator/CustomProductCreator";
import DesignList from "./creator/DesignList";
import SalesPanel from "./creator/SalesPanel";

const CreatorStudio: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'create-product'>('dashboard');

  const handleCreateProduct = () => {
    setActiveView('create-product');
  };

  const handleBackToDashboard = () => {
    setActiveView('dashboard');
  };

  if (activeView === 'create-product') {
    return <CustomProductCreator onBack={handleBackToDashboard} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Studio Créateur</h1>
        <Button onClick={handleCreateProduct} className="bg-[#33C3F0] hover:bg-[#0FA0CE]">
          <Plus className="h-4 w-4 mr-2" />
          Créer un produit personnalisé
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes créations</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 ce mois-ci
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits publiés</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              66% de vos créations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes ce mois</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124€</div>
            <p className="text-xs text-muted-foreground">
              +18% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="designs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="designs">Mes créations</TabsTrigger>
          <TabsTrigger value="products">Produits disponibles</TabsTrigger>
          <TabsTrigger value="sales">Ventes & Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="designs" className="space-y-6">
          <DesignList />
        </TabsContent>
        
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Produits disponibles pour personnalisation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Créez votre premier produit</h3>
                <p className="text-gray-500 mb-4">
                  Sélectionnez un produit d'imprimeur et ajoutez votre design personnalisé
                </p>
                <Button onClick={handleCreateProduct} className="bg-[#33C3F0] hover:bg-[#0FA0CE]">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un produit personnalisé
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-6">
          <SalesPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorStudio;
