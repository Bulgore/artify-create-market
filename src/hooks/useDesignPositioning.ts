
import { useState, useCallback } from 'react';
import { parsePrintArea, type PrintArea } from '@/types/printArea';
import { calculateAutoPosition, getImageDimensions } from '@/utils/designPositioning';
import type { PrintProduct } from '@/types/customProduct';
import { supabase } from '@/integrations/supabase/client';

export const useDesignPositioning = () => {
  const [autoDesignPosition, setAutoDesignPosition] = useState<any>(null);
  const [designArea, setDesignArea] = useState<PrintArea | null>(null);

  const calculateDesignPosition = useCallback(async (
    designUrl: string,
    selectedProduct: PrintProduct | null
  ) => {
    if (!selectedProduct?.product_templates) return;

    try {
      let area = { x: 50, y: 50, width: 200, height: 200 };
      if (selectedProduct.product_templates.primary_mockup_id) {
        const { data } = await supabase
          .from('product_mockups')
          .select('print_area')
          .eq('id', selectedProduct.product_templates.primary_mockup_id)
          .single();
        if (data?.print_area) {
          area = parsePrintArea(data.print_area);
        }
      }
      console.log('🎯 Zone d\'impression utilisée:', area);
      setDesignArea(area);
      
      const designDimensions = await getImageDimensions(designUrl);
      console.log('📐 Dimensions RÉELLES du design uploadé:', designDimensions);
      
      const autoPosition = calculateAutoPosition(designDimensions, area);
      
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
        agrandissementMaximal: Math.round(autoPosition.scale * 100) + '%'
      });
      
      setAutoDesignPosition(finalPosition);
      
    } catch (error) {
      console.error('❌ Erreur calcul position automatique PROFESSIONNELLE:', error);
      
      // Fallback centré dans une zone par défaut
      const fallbackArea = { x: 50, y: 50, width: 200, height: 200 };
      const fallbackPosition = {
        ...fallbackArea,
        rotation: 0,
        scale: 1
      };
      setDesignArea(fallbackArea);
      
      console.log('⚠️ Utilisation position fallback CENTRÉE dans zone admin:', fallbackPosition);
      setAutoDesignPosition(fallbackPosition);
    }
  }, []);

  const resetDesignPosition = useCallback(() => {
    setAutoDesignPosition(null);
    setDesignArea(null);
  }, []);

  return {
    autoDesignPosition,
    designArea,
    calculateDesignPosition,
    resetDesignPosition
  };
};
