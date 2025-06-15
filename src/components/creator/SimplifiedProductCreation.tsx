
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
    console.log('🎯 Produit sélectionné:', product?.name);
    setSelectedProduct(product);
    
    // Reset design quand on change de produit
    setDesignUrl('');
    setAutoDesignPosition(null);
  };

  const handleDesignUpload = async (url: string) => {
    console.log('📷 Design uploadé:', url);
    setDesignUrl(url);
    setAutoDesignPosition(null);
    
    if (selectedProduct?.product_templates) {
      try {
        const designArea = parseDesignArea(selectedProduct.product_templates.design_area);
        console.log('🎯 Zone d\'impression EXACTE définie par admin:', designArea);
        
        const designDimensions = await getImageDimensions(url);
        console.log('📐 Dimensions RÉELLES du design uploadé:', designDimensions);
        
        const autoPosition = calculateAutoPosition(designDimensions, designArea);
        
        const finalPosition = {
          x: autoPosition.x,
          y: autoPosition.y,
          width: autoPosition.width,
          height: autoPosition.height,
          rotation: 0,
          scale: autoPosition.scale
        };
        
        console.log('✅ Position automatique PROFESSIONNELLE avec coordonnées EXACTES:', {
          zoneImpressionAdmin: designArea,
          designOriginal: designDimensions,
          positionFinaleExacte: finalPosition,
          agrandissementMaximal: Math.round(autoPosition.scale * 100) + '%',
          verificationCentrage: {
            centreX: finalPosition.x + finalPosition.width / 2,
            centreZoneX: designArea.x + designArea.width / 2,
            centreY: finalPosition.y + finalPosition.height / 2,
            centreZoneY: designArea.y + designArea.height / 2
          }
        });
        
        setAutoDesignPosition(finalPosition);
        
      } catch (error) {
        console.error('❌ Erreur calcul position automatique PROFESSIONNELLE:', error);
        
        // Fallback centré dans la zone admin
        const designArea = parseDesignArea(selectedProduct.product_templates.design_area);
        const fallbackPosition = {
          x: designArea.x + (designArea.width * 0.1),
          y: designArea.y + (designArea.height * 0.1),
          width: designArea.width * 0.8,
          height: designArea.height * 0.8,
          rotation: 0,
          scale: 0.8
        };
        
        console.log('⚠️ Utilisation position fallback CENTRÉE dans zone admin:', fallbackPosition);
        setAutoDesignPosition(fallbackPosition);
      }
    }
  };

  const handleDesignRemove = () => {
    setDesignUrl('');
    setAutoDesignPosition(null);
  };

  const handleSubmit = () => {
    console.log('🚀 SimplifiedProductCreation - handleSubmit avec validation SIMPLE');
    
    // Validation SIMPLE et CLAIRE - uniquement les 3 champs ESSENTIELS
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

    // Position automatique - pas de validation bloquante, utiliser fallback si nécessaire
    let finalPosition = autoDesignPosition;
    if (!finalPosition) {
      console.log('⚠️ Position automatique manquante, utilisation fallback centré');
      const designArea = parseDesignArea(selectedProduct.product_templates?.design_area || '{}');
      finalPosition = {
        x: designArea.x + (designArea.width * 0.1),
        y: designArea.y + (designArea.height * 0.1),
        width: designArea.width * 0.8,
        height: designArea.height * 0.8,
        rotation: 0,
        scale: 0.8
      };
    }

    console.log('✅ Validation SIMPLE réussie - création avec position EXACTE:', finalPosition);

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

    console.log('🚀 Données finales pour création avec positionnement PROFESSIONNEL EXACT:', finalProductData);
    onProductCreate(finalProductData);
  };

  const designArea = selectedProduct?.product_templates 
    ? parseDesignArea(selectedProduct.product_templates.design_area)
    : undefined;

  // Validation SIMPLE : produit + design + nom (position automatique non bloquante)
  const canSubmit = !!(selectedProduct && designUrl && productData.name.trim());

  console.log('🔍 État de validation SIMPLE et CLAIRE:', {
    hasProduct: !!selectedProduct,
    hasDesign: !!designUrl,
    hasName: !!productData.name.trim(),
    canSubmit,
    autoPositionStatus: autoDesignPosition ? 'Calculée avec précision' : 'En attente (non bloquant)'
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
              svgTemplateUrl={selectedProduct.product_templates?.svg_file_url}
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
