
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, AlertTriangle, CheckCircle } from 'lucide-react';

interface PrintProduct {
  id: string;
  name: string;
  description: string;
  base_price: number;
  material: string;
  available_sizes: string[];
  available_colors: string[];
  template_id: string;
  product_templates: {
    id: string;
    name: string;
    svg_file_url: string;
    mockup_image_url: string;
    design_area: any;
  } | null;
}

interface ProductSelectorProps {
  printProducts: PrintProduct[];
  selectedProduct: PrintProduct | null;
  onProductSelect: (productId: string) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  printProducts,
  selectedProduct,
  onProductSelect
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          1. Choisir un produit de base
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Produit d'impression</Label>
            <Select onValueChange={onProductSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un produit..." />
              </SelectTrigger>
              <SelectContent>
                {printProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    <div className="flex items-center gap-2">
                      {product.product_templates ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      )}
                      {product.name} - {product.base_price}€
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedProduct && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">{selectedProduct.name}</h4>
              <p className="text-sm text-gray-600">{selectedProduct.description}</p>
              <p className="text-sm font-medium">Prix de base: {selectedProduct.base_price}€</p>
              <p className="text-sm">Matériau: {selectedProduct.material}</p>
              
              <div className="mt-2 flex items-center gap-2">
                {selectedProduct.product_templates ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Gabarit configuré</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">Gabarit manquant</span>
                  </div>
                )}
              </div>
              
              {!selectedProduct.product_templates && (
                <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                  ⚠️ Ce produit n'a pas de gabarit configuré. Contactez l'imprimeur pour qu'il configure le gabarit nécessaire.
                </div>
              )}

              {selectedProduct.product_templates && !selectedProduct.product_templates.svg_file_url && (
                <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                  ⚠️ Le gabarit de ce produit n'a pas de fichier SVG configuré.
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSelector;
