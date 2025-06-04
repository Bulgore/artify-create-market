
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
    <div className="border-2 border-gray-300 rounded-lg p-4 bg-white shadow-sm">
      <div className="mb-3">
        <h3 className="font-medium text-gray-800">Zone de positionnement</h3>
        <p className="text-sm text-gray-600">Glissez et redimensionnez votre design dans la zone bleue</p>
      </div>
      
      <svg
        ref={ref}
        viewBox="0 0 400 400"
        className="w-full h-96 border-2 border-blue-200 rounded cursor-crosshair bg-gray-50"
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{ maxHeight: '400px', minHeight: '400px' }}
      >
        {/* Template background avec opacité réduite */}
        {templateUrl && templateLoaded && !templateError && (
          <image
            href={templateUrl}
            x="0"
            y="0"
            width="400"
            height="400"
            opacity="0.2"
            preserveAspectRatio="xMidYMid meet"
          />
        )}
        
        {/* Fallback si pas de template */}
        {(!templateLoaded || templateError) && (
          <rect
            x="0"
            y="0"
            width="400"
            height="400"
            fill="#f8f9fa"
            stroke="#e9ecef"
            strokeWidth="2"
            rx="8"
          />
        )}
        
        {/* Zone d'impression - TOUJOURS visible avec un style attractif */}
        <rect
          x={designArea.x}
          y={designArea.y}
          width={designArea.width}
          height={designArea.height}
          fill="rgba(59, 130, 246, 0.1)"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeDasharray="8,4"
          rx="4"
        />
        
        {/* Bordure intérieure pour plus de visibilité */}
        <rect
          x={designArea.x + 2}
          y={designArea.y + 2}
          width={designArea.width - 4}
          height={designArea.height - 4}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="1"
          strokeOpacity="0.5"
          rx="2"
        />
        
        {/* Label de la zone avec fond */}
        <g>
          <rect
            x={designArea.x + 8}
            y={designArea.y + 8}
            width="140"
            height="24"
            fill="#3B82F6"
            rx="4"
            fillOpacity="0.9"
          />
          <text
            x={designArea.x + 15}
            y={designArea.y + 24}
            fontSize="12"
            fill="white"
            fontWeight="bold"
          >
            Zone d'impression
          </text>
        </g>
        
        {/* Design de l'utilisateur */}
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
            
            {/* Bordure de sélection avec coins */}
            <rect
              x="0"
              y="0"
              width={position.width}
              height={position.height}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeDasharray="4,2"
              className="pointer-events-none"
              rx="2"
            />
            
            {/* Coins de redimensionnement */}
            <circle cx="0" cy="0" r="5" fill="#F59E0B" stroke="white" strokeWidth="2" className="pointer-events-none" />
            <circle cx={position.width} cy="0" r="5" fill="#F59E0B" stroke="white" strokeWidth="2" className="pointer-events-none" />
            <circle cx="0" cy={position.height} r="5" fill="#F59E0B" stroke="white" strokeWidth="2" className="pointer-events-none" />
            <circle cx={position.width} cy={position.height} r="5" fill="#F59E0B" stroke="white" strokeWidth="2" className="pointer-events-none" />
            
            {/* Indicateur de rotation au centre */}
            <circle cx={position.width/2} cy={position.height/2} r="3" fill="#F59E0B" fillOpacity="0.7" className="pointer-events-none" />
          </g>
        )}
        
        {/* État de chargement amélioré */}
        {!imageLoaded && !imageError && designUrl && (
          <g>
            <rect
              x={designArea.x + 20}
              y={designArea.y + 20}
              width={Math.max(160, designArea.width - 40)}
              height={Math.max(60, designArea.height - 40)}
              fill="rgba(255, 255, 255, 0.9)"
              stroke="#6B7280"
              strokeWidth="2"
              strokeDasharray="5,5"
              rx="8"
            />
            <text
              x={designArea.x + designArea.width/2}
              y={designArea.y + designArea.height/2 - 5}
              textAnchor="middle"
              fill="#6B7280"
              fontSize="14"
              fontWeight="medium"
            >
              ⏳ Chargement du design...
            </text>
            <text
              x={designArea.x + designArea.width/2}
              y={designArea.y + designArea.height/2 + 15}
              textAnchor="middle"
              fill="#9CA3AF"
              fontSize="12"
            >
              Veuillez patienter
            </text>
          </g>
        )}
        
        {/* État d'erreur amélioré */}
        {imageError && designUrl && (
          <g>
            <rect
              x={designArea.x + 20}
              y={designArea.y + 20}
              width={Math.max(180, designArea.width - 40)}
              height={Math.max(80, designArea.height - 40)}
              fill="#FEF2F2"
              stroke="#EF4444"
              strokeWidth="2"
              rx="8"
            />
            <text
              x={designArea.x + designArea.width/2}
              y={designArea.y + designArea.height/2 - 10}
              textAnchor="middle"
              fill="#EF4444"
              fontSize="14"
              fontWeight="bold"
            >
              ❌ Erreur de chargement
            </text>
            <text
              x={designArea.x + designArea.width/2}
              y={designArea.y + designArea.height/2 + 10}
              textAnchor="middle"
              fill="#EF4444"
              fontSize="11"
            >
              Vérifiez l'URL de l'image
            </text>
          </g>
        )}

        {/* Instructions quand pas de design */}
        {!designUrl && (
          <g>
            <rect
              x={designArea.x + 20}
              y={designArea.y + 20}
              width={Math.max(160, designArea.width - 40)}
              height={Math.max(60, designArea.height - 40)}
              fill="rgba(243, 244, 246, 0.8)"
              stroke="#D1D5DB"
              strokeWidth="2"
              strokeDasharray="8,4"
              rx="8"
            />
            <text
              x={designArea.x + designArea.width/2}
              y={designArea.y + designArea.height/2 - 5}
              textAnchor="middle"
              fill="#6B7280"
              fontSize="14"
              fontWeight="medium"
            >
              📁 Uploadez votre design
            </text>
            <text
              x={designArea.x + designArea.width/2}
              y={designArea.y + designArea.height/2 + 15}
              textAnchor="middle"
              fill="#9CA3AF"
              fontSize="12"
            >
              Il apparaîtra dans cette zone
            </text>
          </g>
        )}
      </svg>
    </div>
  );
});

DesignCanvas.displayName = 'DesignCanvas';
