
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
}

export const ProductCreationForm: React.FC<ProductCreationFormProps> = ({
  selectedProduct,
  designUrl,
  productData,
  setProductData,
  autoDesignPosition,
  onSubmit
}) => {
  const designArea = selectedProduct?.product_templates 
    ? parseDesignArea(selectedProduct.product_templates.design_area)
    : undefined;

  // Validation STRICTE et EXPLICITE
  const hasProduct = !!(selectedProduct && selectedProduct.id);
  const hasDesign = !!(designUrl && designUrl.trim() !== '');
  const hasName = !!(productData.name && productData.name.trim() !== '');
  
  const canSubmit = hasProduct && hasDesign && hasName;

  console.log('🔍 ProductCreationForm - État de validation DÉTAILLÉ:', {
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
    autoPositionExists: !!autoDesignPosition
  });

  return (
    <div className="space-y-6">
      <ProductDetailsSection
        selectedProduct={selectedProduct}
        productData={productData}
        setProductData={setProductData}
        canSubmit={canSubmit}
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
      
      {/* Debug panel pour développement (à retirer en production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 p-3 rounded text-xs font-mono">
          <div className="font-bold mb-2">Debug - État du formulaire:</div>
          <div>✓ Produit: {hasProduct ? 'OUI' : 'NON'} ({selectedProduct?.id || 'NULL'})</div>
          <div>✓ Design: {hasDesign ? 'OUI' : 'NON'} ({designUrl?.length || 0} chars)</div>
          <div>✓ Nom: {hasName ? 'OUI' : 'NON'} ("{productData.name}")</div>
          <div className="font-bold mt-1">Validation finale: {canSubmit ? 'SUCCÈS' : 'ÉCHEC'}</div>
        </div>
      )}
    </div>
  );
};
