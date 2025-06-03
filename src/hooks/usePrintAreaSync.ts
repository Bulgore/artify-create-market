
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
  
  // Calculer les proportions du SVG
  const getSvgProportions = () => {
    if (!svgImageRef.current) return { widthRatio: 0, heightRatio: 0 };
    
    const image = svgImageRef.current;
    return {
      widthRatio: svgArea.width / image.naturalWidth,
      heightRatio: svgArea.height / image.naturalHeight
    };
  };

  // Synchroniser la zone mockup avec les proportions SVG
  const syncMockupToSvgProportions = () => {
    if (!mockupImageRef.current || !svgImageRef.current || !onMockupAreaChange || !mockupArea) {
      return;
    }

    const svgProps = getSvgProportions();
    const mockupImage = mockupImageRef.current;
    
    // Calculer la nouvelle taille proportionnelle pour le mockup
    const newMockupWidth = mockupImage.naturalWidth * svgProps.widthRatio;
    const newMockupHeight = mockupImage.naturalHeight * svgProps.heightRatio;
    
    // Conserver la position actuelle mais ajuster la taille
    const updatedMockupArea = {
      ...mockupArea,
      width: newMockupWidth,
      height: newMockupHeight
    };

    console.log('Syncing mockup area to SVG proportions:', {
      svgProps,
      originalMockup: mockupArea,
      newMockup: updatedMockupArea
    });

    onMockupAreaChange(updatedMockupArea);
  };

  // Synchroniser quand la zone SVG change
  useEffect(() => {
    if (svgImageRef.current && mockupImageRef.current && mockupArea) {
      syncMockupToSvgProportions();
    }
  }, [svgArea.width, svgArea.height]);

  return {
    syncMockupToSvgProportions,
    getSvgProportions
  };
};
