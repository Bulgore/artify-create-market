
import React from 'react';

interface DesignPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface DesignElementProps {
  designUrl: string;
  position: DesignPosition;
  isOutOfBounds: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

export const DesignElement: React.FC<DesignElementProps> = ({
  designUrl,
  position,
  isOutOfBounds
}) => {
  return (
    <g
      transform={`translate(${position.x + position.width/2}, ${position.y + position.height/2}) rotate(${position.rotation}) translate(${-position.width/2}, ${-position.height/2})`}
    >
      <image
        href={designUrl}
        x="0"
        y="0"
        width={position.width}
        height={position.height}
        className="pointer-events-none" // Plus d'interaction
        preserveAspectRatio="xMidYMid meet"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Bordure de visualisation - sans interaction */}
      <rect
        x="0"
        y="0"
        width={position.width}
        height={position.height}
        fill="none"
        stroke={isOutOfBounds ? "#EF4444" : "#10B981"}
        strokeWidth="2"
        strokeDasharray="8,4"
        className="pointer-events-none"
        rx="4"
        opacity="0.8"
      />
      
      {/* Indicateur de positionnement automatique */}
      <g>
        <circle 
          cx={position.width/2} 
          cy={position.height/2} 
          r="12" 
          fill="white" 
          fillOpacity="0.9" 
          stroke="#10B981" 
          strokeWidth="2" 
          className="pointer-events-none" 
        />
        <text 
          x={position.width/2} 
          y={position.height/2 + 4} 
          textAnchor="middle" 
          fontSize="12" 
          fill="#10B981" 
          className="pointer-events-none"
          fontWeight="bold"
        >
          ✓
        </text>
      </g>

      {/* Affichage des dimensions optimisées */}
      <g>
        <rect
          x={position.width + 10}
          y="-8"
          width="auto"
          height="24"
          fill="rgba(16,185,129,0.9)"
          rx="6"
        />
        <text
          x={position.width + 15}
          y="8"
          fontSize="11"
          fill="white"
          fontWeight="bold"
        >
          Auto-centré {Math.round(position.width)}×{Math.round(position.height)}px
        </text>
      </g>
    </g>
  );
};
