import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Design {
  id: string;
  name: string;
  description?: string;
  preview_url: string;
  is_published: boolean;
  creator_margin_percentage: number;
}

const CreatorWorkspace: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [showProductCreation, setShowProductCreation] = useState(false);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoadingDesigns, setIsLoadingDesigns] = useState(false);
  const { printProducts, handleProductCreate } = useCustomProductCreator();

  useEffect(() => {
    if (user && (activeTab === 'products' || activeTab === 'designs')) {
      loadDesigns();
    }
  }, [user, activeTab]);

  const loadDesigns = async () => {
    if (!user) return;
    
    setIsLoadingDesigns(true);
    try {
      const { data, error } = await supabase
        .from('creator_products')
        .select('id, name_fr, description_fr, preview_url, is_published, creator_margin_percentage')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mapper avec compatibilité
      const mappedDesigns = (data || []).map((design: any) => ({
        id: design.id,
        name: design.name_fr ?? design.name ?? '',
        description: design.description_fr ?? design.description ?? '',
        preview_url: design.preview_url,
        is_published: design.is_published ?? false,
        creator_margin_percentage: design.creator_margin_percentage ?? 20
      }));

      setDesigns(mappedDesigns);
    } catch (error) {
      console.error('Error loading designs:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger vos produits.'
      });
    } finally {
      setIsLoadingDesigns(false);
    }
  };

  const handleCreateProduct = () => {
    setShowProductCreation(true);
  };

  const handleProductCreated = async (productData: any) => {
    const success = await handleProductCreate(productData);
    if (success) {
      setShowProductCreation(false);
      // Refresh both product and design tabs if currently active
      if (activeTab === 'products' || activeTab === 'designs') {
        await loadDesigns();
      }
    }
  };

  const handleDesignUpdated = async () => {
    await loadDesigns();
  };

  const handleCreateDesign = () => {
    handleCreateProduct();
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

        {/* NEW: Mes produits = all creator_products by the user */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Mes produits en boutique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Voici tous les produits que vous vendez dans votre boutique. Ajoutez-en pour débloquer les fonctionnalités avancées.
              </p>
              {isLoadingDesigns ? (
                <div className="py-8 text-center">Chargement de vos produits...</div>
              ) : (
                <DesignList 
                  designs={designs}
                  onDesignUpdated={handleDesignUpdated}
                  onCreateDesign={handleCreateDesign}
                />
              )}
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

        {/* Optionally, keep "Mes designs" for assets/drafts/features */}
        <TabsContent value="designs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Mes designs (brouillons, ressources)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Cette vue peut être utilisée pour retrouver vos brouillons ou gérer vos actifs design.
              </p>
              {isLoadingDesigns ? (
                <div className="py-8 text-center">Chargement des designs...</div>
              ) : (
                <DesignList
                  designs={designs}
                  onDesignUpdated={handleDesignUpdated}
                  onCreateDesign={handleCreateDesign}
                />
              )}
            </CardContent>
          </Card>
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
