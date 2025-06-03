
import { useEffect } from 'react';
import { PrintArea } from '@/types/printArea';

interface UsePrintAreaSyncProps {
  svgArea: PrintArea;
  mockupArea?: PrintArea;
  onMockupAreaChange?: (area: PrintArea) => void;
  svgImageRef: React.RefObject<HTMLImageElement>;
  mockupImageRef: React.RefObject<HTMLImageElement>;
}

export const usePrintAreaSync = ({
  svgArea,
  mockupArea,
  onMockupAreaChange,
  svgImageRef,
  mockupImageRef
}: UsePrintAreaSyncProps) => {
  
  // Calculer les proportions exactes du SVG (largeur/hauteur de la zone par rapport à l'image)
  const getSvgProportions = () => {
    if (!svgImageRef.current) return { widthRatio: 0, heightRatio: 0, aspectRatio: 1 };
    
    const image = svgImageRef.current;
    const widthRatio = svgArea.width / image.naturalWidth;
    const heightRatio = svgArea.height / image.naturalHeight;
    const aspectRatio = svgArea.width / svgArea.height;
    
    return {
      widthRatio,
      heightRatio,
      aspectRatio
    };
  };

  // Synchroniser la zone mockup avec les proportions exactes du SVG
  const syncMockupToSvgProportions = () => {
    if (!mockupImageRef.current || !svgImageRef.current || !onMockupAreaChange || !mockupArea) {
      return;
    }

    const svgProps = getSvgProportions();
    const mockupImage = mockupImageRef.current;
    
    // Calculer la taille proportionnelle basée sur la largeur actuelle du mockup
    // et maintenir l'aspect ratio exact du SVG
    const newMockupWidth = mockupArea.width;
    const newMockupHeight = newMockupWidth / svgProps.aspectRatio;
    
    // S'assurer que la zone reste dans les limites de l'image mockup
    const maxWidth = mockupImage.naturalWidth - mockupArea.x;
    const maxHeight = mockupImage.naturalHeight - mockupArea.y;
    
    let finalWidth = newMockupWidth;
    let finalHeight = newMockupHeight;
    
    // Ajuster si la zone dépasse les limites
    if (finalWidth > maxWidth) {
      finalWidth = maxWidth;
      finalHeight = finalWidth / svgProps.aspectRatio;
    }
    
    if (finalHeight > maxHeight) {
      finalHeight = maxHeight;
      finalWidth = finalHeight * svgProps.aspectRatio;
    }

    const updatedMockupArea = {
      ...mockupArea,
      width: Math.max(50, finalWidth),
      height: Math.max(50, finalHeight)
    };

    console.log('Syncing mockup area to SVG proportions:', {
      svgAspectRatio: svgProps.aspectRatio,
      originalMockup: mockupArea,
      newMockup: updatedMockupArea
    });

    onMockupAreaChange(updatedMockupArea);
  };

  // Synchroniser automatiquement quand la zone SVG change
  useEffect(() => {
    if (svgImageRef.current && mockupImageRef.current && mockupArea && onMockupAreaChange) {
      // Petite temporisation pour éviter les boucles
      const timeoutId = setTimeout(() => {
        syncMockupToSvgProportions();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [svgArea.width, svgArea.height]);

  return {
    syncMockupToSvgProportions,
    getSvgProportions
  };
};
