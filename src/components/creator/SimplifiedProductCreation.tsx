
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
import { buildImageUrl } from '@/utils/imageUrl';
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

  console.log('🎯 SimplifiedProductCreation render state:', {
    selectedProduct: selectedProduct?.name,
    selectedProductId: selectedProduct?.id,
    designUrl: !!designUrl,
    productName: productData.name,
    autoPositionExists: !!autoDesignPosition,
    printProductsAvailable: printProducts.length,
    productsError
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
    
    if (selectedProduct) {
      await calculateDesignPosition(url, selectedProduct);
    }
  };

  const handleDesignRemove = () => {
    setDesignUrl('');
    resetDesignPosition();
  };

  const handleProductSubmit = async () => {
    console.log('🚀 SimplifiedProductCreation - handleProductSubmit');
    console.log('📦 Validation des données:', {
      selectedProduct: !!selectedProduct,
      designUrl: !!designUrl,
      productName: productData.name,
      autoPosition: !!autoDesignPosition
    });
    
    // Validation SIMPLE et CLAIRE
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

    // Position automatique avec fallback
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

    console.log('✅ Validation réussie - soumission du produit');

    const success = await handleSubmit(
      selectedProduct,
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
      
      // Appeler la callback parent
      onProductCreate(success);
    }
  };

  // Afficher les erreurs de chargement des produits
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

  // Afficher message si aucun produit disponible
  if (!loadingProducts && printProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit disponible</h3>
        <p className="text-gray-500">Les produits d'impression ne sont pas encore configurés.</p>
      </div>
    );
  }

  // Fonction pour obtenir l'URL du mockup principal
  const getPrimaryMockupUrl = (product: PrintProduct) => {
    console.log('🔍 Récupération mockup pour produit:', product.name);
    console.log('📦 Template du produit:', product.product_templates);
    console.log('🖼️ Mockups disponibles:', product.product_templates?.product_mockups);
    
    if (!product.product_templates?.product_mockups || !Array.isArray(product.product_templates.product_mockups)) {
      console.warn('⚠️ Aucun mockup disponible pour ce produit');
      return undefined;
    }

    // Chercher le mockup principal
    const primaryMockup = product.product_templates.product_mockups.find(
      m => m.id === product.product_templates?.primary_mockup_id
    );

    if (primaryMockup) {
      const mockupUrl = buildImageUrl(primaryMockup.mockup_url);
      console.log('✅ Mockup principal trouvé:', mockupUrl);
      return mockupUrl;
    }

    // Fallback sur le premier mockup disponible
    const firstMockup = product.product_templates.product_mockups[0];
    if (firstMockup) {
      const mockupUrl = buildImageUrl(firstMockup.mockup_url);
      console.log('⚠️ Utilisation du premier mockup comme fallback:', mockupUrl);
      return mockupUrl;
    }

    console.warn('❌ Aucun mockup utilisable trouvé');
    return undefined;
  };

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
