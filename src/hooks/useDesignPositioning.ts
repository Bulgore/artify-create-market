
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
    if (!selectedProduct?.product_templates) {
      console.log('⚠️ [useDesignPositioning] Pas de template, utilisation position par défaut');
      
      // Position par défaut sans template
      const defaultArea = { x: 50, y: 50, width: 200, height: 200 };
      const defaultPosition = {
        x: defaultArea.x,
        y: defaultArea.y,
        width: defaultArea.width,
        height: defaultArea.height,
        rotation: 0,
        scale: 1
      };
      
      setDesignArea(defaultArea);
      setAutoDesignPosition(defaultPosition);
      return;
    }

    try {
      // Zone d'impression par défaut
      let area = { x: 50, y: 50, width: 200, height: 200 };
      
      // Essayer de récupérer la zone d'impression du mockup principal
      // Priorité 1: utiliser primary_mockup_id si défini
      if (selectedProduct.product_templates.primary_mockup_id) {
        try {
          const { data } = await supabase
            .from('product_mockups')
            .select('print_area')
            .eq('id', selectedProduct.product_templates.primary_mockup_id)
            .single();
          
          if (data?.print_area) {
            area = parsePrintArea(data.print_area);
            console.log('✅ [useDesignPositioning] Zone d\'impression du mockup (primary_id) récupérée:', area);
          }
        } catch (mockupError) {
          console.warn('⚠️ [useDesignPositioning] Erreur récupération zone mockup (primary_id):', mockupError);
        }
      }
      // Priorité 2: chercher le mockup marqué comme primary dans les product_mockups
      else if (selectedProduct.product_templates?.product_mockups?.length > 0) {
        const primaryMockup = selectedProduct.product_templates.product_mockups.find(m => m.is_primary);
        const mockupToUse = primaryMockup || selectedProduct.product_templates.product_mockups[0];
        
        if (mockupToUse?.print_area) {
          area = parsePrintArea(mockupToUse.print_area);
          console.log('✅ [useDesignPositioning] Zone d\'impression du mockup (is_primary) récupérée:', area);
        }
      }
      // Priorité 3: récupérer directement depuis la base de données pour le template
      else {
        try {
          const { data } = await supabase
            .from('product_mockups')
            .select('print_area')
            .eq('product_template_id', selectedProduct.product_templates?.id)
            .eq('is_primary', true)
            .single();
          
          if (data?.print_area) {
            area = parsePrintArea(data.print_area);
            console.log('✅ [useDesignPositioning] Zone d\'impression du mockup (DB query) récupérée:', area);
          }
        } catch (mockupError) {
          console.warn('⚠️ [useDesignPositioning] Erreur récupération zone mockup (DB query):', mockupError);
        }
      }
      
      setDesignArea(area);
      
      // Calculer la position automatique si on a une URL de design
      if (designUrl && designUrl.trim() !== '') {
        try {
          const designDimensions = await getImageDimensions(designUrl);
          console.log('📐 [useDesignPositioning] Dimensions du design:', designDimensions);
          
          const autoPosition = calculateAutoPosition(designDimensions, area);
          
          const finalPosition = {
            x: autoPosition.x,
            y: autoPosition.y,
            width: autoPosition.width,
            height: autoPosition.height,
            rotation: 0,
            scale: autoPosition.scale
          };
          
          console.log('✅ [useDesignPositioning] Position automatique calculée:', finalPosition);
          setAutoDesignPosition(finalPosition);
          
        } catch (imageError) {
          console.warn('⚠️ [useDesignPositioning] Erreur chargement image design:', imageError);
          
          // Position centrée par défaut si l'image ne se charge pas
          const fallbackPosition = {
            x: area.x + (area.width * 0.1),
            y: area.y + (area.height * 0.1),
            width: area.width * 0.8,
            height: area.height * 0.8,
            rotation: 0,
            scale: 0.8
          };
          
          console.log('🔄 [useDesignPositioning] Position de fallback utilisée:', fallbackPosition);
          setAutoDesignPosition(fallbackPosition);
        }
      } else {
        // Pas de design, position par défaut dans la zone
        const defaultPosition = {
          x: area.x + (area.width * 0.1),
          y: area.y + (area.height * 0.1),
          width: area.width * 0.8,
          height: area.height * 0.8,
          rotation: 0,
          scale: 0.8
        };
        
        console.log('📍 [useDesignPositioning] Position par défaut (pas de design):', defaultPosition);
        setAutoDesignPosition(defaultPosition);
      }
      
    } catch (error) {
      console.error('❌ [useDesignPositioning] Erreur générale:', error);
      
      // Fallback complet en cas d'erreur
      const fallbackArea = { x: 50, y: 50, width: 200, height: 200 };
      const fallbackPosition = {
        x: fallbackArea.x + 20,
        y: fallbackArea.y + 20,
        width: fallbackArea.width - 40,
        height: fallbackArea.height - 40,
        rotation: 0,
        scale: 1
      };
      
      setDesignArea(fallbackArea);
      setAutoDesignPosition(fallbackPosition);
      
      console.log('🆘 [useDesignPositioning] Fallback complet utilisé');
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
