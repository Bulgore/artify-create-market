
import { useState, useRef, useCallback, useMemo } from 'react';

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
  // Valider et nettoyer designArea avec des valeurs par défaut sûres
  const validDesignArea = useMemo(() => {
    const safeArea = {
      x: (typeof designArea?.x === 'number' && !isNaN(designArea.x)) ? designArea.x : 50,
      y: (typeof designArea?.y === 'number' && !isNaN(designArea.y)) ? designArea.y : 50,
      width: (typeof designArea?.width === 'number' && !isNaN(designArea.width) && designArea.width > 0) ? designArea.width : 200,
      height: (typeof designArea?.height === 'number' && !isNaN(designArea.height) && designArea.height > 0) ? designArea.height : 200
    };
    
    console.log('🎯 ValidDesignArea computed:', safeArea);
    return safeArea;
  }, [designArea]);

  // Position initiale du design avec des valeurs par défaut sûres
  const defaultPosition = useMemo((): DesignPosition => ({
    x: validDesignArea.x + 10,
    y: validDesignArea.y + 10,
    width: Math.min(80, validDesignArea.width - 20),
    height: Math.min(80, validDesignArea.height - 20),
    rotation: 0
  }), [validDesignArea]);

  const [position, setPosition] = useState<DesignPosition>(
    initialPosition || defaultPosition
  );

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  console.log('🎯 Current position:', position);

  const updatePosition = useCallback((newPosition: DesignPosition) => {
    // Valider toutes les propriétés de la nouvelle position
    const safePosition = {
      x: (typeof newPosition.x === 'number' && !isNaN(newPosition.x)) ? newPosition.x : defaultPosition.x,
      y: (typeof newPosition.y === 'number' && !isNaN(newPosition.y)) ? newPosition.y : defaultPosition.y,
      width: (typeof newPosition.width === 'number' && !isNaN(newPosition.width) && newPosition.width >= 10) ? newPosition.width : defaultPosition.width,
      height: (typeof newPosition.height === 'number' && !isNaN(newPosition.height) && newPosition.height >= 10) ? newPosition.height : defaultPosition.height,
      rotation: (typeof newPosition.rotation === 'number' && !isNaN(newPosition.rotation)) ? newPosition.rotation : 0
    };

    // Contraindre la position dans la zone d'impression
    const constrainedPosition = {
      ...safePosition,
      x: Math.max(validDesignArea.x, Math.min(validDesignArea.x + validDesignArea.width - safePosition.width, safePosition.x)),
      y: Math.max(validDesignArea.y, Math.min(validDesignArea.y + validDesignArea.height - safePosition.height, safePosition.y))
    };
    
    console.log('🔄 Updating position from:', position, 'to:', constrainedPosition);
    setPosition(constrainedPosition);
    onPositionChange(constrainedPosition);
  }, [validDesignArea, onPositionChange, position, defaultPosition]);

  const resetPosition = useCallback(() => {
    console.log('🔄 Resetting position to:', defaultPosition);
    updatePosition(defaultPosition);
  }, [updatePosition, defaultPosition]);

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
