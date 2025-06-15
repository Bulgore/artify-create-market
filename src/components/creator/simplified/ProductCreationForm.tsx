
import React from 'react';
import { parseDesignArea } from '@/types/designArea';
import type { PrintProduct } from '@/types/customProduct';
import { ProductDetailsSection } from './ProductDetailsSection';
import { ValidationFeedback } from './ValidationFeedback';

interface ProductData {
  name: string;
  description: string;
  margin_percentage: number;
}

interface ProductCreationFormProps {
  selectedProduct: PrintProduct;
  designUrl: string;
  productData: ProductData;
  setProductData: (data: ProductData) => void;
  autoDesignPosition: any;
  onSubmit: () => void;
  isLoading: boolean;
}

export const ProductCreationForm: React.FC<ProductCreationFormProps> = ({
  selectedProduct,
  designUrl,
  productData,
  setProductData,
  autoDesignPosition,
  onSubmit,
  isLoading
}) => {
  const designArea = selectedProduct?.product_templates 
    ? parseDesignArea(selectedProduct.product_templates.design_area)
    : undefined;

  // Validation STRICTE et EXPLICITE avec logs détaillés
  const hasProduct = !!(selectedProduct && selectedProduct.id);
  const hasDesign = !!(designUrl && designUrl.trim() !== '');
  const hasName = !!(productData.name && productData.name.trim() !== '');
  
  const canSubmit = hasProduct && hasDesign && hasName;

  console.log('🔍 ProductCreationForm - VALIDATION DÉTAILLÉE:', {
    selectedProductExists: !!selectedProduct,
    selectedProductId: selectedProduct?.id,
    selectedProductName: selectedProduct?.name,
    hasProductTemplates: !!selectedProduct?.product_templates,
    designUrlExists: !!designUrl,
    designUrlTrimmed: designUrl?.trim(),
    designUrlLength: designUrl?.length,
    productNameExists: !!productData.name,
    productNameTrimmed: productData.name?.trim(),
    productNameLength: productData.name?.length,
    hasProduct,
    hasDesign,
    hasName,
    canSubmit,
    autoPositionExists: !!autoDesignPosition,
    isLoading
  });

  return (
    <div className="space-y-6">
      <ProductDetailsSection
        selectedProduct={selectedProduct}
        productData={productData}
        setProductData={setProductData}
        canSubmit={canSubmit && !isLoading}
        onSubmit={onSubmit}
      />

      <ValidationFeedback
        canSubmit={canSubmit}
        selectedProduct={selectedProduct}
        designUrl={designUrl}
        productName={productData.name}
        designArea={designArea}
        autoDesignPosition={autoDesignPosition}
      />
      
      {/* Debug panel TOUJOURS VISIBLE pour debugging */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded text-xs font-mono">
        <div className="font-bold mb-2 text-blue-800">🔍 Debug - État COMPLET du formulaire:</div>
        <div className="space-y-1 text-blue-700">
          <div>✓ Produit: {hasProduct ? '✅ OUI' : '❌ NON'} ({selectedProduct?.id || 'NULL'})</div>
          <div>✓ Design: {hasDesign ? '✅ OUI' : '❌ NON'} ({designUrl?.length || 0} chars)</div>
          <div>✓ Nom: {hasName ? '✅ OUI' : '❌ NON'} ("{productData.name}")</div>
          <div>✓ Auto-position: {autoDesignPosition ? '✅ OUI' : '❌ NON'}</div>
          <div>✓ Loading: {isLoading ? '⏳ OUI' : '❌ NON'}</div>
          <div className="font-bold mt-2 text-lg">
            🎯 Validation finale: {canSubmit ? '✅ SUCCÈS' : '❌ ÉCHEC'}
          </div>
        </div>
      </div>
    </div>
  );
};
