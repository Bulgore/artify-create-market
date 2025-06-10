
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
  
  // Désactiver toutes les interactions - affichage automatique seulement
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Plus d'interaction - le visuel reste en place
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Plus de déplacement possible
    e.preventDefault();
  }, []);

  const handleMouseUp = useCallback(() => {
    // Plus d'interaction
  }, []);

  // Désactiver les contrôles de taille - taille automatique
  const handleSizeChange = useCallback((dimension: 'width' | 'height', value: number[]) => {
    // Plus de redimensionnement manuel
  }, []);

  // Désactiver la rotation - toujours à 0°
  const handleRotationChange = useCallback((rotation: number[]) => {
    // Plus de rotation manuelle
  }, []);

  // Désactiver les inputs manuels - valeurs automatiques
  const handleInputChange = useCallback((field: keyof DesignPosition, value: string) => {
    // Plus de modification manuelle des valeurs
  }, []);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleSizeChange,
    handleRotationChange,
    handleInputChange
  };
};
