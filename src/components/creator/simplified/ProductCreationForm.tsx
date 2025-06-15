
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
    </div>
  );
};
