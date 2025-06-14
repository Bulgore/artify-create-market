
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
    console.log('🚀 useCustomProductCreator - handleProductCreate appelé avec:', productData);
    
    try {
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
        console.log('✅ useCustomProductCreator - Produit créé avec succès');
        // Reset form after successful submission
        setSelectedProduct(null);
        resetDesign();
        setProductData({
          name: '',
          description: '',
          margin_percentage: 20
        });
        return true;
      } else {
        console.log('❌ useCustomProductCreator - Échec de la création du produit');
        return false;
      }
    } catch (error) {
      console.error('❌ useCustomProductCreator - Erreur lors de la création:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 useCustomProductCreator - handleSubmit appelé');
    
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
    console.log('🚀 useCustomProductCreator - handleProductSelectWithReset appelé avec:', productId);
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
