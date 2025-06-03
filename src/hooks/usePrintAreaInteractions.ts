
import { useState, useEffect } from 'react';
import { PrintArea, ViewType } from '@/types/printArea';
import { getCanvasCoordinates, isPointInResizeHandle, isPointInArea, constrainAreaToBounds } from '@/utils/printAreaUtils';
import { usePrintAreaSync } from './usePrintAreaSync';
import { useMockupAreaInteractions } from './useMockupAreaInteractions';

interface UsePrintAreaInteractionsProps {
  svgCanvasRef: React.RefObject<HTMLCanvasElement>;
  mockupCanvasRef: React.RefObject<HTMLCanvasElement>;
  svgImageRef: React.RefObject<HTMLImageElement>;
  mockupImageRef: React.RefObject<HTMLImageElement>;
  printArea: PrintArea;
  mockupPrintArea?: PrintArea;
  onPrintAreaChange: (area: PrintArea) => void;
  onMockupPrintAreaChange?: (area: PrintArea) => void;
}

export const usePrintAreaInteractions = ({
  svgCanvasRef,
  mockupCanvasRef,
  svgImageRef,
  mockupImageRef,
  printArea,
  mockupPrintArea,
  onPrintAreaChange,
  onMockupPrintAreaChange
}: UsePrintAreaInteractionsProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeView, setActiveView] = useState<ViewType>('svg');

  const currentSvgArea = printArea;
  const currentMockupArea = mockupPrintArea || { x: 50, y: 50, width: 200, height: 200 };

  // Hook de synchronisation des proportions
  const { getSvgProportions } = usePrintAreaSync({
    svgArea: currentSvgArea,
    mockupArea: currentMockupArea,
    onMockupAreaChange: onMockupPrintAreaChange,
    svgImageRef,
    mockupImageRef
  });

  // Hook pour les interactions spécifiques au mockup
  const { handleMockupInputChange, handleMockupCanvasInteraction } = useMockupAreaInteractions({
    mockupCanvasRef,
    mockupImageRef,
    mockupArea: currentMockupArea,
    onMockupAreaChange: onMockupPrintAreaChange || (() => {}),
    getSvgProportions
  });

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>, type: ViewType) => {
    e.preventDefault();
    setActiveView(type);
    
    const canvas = type === 'svg' ? svgCanvasRef.current : mockupCanvasRef.current;
    const image = type === 'svg' ? svgImageRef.current : mockupImageRef.current;
    const { x, y } = getCanvasCoordinates(e, canvas, image);
    setDragStart({ x, y });

    const area = type === 'svg' ? currentSvgArea : currentMockupArea;
    
    if (!image) return;
    
    // Check if clicking on resize handle
    const handleSize = 8 / (canvas?.width || 1) * (image.width || 1);
    const isOnHandle = isPointInResizeHandle(x, y, area, handleSize);

    if (isOnHandle) {
      setIsResizing(true);
    } else if (isPointInArea(x, y, area)) {
      setIsDragging(true);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging && !isResizing) return;

    if (activeView === 'svg') {
      // Logique existante pour SVG
      const canvas = svgCanvasRef.current;
      const image = svgImageRef.current;
      const { x, y } = getCanvasCoordinates(e, canvas, image);
      
      if (!image) return;

      if (isDragging) {
        const deltaX = x - dragStart.x;
        const deltaY = y - dragStart.y;
        
        const newArea = constrainAreaToBounds({
          ...currentSvgArea,
          x: currentSvgArea.x + deltaX,
          y: currentSvgArea.y + deltaY
        }, image.width, image.height);

        onPrintAreaChange(newArea);
        setDragStart({ x, y });
      } else if (isResizing) {
        const newWidth = Math.max(50, x - currentSvgArea.x);
        const newHeight = Math.max(50, y - currentSvgArea.y);
        
        const newArea = constrainAreaToBounds({
          ...currentSvgArea,
          width: newWidth,
          height: newHeight
        }, image.width, image.height);

        onPrintAreaChange(newArea);
      }
    } else if (activeView === 'mockup' && onMockupPrintAreaChange) {
      // Utiliser la logique spécialisée pour mockup
      const interactionType = isDragging ? 'drag' : 'resize';
      const result = handleMockupCanvasInteraction(e, interactionType, dragStart);
      
      if (result && isDragging) {
        setDragStart(result);
      }
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleInputChange = (field: keyof PrintArea, value: number, type: ViewType) => {
    if (type === 'svg') {
      const newArea = { ...currentSvgArea, [field]: Math.max(0, value) };
      onPrintAreaChange(newArea);
    } else if (type === 'mockup') {
      handleMockupInputChange(field, value);
    }
  };

  // Global mouse up handler
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return {
    currentSvgArea,
    currentMockupArea,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleInputChange
  };
};
