
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Package, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SimplifiedProductCreation } from '@/components/creator/SimplifiedProductCreation';
import { useCustomProductCreator } from '@/hooks/useCustomProductCreator';

interface Product {
  id: string;
  name: string;
  description: string | null;
  preview_url: string | null;
  status: string;
  created_at: string;
}

interface ProductsStepProps {
  onComplete: () => void;
}

const ProductsStep: React.FC<ProductsStepProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProductCreation, setShowProductCreation] = useState(false);
  
  // Utiliser le hook de création de produit
  const { printProducts, handleProductCreate } = useCustomProductCreator();

  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [user]);

  useEffect(() => {
    // Marquer l'étape comme complétée si 3+ produits
    if (products.length >= 3) {
      onComplete();
    }
  }, [products.length, onComplete]);

  const loadProducts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('creator_products')
        .select('id, name_fr, description_fr, preview_url, status, created_at')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mapper avec compatibilité
      const mappedProducts = (data || []).map((product: any) => ({
        ...product,
        name: product.name_fr ?? product.name ?? '',
        description: product.description_fr ?? product.description ?? null,
        id: product.id,
        preview_url: product.preview_url,
        status: product.status || 'draft',
        created_at: product.created_at
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error('❌ Error loading products:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger vos produits. Veuillez réessayer ou contacter le support.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = () => {
    console.log('🎯 Bouton "Créer un produit" cliqué - ProductsStep');
    setShowProductCreation(true);
  };

  const handleProductCreated = async (productData: any) => {
    console.log('🚀 Tentative de création de produit:', productData);
    
    const success = await handleProductCreate(productData);
    
    if (success) {
      console.log('✅ Produit créé avec succès');
      setShowProductCreation(false);
      // Recharger les produits
      await loadProducts();
      
      toast({
        title: 'Produit créé',
        description: 'Votre produit a été créé avec succès!'
      });
    } else {
      console.log('❌ Échec de la création du produit');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Publié</Badge>;
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const progress = Math.min((products.length / 3) * 100, 100);
  const isComplete = products.length >= 3;

  if (isLoading) {
    return <div className="text-center py-8">Chargement de vos produits...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Vos produits créés ({products.length}/3 minimum)
          </CardTitle>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              {isComplete ? (
                <span className="text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Objectif atteint ! Vous pouvez créer plus de produits si vous le souhaitez.
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  Il vous faut encore {3 - products.length} produit(s) pour soumettre votre profil.
                </span>
              )}
            </p>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Conseils pour créer des produits de qualité :</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Choisissez des designs originaux et de haute qualité</li>
            <li>Rédigez des descriptions détaillées et attrayantes</li>
            <li>Utilisez des mots-clés pertinents pour le SEO</li>
            <li>Vérifiez que vos mockups sont bien positionnés</li>
            <li>Testez différentes catégories de produits</li>
          </ul>
        </CardContent>
      </Card>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {product.preview_url && (
                    <img
                      src={product.preview_url}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  )}
                  <div>
                    <h4 className="font-medium line-clamp-1">{product.name}</h4>
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    {getStatusBadge(product.status)}
                    <span className="text-xs text-muted-foreground">
                      {new Date(product.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun produit créé</h3>
            <p className="text-muted-foreground mb-4">
              Commencez par créer votre premier produit personnalisé.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="text-center space-y-4">
        <Button
          onClick={handleCreateProduct}
          size="lg"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {products.length === 0 ? 'Créer mon premier produit' : 'Créer un nouveau produit'}
        </Button>
        <p className="text-sm text-muted-foreground">
          Une interface simple pour créer vos produits personnalisés
        </p>
        
        <Button
          onClick={loadProducts}
          variant="outline"
          size="sm"
        >
          Rafraîchir la liste
        </Button>
      </div>

      {isComplete && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800 mb-1">
              Félicitations !
            </h3>
            <p className="text-green-700 text-sm">
              Vous avez créé {products.length} produits. Vous pouvez maintenant passer à l'étape suivante.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal de création de produit */}
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

export default ProductsStep;
