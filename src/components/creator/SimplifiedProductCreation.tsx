
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
import { calculateAutoPosition, getImageDimensions } from '@/utils/designPositioning';
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
  const [autoDesignPosition, setAutoDesignPosition] = useState<any>(null);
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
    setAutoDesignPosition(null);
  };

  const handleDesignUpload = async (url: string) => {
    console.log('📷 Design uploaded:', url);
    setDesignUrl(url);
    
    // Calculer automatiquement la position optimale
    if (selectedProduct?.product_templates) {
      try {
        const designArea = parseDesignArea(selectedProduct.product_templates.design_area);
        console.log('🎯 Zone d\'impression:', designArea);
        
        // Obtenir les dimensions réelles du design
        const designDimensions = await getImageDimensions(url);
        console.log('📐 Dimensions du design:', designDimensions);
        
        // Calculer la position automatique (logique "contain")
        const autoPosition = calculateAutoPosition(designDimensions, designArea);
        
        // Convertir en format attendu par le backend
        const finalPosition = {
          x: autoPosition.x,
          y: autoPosition.y,
          width: autoPosition.width,
          height: autoPosition.height,
          rotation: 0,
          scale: autoPosition.scale
        };
        
        console.log('✅ Position automatique générée:', finalPosition);
        setAutoDesignPosition(finalPosition);
        
      } catch (error) {
        console.error('❌ Erreur calcul position automatique:', error);
        
        // Fallback avec position par défaut
        const designArea = parseDesignArea(selectedProduct.product_templates.design_area);
        const fallbackPosition = {
          x: designArea.x + (designArea.width * 0.1),
          y: designArea.y + (designArea.height * 0.1),
          width: designArea.width * 0.8,
          height: designArea.height * 0.8,
          rotation: 0,
          scale: 0.8
        };
        
        console.log('⚠️ Utilisation position fallback:', fallbackPosition);
        setAutoDesignPosition(fallbackPosition);
      }
    }
  };

  const handleDesignRemove = () => {
    setDesignUrl('');
    setAutoDesignPosition(null);
  };

  const handleSubmit = () => {
    console.log('🚀 SimplifiedProductCreation - handleSubmit called');
    console.log('📊 État de validation:', {
      selectedProduct: selectedProduct?.name,
      designUrl: !!designUrl,
      productName: productData.name.trim(),
      autoPosition: !!autoDesignPosition
    });

    // Validation ultra-simplifiée
    if (!selectedProduct) {
      console.log('❌ Aucun produit sélectionné');
      return;
    }

    if (!designUrl) {
      console.log('❌ Aucun design uploadé');
      return;
    }

    if (!productData.name.trim()) {
      console.log('❌ Nom du produit manquant');
      return;
    }

    // Position automatique disponible ou fallback
    const finalPosition = autoDesignPosition || {
      x: 50,
      y: 50,
      width: 200,
      height: 200,
      rotation: 0,
      scale: 1
    };

    console.log('✅ Validation réussie, création du produit avec position:', finalPosition);

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

    console.log('🚀 Données finales pour création:', finalProductData);
    onProductCreate(finalProductData);
  };

  const designArea = selectedProduct?.product_templates 
    ? parseDesignArea(selectedProduct.product_templates.design_area)
    : undefined;

  const finalPrice = selectedProduct 
    ? selectedProduct.base_price * (1 + productData.margin_percentage / 100)
    : 0;

  // Validation simplifiée : produit + design + nom
  const canSubmit = !!(selectedProduct && designUrl && productData.name.trim());

  console.log('🔍 État de validation du formulaire:', {
    hasProduct: !!selectedProduct,
    hasDesign: !!designUrl,
    hasName: !!productData.name.trim(),
    hasAutoPosition: !!autoDesignPosition,
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
                {designUrl && autoDesignPosition && (
                  <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                    ✅ Design uploadé et positionné automatiquement dans la zone d'impression
                    <div className="text-xs mt-1">
                      Taille optimale calculée: {Math.round(autoDesignPosition.width)}×{Math.round(autoDesignPosition.height)}px
                    </div>
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
              designPosition={autoDesignPosition}
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

                {/* Feedback de validation */}
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
                    {designArea && autoDesignPosition && (
                      <div className="mt-1 text-xs">
                        Zone: {designArea.width}×{designArea.height}px • Position: {Math.round(autoDesignPosition.scale * 100)}% de la taille originale
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
