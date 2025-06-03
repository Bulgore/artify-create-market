
import React from 'react';
import ProductSelector from './ProductSelector';
import DesignUploader from './DesignUploader';
import ProductDetailsForm from './ProductDetailsForm';

interface PrintProduct {
  id: string;
  name: string;
  description: string;
  base_price: number;
  material: string;
  available_sizes: string[];
  available_colors: string[];
  template_id: string;
  product_templates: {
    id: string;
    name: string;
    svg_file_url: string;
    mockup_image_url: string;
    design_area: any;
    mockup_area?: any;
  } | null;
}

interface ProductData {
  name: string;
  description: string;
  margin_percentage: number;
}

interface ProductCreationFormProps {
  printProducts: PrintProduct[];
  selectedProduct: PrintProduct | null;
  onProductSelect: (productId: string) => void;
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
        printProducts={printProducts}
        selectedProduct={selectedProduct}
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
