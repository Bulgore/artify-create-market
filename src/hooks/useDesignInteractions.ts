
import { useCallback } from 'react';

interface DesignPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface UseDesignInteractionsProps {
  position: DesignPosition;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  dragStart: { x: number; y: number };
  setDragStart: (start: { x: number; y: number }) => void;
  svgRef: React.RefObject<SVGSVGElement>;
  updatePosition: (position: DesignPosition) => void;
  imageLoaded: boolean;
}

export const useDesignInteractions = ({
  position,
  isDragging,
  setIsDragging,
  dragStart,
  setDragStart,
  svgRef,
  updatePosition,
  imageLoaded
}: UseDesignInteractionsProps) => {
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!imageLoaded) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      const scaleX = 400 / rect.width;
      const scaleY = 400 / rect.height;
      setDragStart({
        x: (e.clientX - rect.left) * scaleX - position.x,
        y: (e.clientY - rect.top) * scaleY - position.y
      });
    }
  }, [imageLoaded, position, setIsDragging, setDragStart, svgRef]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !imageLoaded) return;
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      const scaleX = 400 / rect.width;
      const scaleY = 400 / rect.height;
      const newX = (e.clientX - rect.left) * scaleX - dragStart.x;
      const newY = (e.clientY - rect.top) * scaleY - dragStart.y;
      
      updatePosition({
        ...position,
        x: newX,
        y: newY
      });
    }
  }, [isDragging, imageLoaded, position, dragStart, updatePosition, svgRef]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

  const handleSizeChange = useCallback((dimension: 'width' | 'height', value: number[]) => {
    updatePosition({
      ...position,
      [dimension]: value[0]
    });
  }, [position, updatePosition]);

  const handleRotationChange = useCallback((rotation: number[]) => {
    updatePosition({
      ...position,
      rotation: rotation[0]
    });
  }, [position, updatePosition]);

  const handleInputChange = useCallback((field: keyof DesignPosition, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updatePosition({
        ...position,
        [field]: numValue
      });
    }
  }, [position, updatePosition]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleSizeChange,
    handleRotationChange,
    handleInputChange
  };
};
