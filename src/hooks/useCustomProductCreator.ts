
import { useState } from 'react';
import { ProductData } from '@/types/customProduct';
import { usePrintProducts } from './usePrintProducts';
import { useProductSelection } from './useProductSelection';
import { useDesignManagement } from './useDesignManagement';
import { useProductSubmission } from './useProductSubmission';

export const useCustomProductCreator = () => {
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    description: '',
    margin_percentage: 20
  });

  const { printProducts } = usePrintProducts();
  const { selectedProduct, handleProductSelect, setSelectedProduct } = useProductSelection(printProducts);
  const { 
    designUrl, 
    designPosition, 
    showPositioner, 
    handleDesignUpload, 
    handlePositionChange,
    resetDesign 
  } = useDesignManagement();
  const { isLoading, handleSubmit: submitProduct } = useProductSubmission();

  const calculateFinalPrice = () => {
    if (!selectedProduct) return 0;
    const marginAmount = (selectedProduct.base_price * productData.margin_percentage) / 100;
    return selectedProduct.base_price + marginAmount;
  };

  const handleProductCreate = async (productData: any) => {
    console.log('🚀 Creating product with data:', productData);
    
    const success = await submitProduct(
      selectedProduct, 
      productData.design_data.imageUrl, 
      productData.design_data.position, 
      {
        name: productData.name,
        description: productData.description,
        margin_percentage: productData.creator_margin_percentage
      }
    );
    
    if (success) {
      // Reset form after successful submission
      setSelectedProduct(null);
      resetDesign();
      setProductData({
        name: '',
        description: '',
        margin_percentage: 20
      });
    }
    
    return success;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await submitProduct(selectedProduct, designUrl, designPosition, productData);
    
    if (success) {
      // Reset form after successful submission
      setSelectedProduct(null);
      resetDesign();
      setProductData({
        name: '',
        description: '',
        margin_percentage: 20
      });
    }
    
    return success;
  };

  // When product selection changes, reset design
  const handleProductSelectWithReset = (productId: string) => {
    resetDesign();
    handleProductSelect(productId);
  };

  return {
    printProducts,
    selectedProduct,
    designUrl,
    designPosition,
    isLoading,
    showPositioner,
    productData,
    setProductData,
    handleProductSelect: handleProductSelectWithReset,
    handleDesignUpload,
    handlePositionChange,
    calculateFinalPrice,
    handleSubmit,
    handleProductCreate
  };
};
