
import { useState, useEffect, useCallback } from 'react';
import { PrintArea, ViewType } from '@/types/printArea';
import { getCanvasCoordinates, isPointInResizeHandle, isPointInArea, constrainAreaToBounds } from '@/utils/printAreaUtils';

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
  const [initialArea, setInitialArea] = useState<PrintArea | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('svg');

  const currentSvgArea = printArea;
  const currentMockupArea = mockupPrintArea || { x: 50, y: 50, width: 200, height: 200 };

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>, type: ViewType) => {
    e.preventDefault();
    e.stopPropagation();
    
    setActiveView(type);
    
    const canvas = type === 'svg' ? svgCanvasRef.current : mockupCanvasRef.current;
    const image = type === 'svg' ? svgImageRef.current : mockupImageRef.current;
    
    if (!canvas || !image) return;
    
    const { x, y } = getCanvasCoordinates(e, canvas, image);
    const area = type === 'svg' ? currentSvgArea : currentMockupArea;
    
    console.log('Mouse down at:', { x, y }, 'Canvas area:', area);
    
    setDragStart({ x, y });
    setInitialArea({ ...area });

    // Calculate handle size based on image dimensions
    const handleSize = Math.max(8, image.naturalWidth / 50);
    const isOnHandle = isPointInResizeHandle(x, y, area, handleSize);

    if (isOnHandle) {
      console.log('Starting resize operation');
      setIsResizing(true);
      setIsDragging(false);
    } else if (isPointInArea(x, y, area)) {
      console.log('Starting drag operation');
      setIsDragging(true);
      setIsResizing(false);
    } else {
      console.log('Click outside area');
      setIsDragging(false);
      setIsResizing(false);
    }
  }, [svgCanvasRef, mockupCanvasRef, svgImageRef, mockupImageRef, currentSvgArea, currentMockupArea]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging && !isResizing) return;
    if (!initialArea) return;

    e.preventDefault();
    e.stopPropagation();

    const canvas = activeView === 'svg' ? svgCanvasRef.current : mockupCanvasRef.current;
    const image = activeView === 'svg' ? svgImageRef.current : mockupImageRef.current;
    
    if (!canvas || !image) return;

    const { x, y } = getCanvasCoordinates(e, canvas, image);
    const onChange = activeView === 'svg' ? onPrintAreaChange : onMockupPrintAreaChange;

    if (!onChange) return;

    if (isDragging) {
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      
      const newArea = constrainAreaToBounds({
        ...initialArea,
        x: initialArea.x + deltaX,
        y: initialArea.y + deltaY
      }, image.naturalWidth, image.naturalHeight);

      console.log('Dragging to new position:', newArea);
      onChange(newArea);
    } else if (isResizing) {
      // Calculate new dimensions from initial area position
      const newWidth = Math.max(50, x - initialArea.x);
      const newHeight = Math.max(50, y - initialArea.y);
      
      const newArea = constrainAreaToBounds({
        ...initialArea,
        width: newWidth,
        height: newHeight
      }, image.naturalWidth, image.naturalHeight);

      console.log('Resizing to new dimensions:', newArea);
      onChange(newArea);
    }
  }, [isDragging, isResizing, activeView, initialArea, dragStart, onPrintAreaChange, onMockupPrintAreaChange, svgCanvasRef, mockupCanvasRef, svgImageRef, mockupImageRef]);

  const handleCanvasMouseUp = useCallback(() => {
    console.log('Mouse up - ending interaction');
    setIsDragging(false);
    setIsResizing(false);
    setInitialArea(null);
  }, []);

  const handleInputChange = useCallback((field: keyof PrintArea, value: number, type: ViewType) => {
    const area = type === 'svg' ? currentSvgArea : currentMockupArea;
    const onChange = type === 'svg' ? onPrintAreaChange : onMockupPrintAreaChange;
    
    if (!onChange) return;

    const newArea = { ...area, [field]: Math.max(0, value) };
    console.log(`Input change: ${field} = ${value}`, newArea);
    onChange(newArea);
  }, [currentSvgArea, currentMockupArea, onPrintAreaChange, onMockupPrintAreaChange]);

  // Global mouse up handler
  useEffect(() => {
    const handleGlobalMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
      setIsResizing(false);
      setInitialArea(null);
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      // Prevent text selection during drag
      if (isDragging || isResizing) {
        e.preventDefault();
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mousemove', handleGlobalMouseMove);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, isResizing]);

  return {
    currentSvgArea,
    currentMockupArea,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleInputChange
  };
};
