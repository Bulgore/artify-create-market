
import { PrintArea } from '@/types/printArea';
import { getCanvasCoordinates, isPointInArea, constrainAreaToBounds } from '@/utils/printAreaUtils';

interface UseMockupAreaInteractionsProps {
  mockupCanvasRef: React.RefObject<HTMLCanvasElement>;
  mockupImageRef: React.RefObject<HTMLImageElement>;
  mockupArea: PrintArea;
  onMockupAreaChange: (area: PrintArea) => void;
  getSvgProportions: () => { widthRatio: number; heightRatio: number };
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
      // Position libre
      newArea[field] = Math.max(0, value);
    } else if (field === 'width') {
      // Largeur proportionnelle
      const newWidth = Math.max(50, value);
      const newHeight = newWidth * (svgProps.heightRatio / svgProps.widthRatio);
      newArea.width = newWidth;
      newArea.height = newHeight;
    } else if (field === 'height') {
      // Hauteur proportionnelle
      const newHeight = Math.max(50, value);
      const newWidth = newHeight * (svgProps.widthRatio / svgProps.heightRatio);
      newArea.width = newWidth;
      newArea.height = newHeight;
    }

    // Contraindre dans les limites de l'image
    newArea = constrainAreaToBounds(newArea, mockupImage.naturalWidth, mockupImage.naturalHeight);
    
    console.log('Mockup area change:', { field, value, newArea, svgProps });
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
      const svgProps = getSvgProportions();
      
      // Calculer la nouvelle largeur basée sur la position de la souris
      const newWidth = Math.max(50, x - mockupArea.x);
      // Calculer la hauteur proportionnelle
      const newHeight = newWidth * (svgProps.heightRatio / svgProps.widthRatio);
      
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
