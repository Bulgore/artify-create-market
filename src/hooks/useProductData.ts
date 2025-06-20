
import { useState } from 'react';

interface ProductData {
  name: string;
  description: string;
  margin_percentage: number;
}

export const useProductData = () => {
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    description: '',
    margin_percentage: 20
  });

  const resetProductData = () => {
    setProductData({
      name: '',
      description: '',
      margin_percentage: 20
    });
  };

  return {
    productData,
    setProductData,
    resetProductData
  };
};
