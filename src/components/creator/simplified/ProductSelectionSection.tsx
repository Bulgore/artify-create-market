
import React from 'react';
import ProductSelector from '../ProductSelector';
import type { PrintProduct } from '@/types/customProduct';

interface ProductSelectionSectionProps {
  onProductSelect: (product: PrintProduct | null) => void;
}

export const ProductSelectionSection: React.FC<ProductSelectionSectionProps> = ({
  onProductSelect
}) => {
  return (
    <ProductSelector onProductSelect={onProductSelect} />
  );
};
