
import React from 'react';
import type { AutoPositionResult } from '@/utils/designPositioning';

interface DesignOverlayProps {
  designUrl: string;
  autoPosition: AutoPositionResult;
  containerWidth: number;
  containerHeight: number;
  onLoad: () => void;
  onError: () => void;
}

export const DesignOverlay: React.FC<DesignOverlayProps> = ({
  designUrl,
  autoPosition,
  containerWidth = 400,
  containerHeight = 300,
  onLoad,
  onError
}) => {
  // Position EXACTE calculée automatiquement - AUCUNE interaction manuelle possible
  const style = {
    left: `${(autoPosition.x / containerWidth) * 100}%`,
    top: `${(autoPosition.y / containerHeight) * 100}%`,
    width: `${(autoPosition.width / containerWidth) * 100}%`,
    height: `${(autoPosition.height / containerHeight) * 100}%`,
    pointerEvents: 'none' as const // INTERDIRE toute interaction utilisateur
  };

  return (
    <div 
      className="absolute pointer-events-none" 
      style={style}
      title={`Design automatiquement centré et agrandi (échelle: ${Math.round(autoPosition.scale * 100)}%)`}
    >
      <img
        src={designUrl}
        alt="Design automatiquement positionné"
        className="w-full h-full object-contain rounded shadow-sm pointer-events-none"
        style={{ userSelect: 'none', pointerEvents: 'none' }}
        onLoad={onLoad}
        onError={onError}
        draggable={false}
      />
    </div>
  );
};
