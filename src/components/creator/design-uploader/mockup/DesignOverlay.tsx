
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
  // Position EXACTE calculée automatiquement avec les coordonnées admin
  // AUCUNE interaction manuelle possible - positioning 100% automatique
  const style = {
    left: `${(autoPosition.x / containerWidth) * 100}%`,
    top: `${(autoPosition.y / containerHeight) * 100}%`,
    width: `${(autoPosition.width / containerWidth) * 100}%`,
    height: `${(autoPosition.height / containerHeight) * 100}%`,
    pointerEvents: 'none' as const, // INTERDIRE toute interaction utilisateur
    zIndex: 15 // Au-dessus de la zone d'impression mais sous les labels
  };

  return (
    <div 
      className="absolute pointer-events-none" 
      style={style}
      title={`Design automatiquement centré et agrandi dans la zone admin (échelle: ${Math.round(autoPosition.scale * 100)}%) - AUCUNE modification manuelle possible`}
    >
      <img
        src={designUrl}
        alt="Design automatiquement positionné selon zone admin"
        className="w-full h-full object-contain rounded shadow-lg pointer-events-none border border-gray-300"
        style={{ 
          userSelect: 'none', 
          pointerEvents: 'none',
          backgroundColor: 'rgba(255,255,255,0.9)'
        }}
        onLoad={onLoad}
        onError={onError}
        draggable={false}
      />
      <div className="absolute -bottom-6 left-0 text-xs text-green-700 bg-green-100 px-2 py-1 rounded shadow border border-green-200 font-medium">
        ✅ Auto-centré ({Math.round(autoPosition.scale * 100)}%)
      </div>
    </div>
  );
};
