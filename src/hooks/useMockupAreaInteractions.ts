
import { PrintArea } from '@/types/printArea';
import { getCanvasCoordinates, isPointInArea, constrainAreaToBounds } from '@/utils/printAreaUtils';

interface UseMockupAreaInteractionsProps {
  mockupCanvasRef: React.RefObject<HTMLCanvasElement>;
  mockupImageRef: React.RefObject<HTMLImageElement>;
  mockupArea: PrintArea;
  onMockupAreaChange: (area: PrintArea) => void;
  getSvgProportions: () => { widthRatio: number; heightRatio: number; aspectRatio: number };
}

export const useMockupAreaInteractions = ({
  mockupCanvasRef,
  mockupImageRef,
  mockupArea,
  onMockupAreaChange,
  getSvgProportions
}: UseMockupAreaInteractionsProps) => {

  const handleMockupInputChange = (field: keyof PrintArea, value: number) => {
    if (!mockupImageRef.current) return;

    const svgProps = getSvgProportions();
    const mockupImage = mockupImageRef.current;
    
    let newArea = { ...mockupArea };

    if (field === 'x' || field === 'y') {
      // Position libre - pas de contrainte proportionnelle
      newArea[field] = Math.max(0, value);
    } else if (field === 'width') {
      // Largeur avec maintien des proportions exactes
      const newWidth = Math.max(50, value);
      const newHeight = newWidth / svgProps.aspectRatio;
      newArea.width = newWidth;
      newArea.height = newHeight;
    } else if (field === 'height') {
      // Hauteur avec maintien des proportions exactes
      const newHeight = Math.max(50, value);
      const newWidth = newHeight * svgProps.aspectRatio;
      newArea.width = newWidth;
      newArea.height = newHeight;
    }

    // Contraindre dans les limites de l'image
    newArea = constrainAreaToBounds(newArea, mockupImage.naturalWidth, mockupImage.naturalHeight);
    
    console.log('Mockup area change:', { 
      field, 
      value, 
      aspectRatio: svgProps.aspectRatio,
      newArea 
    });
    
    onMockupAreaChange(newArea);
  };

  const handleMockupCanvasInteraction = (
    e: React.MouseEvent<HTMLCanvasElement>,
    interactionType: 'drag' | 'resize',
    dragStart: { x: number; y: number }
  ) => {
    const canvas = mockupCanvasRef.current;
    const image = mockupImageRef.current;
    
    if (!canvas || !image) return;

    const { x, y } = getCanvasCoordinates(e, canvas, image);
    
    if (interactionType === 'drag') {
      // Déplacement simple sans changement de taille
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      
      const newArea = constrainAreaToBounds({
        ...mockupArea,
        x: mockupArea.x + deltaX,
        y: mockupArea.y + deltaY
      }, image.naturalWidth, image.naturalHeight);

      onMockupAreaChange(newArea);
      return { x, y };
    } else if (interactionType === 'resize') {
      // Redimensionnement avec maintien des proportions exactes
      const svgProps = getSvgProportions();
      
      // Calculer la nouvelle largeur basée sur la position de la souris
      const newWidth = Math.max(50, x - mockupArea.x);
      // Calculer la hauteur proportionnelle exacte
      const newHeight = newWidth / svgProps.aspectRatio;
      
      const newArea = constrainAreaToBounds({
        ...mockupArea,
        width: newWidth,
        height: newHeight
      }, image.naturalWidth, image.naturalHeight);

      onMockupAreaChange(newArea);
    }

    return { x, y };
  };

  return {
    handleMockupInputChange,
    handleMockupCanvasInteraction
  };
};
