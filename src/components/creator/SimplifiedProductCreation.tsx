
import React, { useState, useEffect } from 'react';
import { parseDesignArea } from '@/types/designArea';
import { calculateAutoPosition, getImageDimensions } from '@/utils/designPositioning';
import type { PrintProduct } from '@/types/customProduct';
import { ProductSelectionSection } from './simplified/ProductSelectionSection';
import { DesignUploadSection } from './simplified/DesignUploadSection';
import { MockupSection } from './simplified/MockupSection';
import { ProductDetailsSection } from './simplified/ProductDetailsSection';
import { ValidationFeedback } from './simplified/ValidationFeedback';

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

    // CORRECTION VALIDATION : Simplifiée au maximum - plus de vérification multilingue
    if (!selectedProduct) {
      console.log('❌ Aucun produit sélectionné');
      return;
    }

    if (!designUrl) {
      console.log('❌ Aucun design uploadé');
      return;
    }

    // SEUL LE NOM FRANÇAIS EST VÉRIFIÉ
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

  // CORRECTION VALIDATION : Simplifiée - seuls produit + design + nom français requis
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
      <ProductSelectionSection onProductSelect={handleProductSelect} />

      {selectedProduct && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <DesignUploadSection
              onDesignUpload={handleDesignUpload}
              designUrl={designUrl}
              autoDesignPosition={autoDesignPosition}
              onDesignRemove={handleDesignRemove}
            />
          </div>

          <div className="space-y-6">
            <MockupSection
              mockupUrl={selectedProduct.product_templates?.mockup_image_url}
              designUrl={designUrl}
              designArea={designArea}
              designPosition={autoDesignPosition}
            />

            <ProductDetailsSection
              selectedProduct={selectedProduct}
              productData={productData}
              setProductData={setProductData}
              canSubmit={canSubmit}
              onSubmit={handleSubmit}
            />

            <ValidationFeedback
              canSubmit={canSubmit}
              selectedProduct={selectedProduct}
              designUrl={designUrl}
              productName={productData.name}
              designArea={designArea}
              autoDesignPosition={autoDesignPosition}
            />
          </div>
        </div>
      )}
    </div>
  );
};
