
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PrintProduct, mapPrintProductWithCompatibility } from '@/types/customProduct';
import { buildImageUrl } from '@/utils/imageUrl';
import { ShoppingBag, AlertCircle } from 'lucide-react';

interface ProductSelectorProps {
  onProductSelect: (product: PrintProduct | null) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ onProductSelect }) => {
  const [products, setProducts] = useState<PrintProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<PrintProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 ProductSelector - Fetching products...');

      // Requête spécifique pour éviter les relations ambiguës
      const { data: productsData, error: productsError } = await supabase
        .from('print_products')
        .select(`
          *,
          product_templates!print_products_template_id_fkey (
            id,
            name_fr,
            name_en,
            name_ty,
            technical_instructions_fr,
            technical_instructions_en,
            technical_instructions_ty,
            type,
            primary_mockup_id,
            available_positions,
            available_colors,
            is_active,
            created_by,
            created_at,
            updated_at
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('❌ Error fetching products:', productsError);
        throw productsError;
      }

      // Récupérer les mockups séparément pour chaque template
      const productsWithMockups = await Promise.all(
        (productsData || []).map(async (product: any) => {
          const mapped = mapPrintProductWithCompatibility(product);
          
          if (product.product_templates?.id) {
            // Récupérer les mockups pour ce template
            const { data: mockupsData } = await supabase
              .from('product_mockups')
              .select('*')
              .eq('product_template_id', product.product_templates.id)
              .order('display_order', { ascending: true });

            if (mockupsData) {
              mapped.product_templates = {
                ...mapped.product_templates!,
                product_mockups: mockupsData.map((m: any) => ({
                  ...m,
                  mockup_url: buildImageUrl(m.mockup_url),
                  url: buildImageUrl(m.mockup_url)
                }))
              };
            }
          }
          
          return mapped;
        })
      );

      console.log('✅ ProductSelector - Products loaded:', productsWithMockups.length);
      setProducts(productsWithMockups);
      
    } catch (error: any) {
      console.error('❌ ProductSelector - Error:', error);
      setError(error.message || 'Erreur lors du chargement des produits');
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les produits."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (product: PrintProduct) => {
    console.log('🎯 ProductSelector - Product selected:', product.name);
    setSelectedProduct(product);
    onProductSelect(product);
    
    toast({
      title: "Produit sélectionné",
      description: `${product.name} est prêt pour la personnalisation.`
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement des produits...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erreur de chargement</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={fetchProducts} className="mt-4">
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aucun produit disponible</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Aucun produit d'impression n'est actuellement disponible pour la personnalisation.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sélectionner un produit ({products.length} disponible{products.length > 1 ? 's' : ''})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedProduct?.id === product.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleProductSelect(product)}
            >
              {/* Image du produit */}
              <div className="aspect-square bg-gray-100 rounded mb-3">
                {product.images?.[0] ? (
                  <img
                    src={buildImageUrl(product.images[0])}
                    alt={product.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : product.product_templates?.product_mockups?.[0] ? (
                  <img
                    src={product.product_templates.product_mockups[0].mockup_url}
                    alt={product.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              <h3 className="font-medium mb-2">{product.name}</h3>
              
              {product.description && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {product.description}
                </p>
              )}
              
              <div className="flex justify-between items-center mb-3">
                <Badge variant="secondary">{product.base_price}€</Badge>
                <Badge variant="outline">{product.material}</Badge>
              </div>

              {product.product_templates && (
                <div className="text-xs text-muted-foreground mb-3">
                  Type: {product.product_templates.type}
                  {product.product_templates.available_positions && (
                    <span className="ml-2">
                      • {product.product_templates.available_positions.length} position(s)
                    </span>
                  )}
                </div>
              )}
              
              <Button 
                size="sm" 
                className="w-full"
                variant={selectedProduct?.id === product.id ? "default" : "outline"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleProductSelect(product);
                }}
              >
                {selectedProduct?.id === product.id ? 'Sélectionné ✓' : 'Sélectionner'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSelector;
