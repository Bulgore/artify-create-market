
import React from 'react';

interface DesignArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CanvasOverlaysProps {
  designArea: DesignArea;
  isDesignOutOfBounds: boolean;
}

export const CanvasOverlays: React.FC<CanvasOverlaysProps> = ({ designArea, isDesignOutOfBounds }) => {
  return (
    <g>
      {/* Bordure principale en pointillés */}
      <rect
        x={designArea.x}
        y={designArea.y}
        width={designArea.width}
        height={designArea.height}
        fill="rgba(59, 130, 246, 0.08)"
        stroke="#3B82F6"
        strokeWidth="3"
        strokeDasharray="10,5"
        rx="6"
        className={isDesignOutOfBounds ? "animate-pulse" : ""}
      />
      
      {/* Bordure intérieure pour plus de définition */}
      <rect
        x={designArea.x + 2}
        y={designArea.y + 2}
        width={designArea.width - 4}
        height={designArea.height - 4}
        fill="none"
        stroke="#3B82F6"
        strokeWidth="1"
        strokeOpacity="0.4"
        rx="4"
      />
      
      {/* Coins pour marquer la zone */}
      {[
        [designArea.x, designArea.y],
        [designArea.x + designArea.width, designArea.y],
        [designArea.x, designArea.y + designArea.height],
        [designArea.x + designArea.width, designArea.y + designArea.height]
      ].map(([x, y], index) => (
        <circle
          key={index}
          cx={x}
          cy={y}
          r="4"
          fill="#3B82F6"
          stroke="white"
          strokeWidth="2"
        />
      ))}
      
      {/* Label de la zone avec style amélioré */}
      <g>
        <rect
          x={designArea.x + 10}
          y={designArea.y + 10}
          width="160"
          height="28"
          fill="#3B82F6"
          rx="6"
          fillOpacity="0.95"
        />
        <text
          x={designArea.x + 18}
          y={designArea.y + 28}
          fontSize="13"
          fill="white"
          fontWeight="bold"
        >
          📍 Zone d'impression
        </text>
      </g>
    </g>
  );
};
