
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, AlertTriangle, CheckCircle, Info } from 'lucide-react';

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
  const getProductStatus = (product: PrintProduct) => {
    if (!product.template_id) {
      return { type: 'error', message: 'Aucun gabarit assigné' };
    }
    if (!product.product_templates) {
      return { type: 'error', message: 'Gabarit non trouvé' };
    }
    if (!product.product_templates.svg_file_url) {
      return { type: 'warning', message: 'Fichier SVG manquant' };
    }
    if (!product.product_templates.design_area) {
      return { type: 'warning', message: 'Zone d\'impression non définie' };
    }
    return { type: 'success', message: 'Gabarit configuré' };
  };

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
                {printProducts.map((product) => {
                  const status = getProductStatus(product);
                  return (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex items-center gap-2">
                        {status.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {status.type === 'warning' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                        {status.type === 'error' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {product.name} - {product.base_price}€
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          {selectedProduct && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">{selectedProduct.name}</h4>
              <p className="text-sm text-gray-600">{selectedProduct.description}</p>
              <p className="text-sm font-medium">Prix de base: {selectedProduct.base_price}€</p>
              <p className="text-sm">Matériau: {selectedProduct.material}</p>
              
              {(() => {
                const status = getProductStatus(selectedProduct);
                return (
                  <div className="mt-2 flex items-center gap-2">
                    {status.type === 'success' && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">{status.message}</span>
                      </div>
                    )}
                    {status.type === 'warning' && (
                      <div className="flex items-center gap-2 text-orange-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">{status.message}</span>
                      </div>
                    )}
                    {status.type === 'error' && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">{status.message}</span>
                      </div>
                    )}
                  </div>
                );
              })()}
              
              {(() => {
                const status = getProductStatus(selectedProduct);
                if (status.type === 'error') {
                  return (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 mt-0.5" />
                        <div>
                          <strong>Produit non utilisable :</strong>
                          <br />Ce produit n'est pas encore configuré pour la personnalisation. L'imprimeur doit d'abord lui assigner un gabarit valide avec une zone d'impression définie.
                        </div>
                      </div>
                    </div>
                  );
                }
                if (status.type === 'warning') {
                  return (
                    <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 mt-0.5" />
                        <div>
                          <strong>Configuration incomplète :</strong>
                          <br />Le gabarit de ce produit n'est pas entièrement configuré. Certaines fonctionnalités pourraient ne pas fonctionner correctement.
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSelector;
