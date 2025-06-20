
import { PrintArea } from '@/types/printArea';

export interface AutoPositionResult {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
}

/**
 * Calcule le positionnement automatique PROFESSIONNEL d'un design dans une zone d'impression
 * Utilise la logique "contain" stricte : le design s'affiche entièrement, au plus grand possible, centré
 * AMÉLIORATION: Assure un minimum de 25% d'utilisation de la zone pour éviter les designs trop petits
 */
export const calculateAutoPosition = (
  designDimensions: { width: number; height: number },
  printArea: PrintArea
): AutoPositionResult => {
  console.log('🎯 Calcul position automatique PROFESSIONNEL AMÉLIORÉ:', { 
    designDimensions, 
    printArea 
  });

  // Validation des données d'entrée
  if (!designDimensions.width || !designDimensions.height || designDimensions.width <= 0 || designDimensions.height <= 0) {
    console.error('❌ Dimensions du design invalides:', designDimensions);
    throw new Error('Dimensions du design invalides');
  }

  if (!printArea.width || !printArea.height || printArea.width <= 0 || printArea.height <= 0) {
    console.error('❌ Zone d\'impression invalide:', printArea);
    throw new Error('Zone d\'impression invalide');
  }

  // 1. Calculer le facteur d'agrandissement maximal (logique "contain" stricte)
  const scaleX = printArea.width / designDimensions.width;
  const scaleY = printArea.height / designDimensions.height;
  
  // 2. Prendre la plus petite échelle pour garantir que tout rentre (jamais de débordement)
  let scale = Math.min(scaleX, scaleY);
  
  // 3. AMÉLIORATION: Assurer un minimum de 25% d'utilisation de la zone d'impression
  // Si le design est trop petit par rapport à la zone, on l'agrandit jusqu'à 25% minimum
  const minUsageRatio = 0.25;
  const currentUsageX = (designDimensions.width * scale) / printArea.width;
  const currentUsageY = (designDimensions.height * scale) / printArea.height;
  const currentUsage = Math.max(currentUsageX, currentUsageY);
  
  if (currentUsage < minUsageRatio) {
    const boostFactor = minUsageRatio / currentUsage;
    scale = scale * boostFactor;
    console.log('📈 Design trop petit, agrandissement appliqué:', {
      usageOriginale: Math.round(currentUsage * 100) + '%',
      usageAmelioree: Math.round(minUsageRatio * 100) + '%',
      facteurBoost: boostFactor.toFixed(2)
    });
  }
  
  console.log('📊 Calculs d\'échelle AMÉLIORÉS:', {
    scaleX: scaleX.toFixed(4),
    scaleY: scaleY.toFixed(4),
    scaleBase: Math.min(scaleX, scaleY).toFixed(4),
    scaleFinal: scale.toFixed(4),
    pourcentage: Math.round(scale * 100) + '%'
  });
  
  // 4. Nouvelles dimensions du design après mise à l'échelle
  const scaledWidth = designDimensions.width * scale;
  const scaledHeight = designDimensions.height * scale;
  
  // 5. Centrer EXACTEMENT le design dans la zone d'impression
  const posX = printArea.x + (printArea.width - scaledWidth) / 2;
  const posY = printArea.y + (printArea.height - scaledHeight) / 2;
  
  const result = {
    x: posX,
    y: posY,
    width: scaledWidth,
    height: scaledHeight,
    scale
  };
  
  // Vérifications de qualité AMÉLIORÉES
  const verification = {
    designRentreCompletement: 
      posX >= printArea.x && 
      posY >= printArea.y && 
      posX + scaledWidth <= printArea.x + printArea.width && 
      posY + scaledHeight <= printArea.y + printArea.height,
    designEstCentre: 
      Math.abs((posX - printArea.x) - (printArea.x + printArea.width - posX - scaledWidth)) < 1 &&
      Math.abs((posY - printArea.y) - (printArea.y + printArea.height - posY - scaledHeight)) < 1,
    utilisationProfessionnelle: scale >= minUsageRatio,
    pourcentageUtilisation: Math.round(Math.max(scaledWidth / printArea.width, scaledHeight / printArea.height) * 100)
  };
  
  console.log('✅ Position PROFESSIONNELLE AMÉLIORÉE calculée:', {
    designOriginal: designDimensions,
    zoneImpression: printArea,
    facteurEchelle: scale,
    nouvelleTaille: { width: scaledWidth, height: scaledHeight },
    positionCentree: { x: posX, y: posY },
    pourcentageAgrandissement: Math.round(scale * 100) + '%',
    verification
  });
  
  if (!verification.designRentreCompletement) {
    console.warn('⚠️ Le design ne rentre pas complètement dans la zone !');
  }
  
  if (!verification.utilisationProfessionnelle) {
    console.warn('⚠️ Utilisation de la zone d\'impression trop faible (<25%) !');
  }
  
  return result;
};

/**
 * Obtient les dimensions EXACTES d'une image à partir de son URL
 */
export const getImageDimensions = (imageUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    console.log('📐 Chargement dimensions pour:', imageUrl.substring(0, 50) + '...');
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    const timeout = setTimeout(() => {
      console.error('❌ Timeout lors du chargement de l\'image');
      reject(new Error('Timeout lors du chargement de l\'image'));
    }, 10000); // 10 secondes de timeout
    
    img.onload = () => {
      clearTimeout(timeout);
      
      const dimensions = {
        width: img.naturalWidth,
        height: img.naturalHeight
      };
      
      console.log('✅ Dimensions récupérées:', dimensions);
      
      if (dimensions.width <= 0 || dimensions.height <= 0) {
        reject(new Error('Dimensions d\'image invalides'));
        return;
      }
      
      resolve(dimensions);
    };
    
    img.onerror = (error) => {
      clearTimeout(timeout);
      console.error('❌ Erreur lors du chargement de l\'image:', error);
      reject(new Error('Impossible de charger l\'image pour obtenir ses dimensions'));
    };
    
    img.src = imageUrl;
  });
};
