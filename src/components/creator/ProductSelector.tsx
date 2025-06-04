
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, AlertTriangle, CheckCircle, Info, Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  
  // Debug logging côté créateur
  useEffect(() => {
    console.log('\n=== PRODUCT SELECTOR DEBUG ===');
    console.log('Number of products received:', printProducts.length);
    console.log('Products data:', printProducts);
    
    if (printProducts.length > 0) {
      printProducts.forEach((product, index) => {
        console.log(`\nProduct ${index + 1}: ${product.name}`);
        console.log('  - ID:', product.id);
        console.log('  - Template ID:', product.template_id);
        console.log('  - Has template data:', !!product.product_templates);
        console.log('  - Template data:', product.product_templates);
        
        if (product.product_templates) {
          console.log('  - Design area:', product.product_templates.design_area);
        }
      });
    } else {
      console.log('❌ No products available for customization');
    }
    console.log('=== END PRODUCT SELECTOR DEBUG ===\n');
  }, [printProducts]);

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

  if (printProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            1. Choisir un produit de base
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-orange-50 rounded-full">
                <Settings className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Aucun produit disponible pour la personnalisation</h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Les produits doivent être configurés par les imprimeurs avec des gabarits ayant des zones d'impression définies.
              </p>
            </div>
            
            {/* Section de débogage */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left max-w-md mx-auto">
              <h4 className="font-medium text-yellow-900 mb-2">🔍 Debug Info:</h4>
              <div className="text-sm text-yellow-800 space-y-1">
                <p>• Nombre de produits reçus: {printProducts.length}</p>
                <p>• Vérifiez la console pour plus de détails</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.reload()}
                  className="mt-2"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Recharger
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md mx-auto">
              <h4 className="font-medium text-blue-900 mb-2">Configuration requise par l'imprimeur :</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Créer des gabarits avec des zones d'impression définies</li>
                <li>Assigner ces gabarits à ses produits d'impression</li>
                <li>Activer les produits pour la personnalisation</li>
                <li>S'assurer que les zones d'impression sont bien définies sur chaque gabarit</li>
              </ol>
            </div>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Une fois ces étapes complétées, vous pourrez sélectionner les produits ici pour créer vos designs personnalisés.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          1. Choisir un produit de base ({printProducts.length} disponible{printProducts.length > 1 ? 's' : ''})
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
