
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
    
    // ✅ CORRECTION: Generate optimal centered position immediately
    if (url && selectedProduct?.product_templates) {
      const designArea = parseDesignArea(selectedProduct.product_templates.design_area);
      
      // Calculate centered position with proper sizing
      const autoPosition = {
        x: designArea.x + (designArea.width * 0.2), // 20% margin from left
        y: designArea.y + (designArea.height * 0.2), // 20% margin from top
        width: designArea.width * 0.6, // 60% of available width
        height: designArea.height * 0.6, // 60% of available height
        rotation: 0
      };
      
      console.log('🎯 Auto-generated centered position:', autoPosition);
      setDesignPosition(autoPosition);
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
      designPosition: !!designPosition,
      productName: productData.name.trim(),
      allFieldsValid: !!(selectedProduct && designUrl && productData.name.trim())
    });

    // ✅ CORRECTION: Simplified validation - check only essential fields
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

    // ✅ Always ensure we have a position (auto-generate if missing)
    let finalPosition = designPosition;
    if (!finalPosition && selectedProduct.product_templates) {
      const designArea = parseDesignArea(selectedProduct.product_templates.design_area);
      finalPosition = {
        x: designArea.x + (designArea.width * 0.2),
        y: designArea.y + (designArea.height * 0.2),
        width: designArea.width * 0.6,
        height: designArea.height * 0.6,
        rotation: 0
      };
      console.log('🔄 Generated fallback position:', finalPosition);
      setDesignPosition(finalPosition);
    }

    console.log('✅ All validations passed, creating product...');

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

  // ✅ CORRECTION: More permissive validation - position is auto-generated
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
                    ✅ Design uploadé et positionné automatiquement
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

                {/* ✅ CORRECTION: Clear validation feedback */}
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
                    ✅ Tous les champs sont remplis, vous pouvez créer le produit
                  </div>
                )}

                <Button 
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={!canSubmit}
                >
                  {canSubmit ? 'Créer le produit' : 'Remplir les champs manquants'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
