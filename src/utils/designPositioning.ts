
import { DesignArea } from '@/types/designArea';

export interface AutoPositionResult {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
}

/**
 * Calcule le positionnement automatique PROFESSIONNEL d'un design dans une zone d'impression
 * Logique "contain" : le design s'affiche entièrement, au plus grand possible, centré
 * EXACTEMENT comme sur Printful/Printify
 */
export const calculateAutoPosition = (
  designDimensions: { width: number; height: number },
  printArea: DesignArea
): AutoPositionResult => {
  console.log('🎯 Calcul position automatique PROFESSIONNEL:', { designDimensions, printArea });

  // 1. Calculer le facteur d'agrandissement maximal pour que le design rentre entièrement
  const scaleX = printArea.width / designDimensions.width;
  const scaleY = printArea.height / designDimensions.height;
  
  // 2. Prendre la plus petite échelle pour garantir que tout rentre (logique "contain")
  const scale = Math.min(scaleX, scaleY);
  
  // 3. Nouvelles dimensions du design après mise à l'échelle MAXIMALE
  const newWidth = designDimensions.width * scale;
  const newHeight = designDimensions.height * scale;
  
  // 4. Centrer EXACTEMENT le design dans la zone d'impression
  const posX = printArea.x + (printArea.width - newWidth) / 2;
  const posY = printArea.y + (printArea.height - newHeight) / 2;
  
  const result = {
    x: posX,
    y: posY,
    width: newWidth,
    height: newHeight,
    scale
  };
  
  console.log('✅ Position PROFESSIONNELLE calculée:', {
    designOriginal: designDimensions,
    zoneImpression: printArea,
    facteurEchelle: scale,
    nouvelleTaille: { width: newWidth, height: newHeight },
    positionCentree: { x: posX, y: posY },
    pourcentageAgrandissement: Math.round(scale * 100) + '%'
  });
  
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
      console.log('📐 Dimensions du design récupérées:', {
        url: imageUrl.substring(0, 50) + '...',
        largeur: img.naturalWidth,
        hauteur: img.naturalHeight
      });
      
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    
    img.onerror = () => {
      console.error('❌ Impossible de charger l\'image pour obtenir ses dimensions');
      reject(new Error('Impossible de charger l\'image'));
    };
    
    img.src = imageUrl;
  });
};
