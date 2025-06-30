
import React, { useState } from 'react';
import type { PrintProduct } from '@/types/customProduct';
import { ProductSelectionSection } from './simplified/ProductSelectionSection';
import { DesignUploadHandler } from './simplified/DesignUploadHandler';
import { MockupSection } from './simplified/MockupSection';
import { ProductCreationForm } from './simplified/ProductCreationForm';
import { useDesignPositioning } from '@/hooks/useDesignPositioning';
import { useProductData } from '@/hooks/useProductData';
import { useProductSubmission } from '@/hooks/useProductSubmission';
import { usePrintProducts } from '@/hooks/usePrintProducts';
import { getPrimaryMockupUrl } from '@/utils/mockupUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface SimplifiedProductCreationProps {
  onProductCreate: (productData: any) => void;
}

export const SimplifiedProductCreation: React.FC<SimplifiedProductCreationProps> = ({
  onProductCreate
}) => {
  const [selectedProduct, setSelectedProduct] = useState<PrintProduct | null>(null);
  const [designUrl, setDesignUrl] = useState('');
  
  const { printProducts, isLoading: loadingProducts, error: productsError } = usePrintProducts();
  
  const {
    autoDesignPosition,
    designArea,
    calculateDesignPosition,
    resetDesignPosition
  } = useDesignPositioning();
  const { productData, setProductData, resetProductData } = useProductData();
  const { isLoading, handleSubmit } = useProductSubmission();

  console.log('🎯 [SimplifiedProductCreation] État actuel:', {
    selectedProduct: selectedProduct?.name,
    hasDesign: !!designUrl,
    productName: productData.name,
    hasAutoPosition: !!autoDesignPosition
  });

  const handleProductSelect = (product: PrintProduct | null) => {
    console.log('🎯 [SimplifiedProductCreation] Produit sélectionné:', product?.name);
    setSelectedProduct(product);
    
    // Reset complet lors du changement de produit
    setDesignUrl('');
    resetDesignPosition();
    resetProductData();
  };

  const handleDesignUpload = async (url: string) => {
    console.log('📷 [SimplifiedProductCreation] Design uploadé:', url);
    setDesignUrl(url);
    resetDesignPosition();
    
    if (selectedProduct) {
      await calculateDesignPosition(url, selectedProduct);
    }
  };

  const handleDesignRemove = () => {
    console.log('🗑️ [SimplifiedProductCreation] Suppression du design');
    setDesignUrl('');
    resetDesignPosition();
  };

  const handleProductSubmit = async () => {
    console.log('🚀 [SimplifiedProductCreation] Soumission du produit');
    
    // Validation stricte
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

    // Position automatique avec fallback robuste
    let finalPosition = autoDesignPosition;
    if (!finalPosition) {
      console.log('⚠️ [SimplifiedProductCreation] Position automatique manquante, utilisation fallback');
      finalPosition = {
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        rotation: 0,
        scale: 1
      };
    }

    console.log('✅ [SimplifiedProductCreation] Validation réussie, création en cours');

    const success = await handleSubmit(
      selectedProduct,
      designUrl,
      finalPosition,
      productData
    );

    if (success) {
      console.log('✅ [SimplifiedProductCreation] Produit créé avec succès');
      
      // Réinitialisation complète
      setSelectedProduct(null);
      setDesignUrl('');
      resetDesignPosition();  
      resetProductData();
      
      onProductCreate(success);
    }
  };

  if (productsError) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Erreur de chargement:</strong> {productsError}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!loadingProducts && printProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit disponible</h3>
        <p className="text-gray-500">Les produits d'impression ne sont pas encore configurés.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductSelectionSection 
        printProducts={printProducts}
        onProductSelect={handleProductSelect} 
      />

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
              mockupUrl={getPrimaryMockupUrl(selectedProduct)}
              designUrl={designUrl}
              designArea={designArea || undefined}
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
