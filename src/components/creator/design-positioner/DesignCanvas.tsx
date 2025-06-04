
import React, { forwardRef } from 'react';

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

interface DesignCanvasProps {
  templateUrl: string;
  designUrl: string;
  designArea: DesignArea;
  position: DesignPosition;
  imageLoaded: boolean;
  templateLoaded: boolean;
  imageError: boolean;
  templateError: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
}

export const DesignCanvas = forwardRef<SVGSVGElement, DesignCanvasProps>(({
  templateUrl,
  designUrl,
  designArea,
  position,
  imageLoaded,
  templateLoaded,
  imageError,
  templateError,
  onMouseDown,
  onMouseMove,
  onMouseUp
}, ref) => {
  console.log('🎨 DesignCanvas render:', {
    designUrl: designUrl?.substring(0, 50) + '...',
    imageLoaded,
    imageError,
    templateLoaded,
    templateError,
    designArea,
    position
  });

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <svg
        ref={ref}
        viewBox="0 0 400 400"
        className="w-full h-96 border rounded cursor-crosshair"
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{ maxHeight: '400px' }}
      >
        {/* Template background */}
        {templateUrl && templateLoaded && !templateError && (
          <image
            href={templateUrl}
            x="0"
            y="0"
            width="400"
            height="400"
            opacity="0.3"
            preserveAspectRatio="xMidYMid meet"
          />
        )}
        
        {/* Fallback template background */}
        {(!templateLoaded || templateError) && (
          <rect
            x="0"
            y="0"
            width="400"
            height="400"
            fill="#f8f9fa"
            stroke="#e9ecef"
            strokeWidth="1"
          />
        )}
        
        {/* Design area boundaries - TOUJOURS visible */}
        <rect
          x={designArea.x}
          y={designArea.y}
          width={designArea.width}
          height={designArea.height}
          fill="rgba(51, 195, 240, 0.1)"
          stroke="#33C3F0"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        {/* Design area label */}
        <text
          x={designArea.x + 5}
          y={designArea.y + 15}
          fontSize="12"
          fill="#33C3F0"
          fontWeight="bold"
        >
          Zone d'impression
        </text>
        
        {/* User design image */}
        {imageLoaded && !imageError && designUrl && (
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
            
            {/* Selection border */}
            <rect
              x="0"
              y="0"
              width={position.width}
              height={position.height}
              fill="none"
              stroke="#FF6B35"
              strokeWidth="2"
              strokeDasharray="3,3"
              className="pointer-events-none"
            />
            
            {/* Corner handles for visual feedback */}
            <circle cx="0" cy="0" r="4" fill="#FF6B35" stroke="white" strokeWidth="1" className="pointer-events-none" />
            <circle cx={position.width} cy="0" r="4" fill="#FF6B35" stroke="white" strokeWidth="1" className="pointer-events-none" />
            <circle cx="0" cy={position.height} r="4" fill="#FF6B35" stroke="white" strokeWidth="1" className="pointer-events-none" />
            <circle cx={position.width} cy={position.height} r="4" fill="#FF6B35" stroke="white" strokeWidth="1" className="pointer-events-none" />
          </g>
        )}
        
        {/* Loading state */}
        {!imageLoaded && !imageError && designUrl && (
          <g>
            <rect
              x={designArea.x + 10}
              y={designArea.y + 10}
              width={Math.max(100, designArea.width - 20)}
              height={Math.max(40, designArea.height - 20)}
              fill="#f8f9fa"
              stroke="#dee2e6"
              strokeWidth="1"
              rx="4"
            />
            <text
              x={designArea.x + designArea.width/2}
              y={designArea.y + designArea.height/2}
              textAnchor="middle"
              fill="#6c757d"
              fontSize="14"
            >
              Chargement du design...
            </text>
          </g>
        )}
        
        {/* Error state */}
        {imageError && designUrl && (
          <g>
            <rect
              x={designArea.x + 10}
              y={designArea.y + 10}
              width={Math.max(150, designArea.width - 20)}
              height={Math.max(60, designArea.height - 20)}
              fill="#fee2e2"
              stroke="#ef4444"
              strokeWidth="2"
              rx="4"
            />
            <text
              x={designArea.x + designArea.width/2}
              y={designArea.y + designArea.height/2 - 10}
              textAnchor="middle"
              fill="#ef4444"
              fontSize="12"
              fontWeight="bold"
            >
              Erreur de chargement
            </text>
            <text
              x={designArea.x + designArea.width/2}
              y={designArea.y + designArea.height/2 + 10}
              textAnchor="middle"
              fill="#ef4444"
              fontSize="10"
            >
              Vérifiez l'URL de l'image
            </text>
          </g>
        )}

        {/* Placeholder when no design */}
        {!designUrl && (
          <g>
            <rect
              x={designArea.x + 10}
              y={designArea.y + 10}
              width={Math.max(120, designArea.width - 20)}
              height={Math.max(40, designArea.height - 20)}
              fill="#f0f0f0"
              stroke="#ccc"
              strokeWidth="1"
              strokeDasharray="5,5"
              rx="4"
            />
            <text
              x={designArea.x + designArea.width/2}
              y={designArea.y + designArea.height/2}
              textAnchor="middle"
              fill="#999"
              fontSize="12"
            >
              Uploadez votre design
            </text>
          </g>
        )}
      </svg>
    </div>
  );
});

DesignCanvas.displayName = 'DesignCanvas';
