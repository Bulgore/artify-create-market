
import React from 'react';
import ProductSelector from './ProductSelector';
import DesignUploader from './DesignUploader';
import ProductDetailsForm from './ProductDetailsForm';
import { PrintProduct } from '@/types/customProduct';

interface ProductData {
  name: string;
  description: string;
  margin_percentage: number;
}

interface ProductCreationFormProps {
  printProducts: PrintProduct[];
  selectedProduct: PrintProduct | null;
  onProductSelect: (product: PrintProduct | null) => void;
  designUrl: string;
  onDesignUpload: (url: string) => void;
  productData: ProductData;
  setProductData: (data: ProductData) => void;
  finalPrice: number;
  isLoading: boolean;
  canSubmit: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const ProductCreationForm: React.FC<ProductCreationFormProps> = ({
  printProducts,
  selectedProduct,
  onProductSelect,
  designUrl,
  onDesignUpload,
  productData,
  setProductData,
  finalPrice,
  isLoading,
  canSubmit,
  onSubmit
}) => {
  return (
    <div className="space-y-6">
      <ProductSelector
        onProductSelect={onProductSelect}
      />

      {selectedProduct && selectedProduct.product_templates && (
        <DesignUploader
          onDesignUpload={onDesignUpload}
          currentDesignUrl={designUrl}
        />
      )}

      {selectedProduct && selectedProduct.product_templates && (
        <ProductDetailsForm
          productData={productData}
          setProductData={setProductData}
          finalPrice={finalPrice}
          isLoading={isLoading}
          canSubmit={canSubmit}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
};

export default ProductCreationForm;
