
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
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Position automatique centrée - plus de déplacement manuel
  const calculateOptimalPosition = useCallback((designImageUrl?: string) => {
    // Taille maximale possible dans la zone d'impression
    const maxWidth = designArea.width * 0.8; // 80% de la zone pour avoir de la marge
    const maxHeight = designArea.height * 0.8;
    
    // Position centrée dans la zone d'impression
    const centerX = designArea.x + (designArea.width - maxWidth) / 2;
    const centerY = designArea.y + (designArea.height - maxHeight) / 2;
    
    return {
      x: centerX,
      y: centerY,
      width: maxWidth,
      height: maxHeight,
      rotation: 0
    };
  }, [designArea]);

  const [position, setPosition] = useState<DesignPosition>(() => 
    initialPosition || calculateOptimalPosition()
  );

  // Valider la zone d'impression avec fallbacks sécurisés
  const validDesignArea = {
    x: designArea?.x || 50,
    y: designArea?.y || 50,
    width: designArea?.width || 200,
    height: designArea?.height || 200
  };

  // États pour la compatibilité (mais plus d'interactions)
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Recalculer la position quand la zone d'impression change
  useEffect(() => {
    const newPosition = calculateOptimalPosition();
    setPosition(newPosition);
    onPositionChange(newPosition);
  }, [designArea, calculateOptimalPosition, onPositionChange]);

  // Mise à jour automatique de la position - plus de drag
  const updatePosition = useCallback((newPosition: DesignPosition) => {
    // S'assurer que la position reste centrée et optimale
    const optimalPosition = calculateOptimalPosition();
    setPosition(optimalPosition);
    onPositionChange(optimalPosition);
  }, [calculateOptimalPosition, onPositionChange]);

  // Réinitialisation - recentre automatiquement
  const resetPosition = useCallback(() => {
    const optimalPosition = calculateOptimalPosition();
    setPosition(optimalPosition);
    onPositionChange(optimalPosition);
  }, [calculateOptimalPosition, onPositionChange]);

  return {
    position,
    validDesignArea,
    isDragging: false, // Toujours false - plus d'interaction
    setIsDragging: () => {}, // Fonction vide
    dragStart,
    setDragStart: () => {}, // Fonction vide
    containerRef,
    svgRef,
    updatePosition,
    resetPosition
  };
};
