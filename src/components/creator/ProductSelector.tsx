
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { PrintProduct, mapPrintProductWithCompatibility } from '@/types/customProduct';

interface ProductSelectorProps {
  onProductSelect: (product: PrintProduct | null) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ onProductSelect }) => {
  const [products, setProducts] = useState<PrintProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<PrintProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      
      const { data: productsData, error: productsError } = await supabase
        .from('print_products')
        .select(`
          *,
          product_templates (
            id,
            name_fr,
            name_en,
            name_ty,
            technical_instructions_fr,
            technical_instructions_en,
            technical_instructions_ty,
            type,
            design_area,
            mockup_area,
            mockup_image_url,
            svg_file_url,
            available_positions,
            available_colors,
            is_active,
            created_by,
            created_at,
            updated_at
          )
        `)
        .eq('is_active', true);

      if (productsError) throw productsError;

      // Mapper avec compatibilité pour les produits et leurs templates
      const mappedProducts = (productsData || []).map((product: any) => {
        const mappedProduct = mapPrintProductWithCompatibility(product);
        if (product.product_templates) {
          mappedProduct.product_templates = {
            ...product.product_templates,
            name: product.product_templates.name_fr ?? product.product_templates.name ?? '',
            technical_instructions: product.product_templates.technical_instructions_fr ?? product.product_templates.technical_instructions ?? ''
          };
        }
        return mappedProduct;
      });

      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
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
    console.log('🎯 Bouton "Sélectionner" cliqué - ProductSelector');
    console.log('📦 Produit sélectionné:', product.name);
    
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
          <p className="text-muted-foreground">
            Aucun produit d'impression n'est actuellement disponible pour la personnalisation.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sélectionner un produit</CardTitle>
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
              onClick={() => console.log('🎯 Div produit cliquée:', product.name)}
            >
              {product.images?.[0] && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}
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
              <Button 
                size="sm" 
                className="w-full"
                variant={selectedProduct?.id === product.id ? "default" : "outline"}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('🎯 Event onClick bouton déclenché pour:', product.name);
                  handleProductSelect(product);
                }}
              >
                {selectedProduct?.id === product.id ? 'Sélectionné' : 'Sélectionner'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSelector;
