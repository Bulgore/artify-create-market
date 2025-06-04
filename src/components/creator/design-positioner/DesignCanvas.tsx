
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

  // Vérifier si le design dépasse de la zone d'impression
  const isDesignOutOfBounds = designUrl && imageLoaded && (
    position.x < designArea.x ||
    position.y < designArea.y ||
    position.x + position.width > designArea.x + designArea.width ||
    position.y + position.height > designArea.y + designArea.height
  );

  return (
    <div className="space-y-4">
      {/* Titre et description */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Éditeur de positionnement</h3>
        <p className="text-sm text-gray-600">Positionnez votre design sur le produit en le glissant dans la zone d'impression</p>
      </div>

      {/* Alerte si design hors zone */}
      {isDesignOutOfBounds && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-700">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-medium">Design hors de la zone d'impression</p>
              <p className="text-sm">Veuillez repositionner votre design dans la zone bleue délimitée.</p>
            </div>
          </div>
        </div>
      )}

      {/* Zone d'édition principale */}
      <div className="border-2 border-gray-300 rounded-xl p-6 bg-white shadow-lg">
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Zone d'impression délimitée
          </div>
        </div>
        
        <svg
          ref={ref}
          viewBox="0 0 400 400"
          className="w-full max-w-lg mx-auto border-2 border-gray-200 rounded-lg cursor-crosshair bg-gray-50"
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ height: '500px' }}
        >
          {/* Template background (SVG du produit) avec meilleure visibilité */}
          {templateUrl && templateLoaded && !templateError && (
            <image
              href={templateUrl}
              x="0"
              y="0"
              width="400"
              height="400"
              opacity="0.7"
              preserveAspectRatio="xMidYMid meet"
            />
          )}
          
          {/* Fallback si pas de template - Affichage du tote bag par défaut */}
          {(!templateLoaded || templateError) && (
            <>
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
              {/* Simulation du contour d'un tote bag */}
              <path
                d="M100 80 L100 120 L80 140 L80 360 L320 360 L320 140 L300 120 L300 80 M120 80 L120 60 L280 60 L280 80"
                fill="none"
                stroke="#d1d5db"
                strokeWidth="3"
                strokeDasharray="5,5"
              />
              <text
                x="200"
                y="220"
                textAnchor="middle"
                fill="#6c757d"
                fontSize="14"
                fontWeight="medium"
              >
                🛍️ Tote bag (template manquant)
              </text>
            </>
          )}
          
          {/* Zone d'impression - TOUJOURS visible avec un style très attractif */}
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
          
          {/* Design de l'utilisateur avec interaction améliorée */}
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
              
              {/* Bordure de sélection avec animation subtile et couleur selon la position */}
              <rect
                x="0"
                y="0"
                width={position.width}
                height={position.height}
                fill="none"
                stroke={isDesignOutOfBounds ? "#EF4444" : "#F59E0B"}
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
                    stroke={isDesignOutOfBounds ? "#EF4444" : "#F59E0B"} 
                    strokeWidth="2" 
                    className="pointer-events-none" 
                  />
                  <circle 
                    cx={x} 
                    cy={y} 
                    r="3" 
                    fill={isDesignOutOfBounds ? "#EF4444" : "#F59E0B"} 
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
                  stroke={isDesignOutOfBounds ? "#EF4444" : "#F59E0B"} 
                  strokeWidth="2" 
                  className="pointer-events-none" 
                />
                <text 
                  x={position.width/2} 
                  y={position.height/2 + 3} 
                  textAnchor="middle" 
                  fontSize="10" 
                  fill={isDesignOutOfBounds ? "#EF4444" : "#F59E0B"} 
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
          )}
          
          {/* État de chargement stylisé */}
          {!imageLoaded && !imageError && designUrl && (
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
          )}
          
          {/* État d'erreur amélioré */}
          {imageError && designUrl && (
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
          )}

          {/* Instructions initiales quand pas de design */}
          {!designUrl && (
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
          )}
        </svg>

        {/* Indicateurs de statut en bas */}
        <div className="mt-4 flex justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${templateLoaded ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-gray-600">Template {templateLoaded ? 'chargé' : 'en attente'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${imageLoaded ? 'bg-green-500' : designUrl ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
            <span className="text-gray-600">Design {imageLoaded ? 'prêt' : designUrl ? 'chargement...' : 'en attente'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isDesignOutOfBounds ? 'bg-red-500' : imageLoaded ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-gray-600">Position {isDesignOutOfBounds ? 'incorrecte' : imageLoaded ? 'valide' : 'en attente'}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

DesignCanvas.displayName = 'DesignCanvas';
