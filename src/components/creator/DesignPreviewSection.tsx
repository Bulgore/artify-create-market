
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
  console.log('=== DesignPreviewSection Debug ===');
  console.log('showPositioner:', showPositioner);
  console.log('selectedProduct:', selectedProduct);
  console.log('designUrl:', designUrl);
  console.log('product_templates:', selectedProduct?.product_templates);

  if (!showPositioner || !selectedProduct || !selectedProduct.product_templates || !designUrl) {
    console.log('DesignPreviewSection: Conditions not met', {
      showPositioner,
      hasSelectedProduct: !!selectedProduct,
      hasProductTemplates: !!selectedProduct?.product_templates,
      hasDesignUrl: !!designUrl
    });
    return null;
  }

  // Parse and validate design_area with comprehensive error handling
  let designArea;
  const rawDesignArea = selectedProduct.product_templates.design_area;
  
  console.log('Raw design_area:', rawDesignArea, typeof rawDesignArea);

  try {
    if (typeof rawDesignArea === 'string') {
      designArea = JSON.parse(rawDesignArea);
      console.log('Parsed from string:', designArea);
    } else if (typeof rawDesignArea === 'object' && rawDesignArea !== null) {
      designArea = rawDesignArea;
      console.log('Used as object:', designArea);
    } else {
      throw new Error('Invalid design_area format: ' + typeof rawDesignArea);
    }
  } catch (error) {
    console.error('Error parsing design_area:', error);
    console.log('Using fallback design area');
    designArea = { x: 50, y: 50, width: 200, height: 200 };
  }

  // Validate numeric properties and apply fallbacks
  const validatedDesignArea = {
    x: (typeof designArea?.x === 'number' && !isNaN(designArea.x)) ? designArea.x : 50,
    y: (typeof designArea?.y === 'number' && !isNaN(designArea.y)) ? designArea.y : 50,
    width: (typeof designArea?.width === 'number' && !isNaN(designArea.width) && designArea.width > 0) ? designArea.width : 200,
    height: (typeof designArea?.height === 'number' && !isNaN(designArea.height) && designArea.height > 0) ? designArea.height : 200
  };

  console.log('Final validated design area:', validatedDesignArea);

  // Validate template URLs
  const templateSvgUrl = selectedProduct.product_templates.svg_file_url;
  const mockupImageUrl = selectedProduct.product_templates.mockup_image_url;

  console.log('Template URLs:', {
    templateSvgUrl: templateSvgUrl?.substring(0, 50) + '...',
    mockupImageUrl: mockupImageUrl?.substring(0, 50) + '...'
  });

  if (!templateSvgUrl) {
    console.warn('No template SVG URL found');
  }

  return (
    <div>
      <DesignPositioner
        templateSvgUrl={templateSvgUrl || ''}
        designImageUrl={designUrl}
        designArea={validatedDesignArea}
        onPositionChange={onPositionChange}
      />
    </div>
  );
};

export default DesignPreviewSection;
