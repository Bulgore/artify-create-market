
import React, { useMemo } from 'react';
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

  // Parse design_area de manière sécurisée avec useMemo
  const { designArea, templateSvgUrl, mockupImageUrl, cleanDesignUrl } = useMemo(() => {
    // Vérifications de base
    if (!showPositioner || !selectedProduct || !selectedProduct.product_templates) {
      return {
        designArea: { x: 50, y: 50, width: 200, height: 200 },
        templateSvgUrl: '',
        mockupImageUrl: '',
        cleanDesignUrl: ''
      };
    }

    // Parse design_area avec une gestion d'erreur robuste
    let parsedDesignArea;
    const rawDesignArea = selectedProduct.product_templates.design_area;
    
    console.log('Raw design_area:', rawDesignArea, typeof rawDesignArea);

    try {
      if (typeof rawDesignArea === 'string') {
        const parsed = JSON.parse(rawDesignArea);
        if (parsed && typeof parsed === 'object') {
          parsedDesignArea = parsed;
          console.log('✅ Successfully parsed design_area from string:', parsedDesignArea);
        } else {
          throw new Error('Parsed design_area is not a valid object');
        }
      } else if (typeof rawDesignArea === 'object' && rawDesignArea !== null) {
        parsedDesignArea = rawDesignArea;
        console.log('✅ Using design_area as object:', parsedDesignArea);
      } else {
        throw new Error('Invalid design_area format: ' + typeof rawDesignArea);
      }

      // Validation des propriétés numériques requises
      const requiredProps = ['x', 'y', 'width', 'height'];
      for (const prop of requiredProps) {
        if (typeof parsedDesignArea[prop] !== 'number' || isNaN(parsedDesignArea[prop])) {
          throw new Error(`Invalid ${prop} value: ${parsedDesignArea[prop]}`);
        }
      }

      console.log('✅ Design area validation passed:', parsedDesignArea);

    } catch (error) {
      console.error('❌ Error parsing design_area:', error);
      console.log('🔄 Using fallback design area');
      parsedDesignArea = { x: 50, y: 50, width: 200, height: 200 };
    }

    // Valider et nettoyer les URLs du template
    const templateUrl = selectedProduct.product_templates.svg_file_url || '';
    const mockupUrl = selectedProduct.product_templates.mockup_image_url || '';

    // Valider et nettoyer l'URL du design
    let processedDesignUrl = '';
    if (designUrl && designUrl.trim() !== '') {
      processedDesignUrl = designUrl.trim();
      
      // Assurer que l'URL est complète
      if (processedDesignUrl.startsWith('/storage/v1/object/')) {
        processedDesignUrl = `https://riumhqlxdmsxwsjstqgl.supabase.co${processedDesignUrl}`;
      }
    }

    console.log('✅ Processed URLs:', {
      templateUrl: templateUrl?.substring(0, 50) + '...',
      mockupUrl: mockupUrl?.substring(0, 50) + '...',
      processedDesignUrl: processedDesignUrl?.substring(0, 50) + '...'
    });

    return {
      designArea: parsedDesignArea,
      templateSvgUrl: templateUrl,
      mockupImageUrl: mockupUrl,
      cleanDesignUrl: processedDesignUrl
    };
  }, [showPositioner, selectedProduct, designUrl]);

  if (!showPositioner || !selectedProduct || !selectedProduct.product_templates) {
    console.log('DesignPreviewSection: Conditions not met', {
      showPositioner,
      hasSelectedProduct: !!selectedProduct,
      hasProductTemplates: !!selectedProduct?.product_templates
    });
    return null;
  }

  if (!cleanDesignUrl) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Uploadez un design pour voir l'aperçu de positionnement</p>
      </div>
    );
  }

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
