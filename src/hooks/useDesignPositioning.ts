
import { useState, useCallback } from 'react';
import { parseDesignArea } from '@/types/designArea';
import { calculateAutoPosition, getImageDimensions } from '@/utils/designPositioning';
import type { PrintProduct } from '@/types/customProduct';

export const useDesignPositioning = () => {
  const [autoDesignPosition, setAutoDesignPosition] = useState<any>(null);

  const calculateDesignPosition = useCallback(async (
    designUrl: string, 
    selectedProduct: PrintProduct | null
  ) => {
    if (!selectedProduct?.product_templates) return;

    try {
      const designArea = parseDesignArea(selectedProduct.product_templates.design_area);
      console.log('🎯 Zone d\'impression EXACTE définie par admin:', designArea);
      
      const designDimensions = await getImageDimensions(designUrl);
      console.log('📐 Dimensions RÉELLES du design uploadé:', designDimensions);
      
      const autoPosition = calculateAutoPosition(designDimensions, designArea);
      
      const finalPosition = {
        x: autoPosition.x,
        y: autoPosition.y,
        width: autoPosition.width,
        height: autoPosition.height,
        rotation: 0,
        scale: autoPosition.scale
      };
      
      console.log('✅ Position automatique PROFESSIONNELLE avec coordonnées EXACTES:', {
        zoneImpressionAdmin: designArea,
        designOriginal: designDimensions,
        positionFinaleExacte: finalPosition,
        agrandissementMaximal: Math.round(autoPosition.scale * 100) + '%',
        verificationCentrage: {
          centreX: finalPosition.x + finalPosition.width / 2,
          centreZoneX: designArea.x + designArea.width / 2,
          centreY: finalPosition.y + finalPosition.height / 2,
          centreZoneY: designArea.y + designArea.height / 2
        }
      });
      
      setAutoDesignPosition(finalPosition);
      
    } catch (error) {
      console.error('❌ Erreur calcul position automatique PROFESSIONNELLE:', error);
      
      // Fallback centré dans la zone admin
      const designArea = parseDesignArea(selectedProduct.product_templates.design_area);
      const fallbackPosition = {
        x: designArea.x + (designArea.width * 0.1),
        y: designArea.y + (designArea.height * 0.1),
        width: designArea.width * 0.8,
        height: designArea.height * 0.8,
        rotation: 0,
        scale: 0.8
      };
      
      console.log('⚠️ Utilisation position fallback CENTRÉE dans zone admin:', fallbackPosition);
      setAutoDesignPosition(fallbackPosition);
    }
  }, []);

  const resetDesignPosition = useCallback(() => {
    setAutoDesignPosition(null);
  }, []);

  return {
    autoDesignPosition,
    calculateDesignPosition,
    resetDesignPosition
  };
};
