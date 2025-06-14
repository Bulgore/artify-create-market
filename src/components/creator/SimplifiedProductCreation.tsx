
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ProductSelector from './ProductSelector';
import { SimpleDesignUploader } from './design-uploader/SimpleDesignUploader';
import { DesignPreview } from './design-uploader/DesignPreview';
import { MockupPreview } from './design-uploader/MockupPreview';
import { parseDesignArea } from '@/types/designArea';
import type { PrintProduct } from '@/types/customProduct';

interface SimplifiedProductCreationProps {
  printProducts: PrintProduct[];
  onProductCreate: (productData: any) => void;
}

export const SimplifiedProductCreation: React.FC<SimplifiedProductCreationProps> = ({
  printProducts,
  onProductCreate
}) => {
  const [selectedProduct, setSelectedProduct] = useState<PrintProduct | null>(null);
  const [designUrl, setDesignUrl] = useState('');
  const [designPosition, setDesignPosition] = useState<any>(null);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    margin_percentage: 20
  });

  const handleProductSelect = (product: PrintProduct | null) => {
    console.log('🎯 Product selected:', product?.name);
    setSelectedProduct(product);
    
    // Reset design and position when product changes
    setDesignUrl('');
    setDesignPosition(null);
  };

  const handleDesignUpload = (url: string) => {
    console.log('📷 Design uploaded:', url);
    setDesignUrl(url);
    
    // ✅ CORRECTION: Position basée sur la vraie zone d'impression
    if (selectedProduct?.product_templates) {
      const designArea = parseDesignArea(selectedProduct.product_templates.design_area);
      
      // Position automatique centrée dans la zone d'impression
      const autoPosition = {
        x: designArea.x + (designArea.width * 0.1), // 10% de marge
        y: designArea.y + (designArea.height * 0.1), // 10% de marge
        width: designArea.width * 0.8, // 80% de la zone disponible
        height: designArea.height * 0.8, // 80% de la zone disponible
        rotation: 0
      };
      
      console.log('🎯 Position auto-générée basée sur la zone d\'impression:', {
        designArea,
        autoPosition
      });
      
      setDesignPosition(autoPosition);
    } else {
      // Fallback si pas de zone d'impression définie
      const fallbackPosition = {
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        rotation: 0
      };
      
      console.log('⚠️ Utilisation position fallback (pas de zone d\'impression):', fallbackPosition);
      setDesignPosition(fallbackPosition);
    }
  };

  const handleDesignRemove = () => {
    setDesignUrl('');
    setDesignPosition(null);
  };

  const handleSubmit = () => {
    console.log('🚀 SimplifiedProductCreation - handleSubmit called');
    console.log('📊 Current state validation:', {
      selectedProduct: selectedProduct?.name,
      designUrl: !!designUrl,
      productName: productData.name.trim(),
      designPosition: !!designPosition
    });

    // ✅ CORRECTION: Validation ultra-simplifiée - plus de vérification de position manuelle
    if (!selectedProduct) {
      console.log('❌ No product selected');
      return;
    }

    if (!designUrl) {
      console.log('❌ No design uploaded');
      return;
    }

    if (!productData.name.trim()) {
      console.log('❌ Product name is empty');
      return;
    }

    // ✅ Position toujours disponible (auto-générée à l'upload)
    const finalPosition = designPosition || {
      x: 50,
      y: 50,
      width: 200,
      height: 200,
      rotation: 0
    };

    console.log('✅ All validations passed, creating product with position:', finalPosition);

    const finalProductData = {
      print_product_id: selectedProduct.id,
      design_data: {
        imageUrl: designUrl,
        position: finalPosition
      },
      name: productData.name,
      description: productData.description,
      creator_margin_percentage: productData.margin_percentage,
      preview_url: designUrl
    };

    console.log('🚀 Creating product with final data:', finalProductData);
    onProductCreate(finalProductData);
  };

  const designArea = selectedProduct?.product_templates 
    ? parseDesignArea(selectedProduct.product_templates.design_area)
    : undefined;

  const finalPrice = selectedProduct 
    ? selectedProduct.base_price * (1 + productData.margin_percentage / 100)
    : 0;

  // ✅ CORRECTION: Validation simplifiée - design auto-positionné donc toujours valide
  const canSubmit = !!(selectedProduct && designUrl && productData.name.trim());

  console.log('🔍 Form validation state:', {
    hasProduct: !!selectedProduct,
    hasDesign: !!designUrl,
    hasName: !!productData.name.trim(),
    hasPosition: !!designPosition,
    canSubmit
  });

  return (
    <div className="space-y-6">
      <ProductSelector
        onProductSelect={handleProductSelect}
      />

      {selectedProduct && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload du design</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleDesignUploader onDesignUpload={handleDesignUpload} />
                {designUrl && (
                  <div className="mt-2 text-sm text-green-600">
                    ✅ Design uploadé et positionné automatiquement dans la zone d'impression
                  </div>
                )}
              </CardContent>
            </Card>

            <DesignPreview 
              designUrl={designUrl} 
              onRemove={handleDesignRemove} 
            />
          </div>

          <div className="space-y-6">
            <MockupPreview
              mockupUrl={selectedProduct.product_templates?.mockup_image_url}
              designUrl={designUrl}
              designArea={designArea}
              designPosition={designPosition}
            />

            <Card>
              <CardHeader>
                <CardTitle>Détails du produit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom du produit *</Label>
                  <Input
                    id="name"
                    value={productData.name}
                    onChange={(e) => setProductData({...productData, name: e.target.value})}
                    placeholder="Mon super design"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={productData.description}
                    onChange={(e) => setProductData({...productData, description: e.target.value})}
                    placeholder="Description du produit..."
                  />
                </div>

                <div>
                  <Label htmlFor="margin">Marge créateur (%)</Label>
                  <Input
                    id="margin"
                    type="number"
                    value={productData.margin_percentage}
                    onChange={(e) => setProductData({...productData, margin_percentage: Number(e.target.value)})}
                    min="0"
                    max="100"
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Prix de base:</span>
                    <span>{selectedProduct.base_price.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Marge ({productData.margin_percentage}%):</span>
                    <span>+{(selectedProduct.base_price * productData.margin_percentage / 100).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Prix final:</span>
                    <span>{finalPrice.toFixed(2)} €</span>
                  </div>
                </div>

                {/* ✅ CORRECTION: Feedback de validation simplifié */}
                {!canSubmit && (
                  <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded">
                    <div className="font-medium mb-1">Informations manquantes :</div>
                    {!selectedProduct && <div>• Sélectionnez un produit</div>}
                    {selectedProduct && !designUrl && <div>• Uploadez un design</div>}
                    {selectedProduct && designUrl && !productData.name.trim() && <div>• Renseignez le nom du produit</div>}
                  </div>
                )}

                {canSubmit && (
                  <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
                    ✅ Prêt à créer ! Design automatiquement positionné dans la zone d'impression.
                    {designArea && (
                      <div className="mt-1 text-xs">
                        Zone d'impression: {designArea.width}x{designArea.height}px
                      </div>
                    )}
                  </div>
                )}

                <Button 
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={!canSubmit}
                >
                  {canSubmit ? 'Créer le produit' : 'Informations manquantes'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
