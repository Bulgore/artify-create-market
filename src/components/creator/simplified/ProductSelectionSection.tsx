
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import type { PrintProduct } from '@/types/customProduct';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { buildImageUrl } from '@/utils/imageUrl';

interface ProductSelectionSectionProps {
  printProducts: PrintProduct[];
  onProductSelect: (product: PrintProduct) => void;
}

export const ProductSelectionSection: React.FC<ProductSelectionSectionProps> = ({
  printProducts,
  onProductSelect
}) => {
  console.log('🎯 ProductSelectionSection:', {
    productsCount: printProducts.length,
    products: printProducts.map(p => ({ id: p.id, name: p.name, hasTemplates: !!p.product_templates }))
  });

  if (printProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aucun produit disponible</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Les produits d'impression ne sont pas encore configurés.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sélectionner un produit à personnaliser</CardTitle>
        <p className="text-sm text-gray-600">
          Choisissez le produit sur lequel vous souhaitez appliquer votre design
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {printProducts.map((product) => (
            <Card 
              key={product.id} 
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                console.log('🎯 Produit cliqué:', product.name);
                onProductSelect(product);
              }}
            >
              {/* Image du produit */}
              <div className="aspect-square bg-gray-100">
                {product.images?.[0] ? (
                  <OptimizedImage
                    src={buildImageUrl(product.images[0])}
                    alt={product.name}
                    className="w-full h-full"
                    aspectRatio="1/1"
                  />
                ) : (
                  // Fallback avec mockup du template
                  Array.isArray(product.product_templates?.product_mockups) && 
                  product.product_templates.product_mockups.length > 0 ? (
                    <OptimizedImage
                      src={buildImageUrl(
                        product.product_templates.product_mockups.find(
                          m => m.id === product.product_templates?.primary_mockup_id
                        )?.mockup_url || product.product_templates.product_mockups[0]?.mockup_url
                      )}
                      alt={product.name}
                      className="w-full h-full"
                      aspectRatio="1/1"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-gray-400" />
                    </div>
                  )
                )}
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-1">{product.name}</h3>
                
                {product.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="flex justify-between items-center mb-3">
                  <Badge variant="secondary">
                    {product.base_price}€
                  </Badge>
                  <Badge variant="outline">
                    {product.material}
                  </Badge>
                </div>

                {/* Informations sur le template */}
                {product.product_templates && (
                  <div className="text-xs text-gray-500 mb-3">
                    Type: {product.product_templates.type}
                    {Array.isArray(product.product_templates.available_positions) && (
                      <span className="ml-2">
                        • {product.product_templates.available_positions.length} position(s)
                      </span>
                    )}
                  </div>
                )}

                <Button 
                  className="w-full bg-[#33C3F0] hover:bg-[#0FA0CE]"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('🎯 Bouton "Sélectionner" cliqué pour:', product.name);
                    onProductSelect(product);
                  }}
                >
                  Sélectionner ce produit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
