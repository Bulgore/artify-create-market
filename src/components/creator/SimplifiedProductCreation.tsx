
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
    setSelectedProduct(product);
    console.log('🎯 Product selected:', product?.name, product?.product_templates?.design_area);
    
    // Reset design and position when product changes
    setDesignUrl('');
    setDesignPosition(null);
  };

  const handleDesignUpload = (url: string) => {
    console.log('📷 Design uploaded:', url);
    setDesignUrl(url);
    
    // ✅ CORRECTION: Auto-generate position when design is uploaded
    if (url && selectedProduct?.product_templates) {
      const designArea = parseDesignArea(selectedProduct.product_templates.design_area);
      
      // Calculate optimal centered position automatically
      const autoPosition = {
        x: designArea.x + (designArea.width * 0.1), // 10% margin from left
        y: designArea.y + (designArea.height * 0.1), // 10% margin from top
        width: designArea.width * 0.8, // 80% of available width
        height: designArea.height * 0.8, // 80% of available height
        rotation: 0
      };
      
      console.log('🎯 Auto-generated position:', autoPosition);
      setDesignPosition(autoPosition);
    }
  };

  const handleDesignRemove = () => {
    setDesignUrl('');
    setDesignPosition(null);
  };

  const handleSubmit = () => {
    console.log('🚀 SimplifiedProductCreation - handleSubmit called');
    console.log('📊 Current state:', {
      selectedProduct: selectedProduct?.name,
      designUrl: !!designUrl,
      designPosition,
      productData
    });

    // ✅ CORRECTION: Simplified validation - only check essential fields
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

    // ✅ Auto-generate position if missing (fallback)
    let finalPosition = designPosition;
    if (!finalPosition && selectedProduct.product_templates) {
      const designArea = parseDesignArea(selectedProduct.product_templates.design_area);
      finalPosition = {
        x: designArea.x + (designArea.width * 0.1),
        y: designArea.y + (designArea.height * 0.1),
        width: designArea.width * 0.8,
        height: designArea.height * 0.8,
        rotation: 0
      };
      console.log('🔄 Generated fallback position:', finalPosition);
    }

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

  // ✅ Simplified validation check for UI
  const canSubmit = selectedProduct && designUrl && productData.name.trim();

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
                {designUrl && designPosition && (
                  <div className="mt-2 text-sm text-green-600">
                    ✅ Design positionné automatiquement au centre
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

                {/* ✅ Improved validation feedback */}
                {!canSubmit && (
                  <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded">
                    {!selectedProduct && "• Sélectionnez un produit"}
                    {selectedProduct && !designUrl && "• Uploadez un design"}
                    {selectedProduct && designUrl && !productData.name.trim() && "• Renseignez le nom du produit"}
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
