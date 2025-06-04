
import React, { useState } from 'react';
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
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    margin_percentage: 20
  });

  const handleProductSelect = (productId: string) => {
    const product = printProducts.find(p => p.id === productId);
    setSelectedProduct(product || null);
    console.log('🎯 Product selected:', product?.name, product?.product_templates?.design_area);
  };

  const handleDesignUpload = (url: string) => {
    console.log('📷 Design uploaded:', url);
    setDesignUrl(url);
  };

  const handleDesignRemove = () => {
    setDesignUrl('');
  };

  const handleSubmit = () => {
    if (!selectedProduct || !designUrl || !productData.name) {
      console.log('❌ Missing required fields');
      return;
    }

    const designArea = selectedProduct.product_templates 
      ? parseDesignArea(selectedProduct.product_templates.design_area)
      : { x: 50, y: 50, width: 200, height: 200 };

    const finalProductData = {
      print_product_id: selectedProduct.id,
      design_data: {
        imageUrl: designUrl,
        position: {
          x: designArea.x + 10,
          y: designArea.y + 10,
          width: Math.min(designArea.width - 20, 100),
          height: Math.min(designArea.height - 20, 100),
          rotation: 0
        }
      },
      name: productData.name,
      description: productData.description,
      creator_margin_percentage: productData.margin_percentage,
      preview_url: designUrl
    };

    console.log('🚀 Creating product:', finalProductData);
    onProductCreate(finalProductData);
  };

  const designArea = selectedProduct?.product_templates 
    ? parseDesignArea(selectedProduct.product_templates.design_area)
    : undefined;

  const finalPrice = selectedProduct 
    ? selectedProduct.base_price * (1 + productData.margin_percentage / 100)
    : 0;

  return (
    <div className="space-y-6">
      <ProductSelector
        printProducts={printProducts}
        selectedProduct={selectedProduct}
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
                  <Label htmlFor="name">Nom du produit</Label>
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

                <Button 
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={!selectedProduct || !designUrl || !productData.name}
                >
                  Créer le produit
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
