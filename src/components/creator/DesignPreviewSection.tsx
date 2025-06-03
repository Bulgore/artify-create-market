
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
  if (!showPositioner || !selectedProduct || !selectedProduct.product_templates || !designUrl) {
    return null;
  }

  return (
    <DesignPositioner
      templateSvgUrl={selectedProduct.product_templates.svg_file_url}
      designImageUrl={designUrl}
      designArea={selectedProduct.product_templates.design_area}
      onPositionChange={onPositionChange}
    />
  );
};

export default DesignPreviewSection;
