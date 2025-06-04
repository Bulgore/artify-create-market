
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

  // Parse design_area safely with better error handling
  let designArea;
  try {
    if (typeof selectedProduct.product_templates.design_area === 'string') {
      designArea = JSON.parse(selectedProduct.product_templates.design_area);
    } else if (typeof selectedProduct.product_templates.design_area === 'object' && selectedProduct.product_templates.design_area !== null) {
      designArea = selectedProduct.product_templates.design_area;
    } else {
      throw new Error('Invalid design_area format');
    }
  } catch (error) {
    console.error('Error parsing design_area:', error, 'Raw value:', selectedProduct.product_templates.design_area);
    // Fallback to reasonable defaults
    designArea = { x: 50, y: 50, width: 200, height: 200 };
  }

  console.log('Parsed design area:', designArea);

  // Ensure design area has valid numeric values with fallbacks
  const safeDesignArea = {
    x: typeof designArea?.x === 'number' && !isNaN(designArea.x) ? designArea.x : 50,
    y: typeof designArea?.y === 'number' && !isNaN(designArea.y) ? designArea.y : 50,
    width: typeof designArea?.width === 'number' && !isNaN(designArea.width) && designArea.width > 0 ? designArea.width : 200,
    height: typeof designArea?.height === 'number' && !isNaN(designArea.height) && designArea.height > 0 ? designArea.height : 200
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
