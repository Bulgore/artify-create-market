
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
  console.log('selectedProduct:', selectedProduct?.name);
  console.log('designUrl:', designUrl);

  if (!showPositioner || !selectedProduct || !selectedProduct.product_templates) {
    console.log('DesignPreviewSection: Conditions not met', {
      showPositioner,
      hasSelectedProduct: !!selectedProduct,
      hasProductTemplates: !!selectedProduct?.product_templates
    });
    return null;
  }

  // Parse design_area avec une gestion d'erreur robuste
  let designArea;
  const rawDesignArea = selectedProduct.product_templates.design_area;
  
  console.log('Raw design_area:', rawDesignArea, typeof rawDesignArea);

  try {
    if (typeof rawDesignArea === 'string') {
      // Parse JSON string
      const parsed = JSON.parse(rawDesignArea);
      if (parsed && typeof parsed === 'object') {
        designArea = parsed;
        console.log('✅ Successfully parsed design_area from string:', designArea);
      } else {
        throw new Error('Parsed design_area is not a valid object');
      }
    } else if (typeof rawDesignArea === 'object' && rawDesignArea !== null) {
      designArea = rawDesignArea;
      console.log('✅ Using design_area as object:', designArea);
    } else {
      throw new Error('Invalid design_area format: ' + typeof rawDesignArea);
    }

    // Validation des propriétés numériques requises
    const requiredProps = ['x', 'y', 'width', 'height'];
    for (const prop of requiredProps) {
      if (typeof designArea[prop] !== 'number' || isNaN(designArea[prop])) {
        throw new Error(`Invalid ${prop} value: ${designArea[prop]}`);
      }
    }

    console.log('✅ Design area validation passed:', designArea);

  } catch (error) {
    console.error('❌ Error parsing design_area:', error);
    console.log('🔄 Using fallback design area');
    designArea = { x: 50, y: 50, width: 200, height: 200 };
  }

  // Valider et nettoyer les URLs du template
  const templateSvgUrl = selectedProduct.product_templates.svg_file_url || '';
  const mockupImageUrl = selectedProduct.product_templates.mockup_image_url || '';

  console.log('Template URLs:', {
    templateSvgUrl: templateSvgUrl?.substring(0, 50) + '...',
    mockupImageUrl: mockupImageUrl?.substring(0, 50) + '...'
  });

  // Valider et nettoyer l'URL du design
  if (!designUrl || designUrl.trim() === '') {
    console.log('❌ No design URL provided');
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Uploadez un design pour voir l'aperçu de positionnement</p>
      </div>
    );
  }

  let cleanDesignUrl = designUrl.trim();
  
  // Assurer que l'URL est complète
  if (cleanDesignUrl.startsWith('/storage/v1/object/')) {
    cleanDesignUrl = `https://riumhqlxdmsxwsjstqgl.supabase.co${cleanDesignUrl}`;
  }

  console.log('✅ Final design URL:', cleanDesignUrl);
  console.log('✅ Final design area:', designArea);

  return (
    <div>
      <DesignPositioner
        templateSvgUrl={templateSvgUrl}
        designImageUrl={cleanDesignUrl}
        designArea={designArea}
        onPositionChange={onPositionChange}
      />
    </div>
  );
};

export default DesignPreviewSection;
