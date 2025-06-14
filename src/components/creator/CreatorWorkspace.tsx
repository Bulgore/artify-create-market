
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Plus, BarChart3, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CustomProductCreator from './CustomProductCreator';
import { SimplifiedProductCreation } from './SimplifiedProductCreation';
import { useCustomProductCreator } from '@/hooks/useCustomProductCreator';
import DesignList from './DesignList';
import SalesPanel from './SalesPanel';

const CreatorWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [showProductCreation, setShowProductCreation] = useState(false);
  const { printProducts, handleProductCreate } = useCustomProductCreator();

  const handleCreateProduct = () => {
    console.log('🎯 Bouton "Créer un produit" cliqué - CreatorWorkspace');
    setShowProductCreation(true);
  };

  const handleProductCreated = async (productData: any) => {
    console.log('🚀 Tentative de création de produit depuis CreatorWorkspace:', productData);
    
    const success = await handleProductCreate(productData);
    
    if (success) {
      console.log('✅ Produit créé avec succès depuis CreatorWorkspace');
      setShowProductCreation(false);
    } else {
      console.log('❌ Échec de la création du produit depuis CreatorWorkspace');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mon Espace Créateur</h1>
        <Button onClick={handleCreateProduct} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Créer un produit
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Mes produits
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Créer
          </TabsTrigger>
          <TabsTrigger value="designs" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Mes designs
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
                Mes produits créés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Gérez vos produits personnalisés et suivez leurs performances.
              </p>
              <Button onClick={handleCreateProduct}>
                Créer mon premier produit
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Créateur de produits avancé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomProductCreator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="designs" className="space-y-6">
          <DesignList />
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <SalesPanel />
        </TabsContent>
      </Tabs>

      {/* Modal de création de produit simplifié */}
      <Dialog open={showProductCreation} onOpenChange={setShowProductCreation}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Créer un nouveau produit</DialogTitle>
          </DialogHeader>
          <SimplifiedProductCreation
            printProducts={printProducts}
            onProductCreate={handleProductCreated}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatorWorkspace;
