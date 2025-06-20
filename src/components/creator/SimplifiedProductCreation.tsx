
import React, { useState } from 'react';
import type { PrintProduct } from '@/types/customProduct';
import { ProductSelectionSection } from './simplified/ProductSelectionSection';
import { DesignUploadHandler } from './simplified/DesignUploadHandler';
import { MockupSection } from './simplified/MockupSection';
import { ProductCreationForm } from './simplified/ProductCreationForm';
import { useDesignPositioning } from '@/hooks/useDesignPositioning';
import { useProductData } from '@/hooks/useProductData';
import { useProductSubmission } from '@/hooks/useProductSubmission';

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
  const { isLoading, handleSubmit } = useProductSubmission();

  console.log('🎯 SimplifiedProductCreation render state:', {
    selectedProduct: selectedProduct?.name,
    selectedProductId: selectedProduct?.id,
    designUrl: !!designUrl,
    productName: productData.name,
    autoPositionExists: !!autoDesignPosition
  });

  const handleProductSelect = (product: PrintProduct | null) => {
    console.log('🎯 Produit sélectionné dans SimplifiedProductCreation:', product?.name);
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

  const handleProductSubmit = async () => {
    console.log('🚀 SimplifiedProductCreation - handleProductSubmit AVEC PRODUIT EXPLICITE');
    console.log('📦 Produit à soumettre:', {
      id: selectedProduct?.id,
      name: selectedProduct?.name,
      hasTemplates: !!selectedProduct?.product_templates
    });
    
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
      finalPosition = {
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        rotation: 0,
        scale: 1
      };
    }

    console.log('✅ Validation SIMPLE réussie - soumission avec PRODUIT EXPLICITE:', {
      selectedProduct: selectedProduct.name,
      selectedProductId: selectedProduct.id,
      designUrl: designUrl.substring(0, 50),
      productName: productData.name,
      finalPosition
    });

    // Appeler directement useProductSubmission avec tous les paramètres requis
    const success = await handleSubmit(
      selectedProduct,  // Passer l'objet complet, pas undefined
      designUrl,
      finalPosition,
      productData
    );

    if (success) {
      console.log('✅ Produit créé avec succès');
      // Réinitialiser le formulaire
      setSelectedProduct(null);
      setDesignUrl('');
      resetDesignPosition();
      resetProductData();
    }
  };


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
              designPosition={autoDesignPosition}
            />

            <ProductCreationForm
              selectedProduct={selectedProduct}
              designUrl={designUrl}
              productData={productData}
              setProductData={setProductData}
              autoDesignPosition={autoDesignPosition}
              onSubmit={handleProductSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};
