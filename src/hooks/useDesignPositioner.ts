
import { useState, useRef, useCallback, useEffect } from 'react';

interface DesignPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface DesignArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UseDesignPositionerProps {
  designArea: DesignArea;
  initialPosition?: DesignPosition;
  onPositionChange: (position: DesignPosition) => void;
}

export const useDesignPositioner = ({
  designArea,
  initialPosition,
  onPositionChange
}: UseDesignPositionerProps) => {
  // Validate and ensure designArea has proper numeric values
  const validDesignArea = {
    x: (typeof designArea?.x === 'number' && !isNaN(designArea.x)) ? designArea.x : 50,
    y: (typeof designArea?.y === 'number' && !isNaN(designArea.y)) ? designArea.y : 50,
    width: (typeof designArea?.width === 'number' && !isNaN(designArea.width) && designArea.width > 0) ? designArea.width : 200,
    height: (typeof designArea?.height === 'number' && !isNaN(designArea.height) && designArea.height > 0) ? designArea.height : 200
  };

  const [position, setPosition] = useState<DesignPosition>(
    initialPosition || {
      x: validDesignArea.x + 10,
      y: validDesignArea.y + 10,
      width: Math.min(80, validDesignArea.width - 20),
      height: Math.min(80, validDesignArea.height - 20),
      rotation: 0
    }
  );

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const updatePosition = useCallback((newPosition: DesignPosition) => {
    const safePosition = {
      x: (typeof newPosition.x === 'number' && !isNaN(newPosition.x)) ? newPosition.x : validDesignArea.x + 10,
      y: (typeof newPosition.y === 'number' && !isNaN(newPosition.y)) ? newPosition.y : validDesignArea.y + 10,
      width: (typeof newPosition.width === 'number' && !isNaN(newPosition.width) && newPosition.width >= 10) ? newPosition.width : 80,
      height: (typeof newPosition.height === 'number' && !isNaN(newPosition.height) && newPosition.height >= 10) ? newPosition.height : 80,
      rotation: (typeof newPosition.rotation === 'number' && !isNaN(newPosition.rotation)) ? newPosition.rotation : 0
    };

    // Constrain position within design area
    const constrainedPosition = {
      ...safePosition,
      x: Math.max(validDesignArea.x, Math.min(validDesignArea.x + validDesignArea.width - safePosition.width, safePosition.x)),
      y: Math.max(validDesignArea.y, Math.min(validDesignArea.y + validDesignArea.height - safePosition.height, safePosition.y))
    };
    
    console.log('Updating position to:', constrainedPosition);
    setPosition(constrainedPosition);
    onPositionChange(constrainedPosition);
  }, [validDesignArea, onPositionChange]);

  const resetPosition = () => {
    const resetPos = {
      x: validDesignArea.x + 10,
      y: validDesignArea.y + 10,
      width: Math.min(80, validDesignArea.width - 20),
      height: Math.min(80, validDesignArea.height - 20),
      rotation: 0
    };
    updatePosition(resetPos);
  };

  return {
    position,
    validDesignArea,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    containerRef,
    svgRef,
    updatePosition,
    resetPosition
  };
};
