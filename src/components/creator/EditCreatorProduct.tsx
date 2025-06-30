
import React, { useEffect } from 'react';
import { DesignUploadHandler } from './simplified/DesignUploadHandler';
import { MockupSection } from './simplified/MockupSection';
import { ProductCreationForm } from './simplified/ProductCreationForm';
import { useDesignPositioning } from '@/hooks/useDesignPositioning';
import { useProductData } from '@/hooks/useProductData';
import { useCreatorProductUpdate } from '@/hooks/useCreatorProductUpdate';
import { useEditProductData } from '@/hooks/useEditProductData';
import { EditProductHeader } from './edit-product/EditProductHeader';
import { EditProductLoading } from './edit-product/EditProductLoading';
import { EditProductError } from './edit-product/EditProductError';
import { EditProductNotFound } from './edit-product/EditProductNotFound';
import { getPrimaryMockupUrl } from '@/utils/mockupUtils';

interface EditCreatorProductProps {
  productId: string;
  onUpdated: () => void;
  onBack: () => void;
}

export const EditCreatorProduct: React.FC<EditCreatorProductProps> = ({
  productId,
  onUpdated,
  onBack
}) => {
  const {
    loading,
    printProduct,
    designUrl,
    error,
    setDesignUrl,
    fetchProduct
  } = useEditProductData();

  const {
    autoDesignPosition,
    designArea,
    calculateDesignPosition,
    resetDesignPosition
  } = useDesignPositioning();

  const { productData, setProductData } = useProductData();
  const { isLoading, handleUpdate } = useCreatorProductUpdate(productId);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        console.log('🔄 [EditCreatorProduct] Chargement du produit:', productId);
        const { product } = await fetchProduct(productId);
        
        if (!product) {
          console.error('❌ [EditCreatorProduct] Produit non trouvé');
          return;
        }

        console.log('✅ [EditCreatorProduct] Produit chargé:', product.name_fr);
        
        // Configuration des données du produit
        setProductData({
          name: product.name_fr || '',
          description: product.description_fr || '',
          margin_percentage: product.creator_margin_percentage || 20
        });

        // Calcul de la position du design si présent
        if (product.original_design_url && printProduct) {
          console.log('🎯 [EditCreatorProduct] Calcul position design');
          await calculateDesignPosition(product.original_design_url, printProduct);
        }
      } catch (error) {
        console.error('❌ [EditCreatorProduct] Erreur chargement:', error);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId, fetchProduct, setProductData, calculateDesignPosition, printProduct]);

  const handleDesignUpload = async (url: string) => {
    console.log('📤 [EditCreatorProduct] Upload du design:', url);
    setDesignUrl(url);
    resetDesignPosition();
    
    if (printProduct) {
      await calculateDesignPosition(url, printProduct);
    }
  };

  const submit = async () => {
    console.log('💾 [EditCreatorProduct] Soumission des modifications');
    const success = await handleUpdate(designUrl, autoDesignPosition, productData);
    if (success) {
      onUpdated();
    }
  };

  if (loading) {
    return <EditProductLoading />;
  }

  if (error) {
    return (
      <EditProductError
        error={error}
        onRetry={() => fetchProduct(productId)}
        onBack={onBack}
      />
    );
  }

  if (!printProduct) {
    return <EditProductNotFound onBack={onBack} />;
  }

  return (
    <div className="space-y-6">
      <EditProductHeader onBack={onBack} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <DesignUploadHandler
            selectedProduct={printProduct}
            designUrl={designUrl}
            autoDesignPosition={autoDesignPosition}
            onDesignUpload={handleDesignUpload}
            onDesignRemove={() => setDesignUrl('')}
          />
        </div>
        
        <div className="space-y-6">
          <MockupSection
            mockupUrl={getPrimaryMockupUrl(printProduct)}
            designUrl={designUrl}
            designArea={designArea || undefined}
            designPosition={autoDesignPosition}
          />

          <ProductCreationForm
            selectedProduct={printProduct}
            designUrl={designUrl}
            productData={productData}
            setProductData={setProductData}
            autoDesignPosition={autoDesignPosition}
            onSubmit={submit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
