
import { DesignArea } from '@/types/designArea';

export interface AutoPositionResult {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
}

/**
 * Calcule le positionnement automatique d'un design dans une zone d'impression
 * Logique "contain" : le design s'affiche entièrement, au plus grand possible
 */
export const calculateAutoPosition = (
  designDimensions: { width: number; height: number },
  printArea: DesignArea
): AutoPositionResult => {
  console.log('🎯 Calcul position automatique:', { designDimensions, printArea });

  // Calculer le ratio de mise à l'échelle pour que le design rentre entièrement
  const scaleX = printArea.width / designDimensions.width;
  const scaleY = printArea.height / designDimensions.height;
  
  // Prendre la plus petite échelle pour garantir que tout rentre (logique "contain")
  const scale = Math.min(scaleX, scaleY);
  
  // Nouvelles dimensions du design après mise à l'échelle
  const scaledWidth = designDimensions.width * scale;
  const scaledHeight = designDimensions.height * scale;
  
  // Centrer le design dans la zone d'impression
  const x = printArea.x + (printArea.width - scaledWidth) / 2;
  const y = printArea.y + (printArea.height - scaledHeight) / 2;
  
  const result = {
    x,
    y,
    width: scaledWidth,
    height: scaledHeight,
    scale
  };
  
  console.log('✅ Position calculée:', result);
  return result;
};

/**
 * Obtient les dimensions d'une image à partir de son URL
 */
export const getImageDimensions = (imageUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    
    img.onerror = () => {
      reject(new Error('Impossible de charger l\'image'));
    };
    
    img.src = imageUrl;
  });
};
