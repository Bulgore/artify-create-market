
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
  isOutOfBounds,
  onMouseDown
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
        onMouseDown={onMouseDown}
        className="cursor-move"
        preserveAspectRatio="xMidYMid meet"
        style={{ pointerEvents: 'all' }}
      />
      
      {/* Bordure de sélection avec animation subtile et couleur selon la position */}
      <rect
        x="0"
        y="0"
        width={position.width}
        height={position.height}
        fill="none"
        stroke={isOutOfBounds ? "#EF4444" : "#F59E0B"}
        strokeWidth="2"
        strokeDasharray="6,3"
        className="pointer-events-none animate-pulse"
        rx="3"
      />
      
      {/* Coins de redimensionnement plus visibles */}
      {[
        [0, 0], [position.width, 0], 
        [0, position.height], [position.width, position.height]
      ].map(([x, y], index) => (
        <g key={index}>
          <circle 
            cx={x} 
            cy={y} 
            r="6" 
            fill="white" 
            stroke={isOutOfBounds ? "#EF4444" : "#F59E0B"} 
            strokeWidth="2" 
            className="pointer-events-none" 
          />
          <circle 
            cx={x} 
            cy={y} 
            r="3" 
            fill={isOutOfBounds ? "#EF4444" : "#F59E0B"} 
            className="pointer-events-none" 
          />
        </g>
      ))}
      
      {/* Indicateur de rotation au centre avec icône */}
      <g>
        <circle 
          cx={position.width/2} 
          cy={position.height/2} 
          r="8" 
          fill="white" 
          fillOpacity="0.9" 
          stroke={isOutOfBounds ? "#EF4444" : "#F59E0B"} 
          strokeWidth="2" 
          className="pointer-events-none" 
        />
        <text 
          x={position.width/2} 
          y={position.height/2 + 3} 
          textAnchor="middle" 
          fontSize="10" 
          fill={isOutOfBounds ? "#EF4444" : "#F59E0B"} 
          className="pointer-events-none"
        >
          ⟲
        </text>
      </g>

      {/* Affichage des dimensions réelles */}
      <g>
        <rect
          x={position.width + 10}
          y="-5"
          width="60"
          height="20"
          fill="rgba(0,0,0,0.8)"
          rx="4"
        />
        <text
          x={position.width + 40}
          y="8"
          textAnchor="middle"
          fontSize="10"
          fill="white"
          fontWeight="bold"
        >
          {Math.round(position.width)}×{Math.round(position.height)}px
        </text>
      </g>
    </g>
  );
};
