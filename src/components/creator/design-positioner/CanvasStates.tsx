
import React from 'react';

interface DesignArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CanvasStatesProps {
  designArea: DesignArea;
  designUrl: string;
  imageLoaded: boolean;
  imageError: boolean;
}

export const CanvasStates: React.FC<CanvasStatesProps> = ({
  designArea,
  designUrl,
  imageLoaded,
  imageError
}) => {
  // État de chargement stylisé
  if (!imageLoaded && !imageError && designUrl) {
    return (
      <g>
        <rect
          x={designArea.x + 20}
          y={designArea.y + 20}
          width={Math.max(200, designArea.width - 40)}
          height={Math.max(80, designArea.height - 40)}
          fill="rgba(255, 255, 255, 0.95)"
          stroke="#6B7280"
          strokeWidth="2"
          strokeDasharray="8,4"
          rx="12"
        />
        <text
          x={designArea.x + designArea.width/2}
          y={designArea.y + designArea.height/2 - 10}
          textAnchor="middle"
          fill="#6B7280"
          fontSize="16"
          fontWeight="medium"
        >
          ⏳ Chargement du design...
        </text>
        <text
          x={designArea.x + designArea.width/2}
          y={designArea.y + designArea.height/2 + 15}
          textAnchor="middle"
          fill="#9CA3AF"
          fontSize="13"
        >
          Veuillez patienter
        </text>
      </g>
    );
  }

  // État d'erreur amélioré
  if (imageError && designUrl) {
    return (
      <g>
        <rect
          x={designArea.x + 20}
          y={designArea.y + 20}
          width={Math.max(220, designArea.width - 40)}
          height={Math.max(100, designArea.height - 40)}
          fill="#FEF2F2"
          stroke="#EF4444"
          strokeWidth="2"
          rx="12"
        />
        <text
          x={designArea.x + designArea.width/2}
          y={designArea.y + designArea.height/2 - 15}
          textAnchor="middle"
          fill="#EF4444"
          fontSize="16"
          fontWeight="bold"
        >
          ❌ Erreur de chargement
        </text>
        <text
          x={designArea.x + designArea.width/2}
          y={designArea.y + designArea.height/2 + 10}
          textAnchor="middle"
          fill="#EF4444"
          fontSize="12"
        >
          Vérifiez l'URL de l'image
        </text>
      </g>
    );
  }

  // Instructions initiales quand pas de design
  if (!designUrl) {
    return (
      <g>
        <rect
          x={designArea.x + 20}
          y={designArea.y + 20}
          width={Math.max(200, designArea.width - 40)}
          height={Math.max(80, designArea.height - 40)}
          fill="rgba(243, 244, 246, 0.9)"
          stroke="#D1D5DB"
          strokeWidth="2"
          strokeDasharray="10,5"
          rx="12"
        />
        <text
          x={designArea.x + designArea.width/2}
          y={designArea.y + designArea.height/2 - 10}
          textAnchor="middle"
          fill="#6B7280"
          fontSize="16"
          fontWeight="medium"
        >
          📁 Uploadez votre design
        </text>
        <text
          x={designArea.x + designArea.width/2}
          y={designArea.y + designArea.height/2 + 15}
          textAnchor="middle"
          fill="#9CA3AF"
          fontSize="13"
        >
          Il apparaîtra dans cette zone
        </text>
      </g>
    );
  }

  return null;
};
