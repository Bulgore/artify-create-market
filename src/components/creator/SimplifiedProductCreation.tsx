
import React, { useState } from 'react';
import { parseDesignArea } from '@/types/designArea';
import type { PrintProduct } from '@/types/customProduct';
import { ProductSelectionSection } from './simplified/ProductSelectionSection';
import { DesignUploadHandler } from './simplified/DesignUploadHandler';
import { MockupSection } from './simplified/MockupSection';
import { ProductCreationForm } from './simplified/ProductCreationForm';
import { useDesignPositioning } from '@/hooks/useDesignPositioning';
import { useProductData } from '@/hooks/useProductData';

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
  
  const { autoDesignPosition, calculateDesignPosition, resetDesignPosition } = useDesignPositioning();
  const { productData, setProductData, resetProductData } = useProductData();

  const handleProductSelect = (product: PrintProduct | null) => {
    console.log('🎯 Produit sélectionné:', product?.name);
    setSelectedProduct(product);
    
    // Reset design quand on change de produit
    setDesignUrl('');
    resetDesignPosition();
    resetProductData();
  };

  const handleDesignUpload = async (url: string) => {
    console.log('📷 Design uploadé:', url);
    setDesignUrl(url);
    resetDesignPosition();
    
    await calculateDesignPosition(url, selectedProduct);
  };

  const handleDesignRemove = () => {
    setDesignUrl('');
    resetDesignPosition();
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

  return (
    <div className="space-y-6">
      <ProductSelectionSection onProductSelect={handleProductSelect} />

      {selectedProduct && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <DesignUploadHandler
              selectedProduct={selectedProduct}
              designUrl={designUrl}
              autoDesignPosition={autoDesignPosition}
              onDesignUpload={handleDesignUpload}
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

            <ProductCreationForm
              selectedProduct={selectedProduct}
              designUrl={designUrl}
              productData={productData}
              setProductData={setProductData}
              autoDesignPosition={autoDesignPosition}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
};
