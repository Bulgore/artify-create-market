
import React from 'react';
import DesignPositioner from './DesignPositioner';

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

interface DesignPreviewSectionProps {
  showPositioner: boolean;
  selectedProduct: PrintProduct | null;
  designUrl: string;
  onPositionChange: (position: any) => void;
}

const DesignPreviewSection: React.FC<DesignPreviewSectionProps> = ({
  showPositioner,
  selectedProduct,
  designUrl,
  onPositionChange
}) => {
  console.log('DesignPreviewSection props:', {
    showPositioner,
    selectedProduct,
    designUrl,
    hasProductTemplates: !!selectedProduct?.product_templates
  });

  if (!showPositioner || !selectedProduct || !selectedProduct.product_templates || !designUrl) {
    console.log('DesignPreviewSection: Not showing positioner', {
      showPositioner,
      hasSelectedProduct: !!selectedProduct,
      hasProductTemplates: !!selectedProduct?.product_templates,
      hasDesignUrl: !!designUrl
    });
    return null;
  }

  // Parser le design_area s'il est en string
  let designArea;
  try {
    designArea = typeof selectedProduct.product_templates.design_area === 'string' 
      ? JSON.parse(selectedProduct.product_templates.design_area)
      : selectedProduct.product_templates.design_area;
  } catch (error) {
    console.error('Error parsing design_area:', error);
    designArea = { x: 50, y: 50, width: 200, height: 200 };
  }

  console.log('Parsed design area:', designArea);

  // S'assurer que le design area a des valeurs valides
  const safeDesignArea = {
    x: Number(designArea?.x) || 50,
    y: Number(designArea?.y) || 50,
    width: Number(designArea?.width) || 200,
    height: Number(designArea?.height) || 200
  };

  console.log('Safe design area:', safeDesignArea);

  return (
    <DesignPositioner
      templateSvgUrl={selectedProduct.product_templates.svg_file_url}
      designImageUrl={designUrl}
      designArea={safeDesignArea}
      onPositionChange={onPositionChange}
    />
  );
};

export default DesignPreviewSection;
