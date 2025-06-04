
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

  if (!showPositioner || !selectedProduct || !selectedProduct.product_templates) {
    console.log('DesignPreviewSection: Conditions not met', {
      showPositioner,
      hasSelectedProduct: !!selectedProduct,
      hasProductTemplates: !!selectedProduct?.product_templates
    });
    return null;
  }

  // Parse design_area with better error handling
  let designArea;
  const rawDesignArea = selectedProduct.product_templates.design_area;
  
  console.log('Raw design_area:', rawDesignArea, typeof rawDesignArea);

  try {
    if (typeof rawDesignArea === 'string') {
      // Parse JSON string and validate
      const parsed = JSON.parse(rawDesignArea);
      if (parsed && typeof parsed === 'object') {
        designArea = parsed;
        console.log('Successfully parsed design_area from string:', designArea);
      } else {
        throw new Error('Parsed design_area is not an object');
      }
    } else if (typeof rawDesignArea === 'object' && rawDesignArea !== null) {
      designArea = rawDesignArea;
      console.log('Using design_area as object:', designArea);
    } else {
      throw new Error('Invalid design_area format: ' + typeof rawDesignArea);
    }
  } catch (error) {
    console.error('Error parsing design_area:', error);
    console.log('Using fallback design area');
    designArea = { x: 50, y: 50, width: 200, height: 200 };
  }

  // Validate numeric properties with safe defaults
  const validatedDesignArea = {
    x: Number.isFinite(designArea?.x) ? designArea.x : 50,
    y: Number.isFinite(designArea?.y) ? designArea.y : 50,
    width: Number.isFinite(designArea?.width) && designArea.width > 0 ? designArea.width : 200,
    height: Number.isFinite(designArea?.height) && designArea.height > 0 ? designArea.height : 200
  };

  console.log('Final validated design area:', validatedDesignArea);

  // Validate URLs
  const templateSvgUrl = selectedProduct.product_templates.svg_file_url || '';
  const mockupImageUrl = selectedProduct.product_templates.mockup_image_url || '';

  console.log('Template URLs:', {
    templateSvgUrl: templateSvgUrl?.substring(0, 50) + '...',
    mockupImageUrl: mockupImageUrl?.substring(0, 50) + '...'
  });

  // Validate design URL
  if (!designUrl) {
    console.log('No design URL provided');
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Uploadez un design pour voir l'aperçu de positionnement</p>
      </div>
    );
  }

  // Clean and validate design URL
  let cleanDesignUrl = designUrl.trim();
  
  // Si l'URL ne contient pas le domaine complet, on l'ajoute
  if (cleanDesignUrl.startsWith('/storage/v1/object/')) {
    cleanDesignUrl = `https://riumhqlxdmsxwsjstqgl.supabase.co${cleanDesignUrl}`;
  }

  console.log('Clean design URL:', cleanDesignUrl);

  return (
    <div>
      <DesignPositioner
        templateSvgUrl={templateSvgUrl}
        designImageUrl={cleanDesignUrl}
        designArea={validatedDesignArea}
        onPositionChange={onPositionChange}
      />
    </div>
  );
};

export default DesignPreviewSection;
