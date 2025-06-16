
import { useState, useEffect, useRef } from 'react';
import { PrintArea, ViewType } from '@/types/printArea';

interface UseCanvasInteractionProps {
  svgCanvasRef: React.RefObject<HTMLCanvasElement>;
  mockupCanvasRef: React.RefObject<HTMLCanvasElement>;
  svgImageRef: React.RefObject<HTMLImageElement>;
  mockupImageRef: React.RefObject<HTMLImageElement>;
  printArea: PrintArea;
  mockupPrintArea?: PrintArea;
  onPrintAreaChange: (area: PrintArea) => void;
  onMockupPrintAreaChange?: (area: PrintArea) => void;
}

export const useCanvasInteraction = ({
  svgCanvasRef,
  mockupCanvasRef,
  svgImageRef,
  mockupImageRef,
  printArea,
  mockupPrintArea,
  onPrintAreaChange,
  onMockupPrintAreaChange
}: UseCanvasInteractionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeView, setActiveView] = useState<ViewType>('svg');
  const animationFrameRef = useRef<number>();

  const currentSvgArea = printArea;
  const currentMockupArea = mockupPrintArea || { x: 50, y: 50, width: 200, height: 200 };

  // Fonction pour obtenir les coordonnées relatives du canvas
  const getCanvasCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement | null,
    image: HTMLImageElement | null
  ) => {
    if (!canvas || !image) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = image.width / rect.width;
    const scaleY = image.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  // Fonction pour vérifier si on clique sur la poignée de redimensionnement
  const isPointInResizeHandle = (x: number, y: number, area: PrintArea) => {
    const handleSize = 8;
    const handleX = area.x + area.width - handleSize / 2;
    const handleY = area.y + area.height - handleSize / 2;
    
    return x >= handleX - handleSize && x <= handleX + handleSize &&
           y >= handleY - handleSize && y <= handleY + handleSize;
  };

  // Fonction pour vérifier si on clique dans la zone
  const isPointInArea = (x: number, y: number, area: PrintArea) => {
    return x >= area.x && x <= area.x + area.width &&
           y >= area.y && y <= area.y + area.height;
  };

  // Fonction pour contraindre la zone aux limites de l'image
  const constrainAreaToBounds = (area: PrintArea, imageWidth: number, imageHeight: number): PrintArea => {
    return {
      x: Math.max(0, Math.min(area.x, imageWidth - area.width)),
      y: Math.max(0, Math.min(area.y, imageHeight - area.height)),
      width: Math.max(10, Math.min(area.width, imageWidth - area.x)),
      height: Math.max(10, Math.min(area.height, imageHeight - area.y))
    };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>, type: ViewType) => {
    e.preventDefault();
    setActiveView(type);
    
    const canvas = type === 'svg' ? svgCanvasRef.current : mockupCanvasRef.current;
    const image = type === 'svg' ? svgImageRef.current : mockupImageRef.current;
    const { x, y } = getCanvasCoordinates(e, canvas, image);
    setDragStart({ x, y });

    const area = type === 'svg' ? currentSvgArea : currentMockupArea;
    
    if (!image) return;
    
    // Vérifier si on clique sur la poignée de redimensionnement
    if (isPointInResizeHandle(x, y, area)) {
      setIsResizing(true);
    } else if (isPointInArea(x, y, area)) {
      setIsDragging(true);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging && !isResizing) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const canvas = activeView === 'svg' ? svgCanvasRef.current : mockupCanvasRef.current;
      const image = activeView === 'svg' ? svgImageRef.current : mockupImageRef.current;
      const { x, y } = getCanvasCoordinates(e, canvas, image);
      
      if (!image) return;

      const area = activeView === 'svg' ? currentSvgArea : currentMockupArea;
      const onChange = activeView === 'svg' ? onPrintAreaChange : onMockupPrintAreaChange;

      if (!onChange) return;

      if (isDragging) {
        const deltaX = x - dragStart.x;
        const deltaY = y - dragStart.y;
        
        const newArea = constrainAreaToBounds({
          ...area,
          x: area.x + deltaX,
          y: area.y + deltaY
        }, image.width, image.height);

        onChange(newArea);
        setDragStart({ x, y });
      } else if (isResizing) {
        const newWidth = Math.max(50, x - area.x);
        const newHeight = Math.max(50, y - area.y);
        
        const newArea = constrainAreaToBounds({
          ...area,
          width: newWidth,
          height: newHeight
        }, image.width, image.height);

        onChange(newArea);
      }
    });
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleInputChange = (field: keyof PrintArea, value: number, type: ViewType) => {
    const area = type === 'svg' ? currentSvgArea : currentMockupArea;
    const onChange = type === 'svg' ? onPrintAreaChange : onMockupPrintAreaChange;
    
    if (!onChange) return;

    const newArea = { ...area, [field]: Math.max(0, value) };
    onChange(newArea);
  };

  // Nettoyage des event listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    currentSvgArea,
    currentMockupArea,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleInputChange,
    isDragging,
    isResizing
  };
};
