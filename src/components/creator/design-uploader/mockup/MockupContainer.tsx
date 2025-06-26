
import React from 'react';
import { MockupImage } from './MockupImage';
import { PrintAreaOverlay } from './PrintAreaOverlay';
import { DesignOverlay } from './DesignOverlay';
import type { PrintArea } from '@/types/printArea';
import type { AutoPositionResult } from '@/utils/designPositioning';

interface MockupContainerProps {
  mockupUrl: string;
  mockupLoaded: boolean;
  mockupError: boolean;
  designUrl?: string;
  designError: boolean;
  designArea?: PrintArea;
  autoPosition?: AutoPositionResult;
  onMockupLoad: () => void;
  onMockupError: () => void;
  onDesignLoad: () => void;
  onDesignError: () => void;
}

export const MockupContainer: React.FC<MockupContainerProps> = ({
  mockupUrl,
  mockupLoaded,
  mockupError,
  designUrl,
  designError,
  designArea,
  autoPosition,
  onMockupLoad,
  onMockupError,
  onDesignLoad,
  onDesignError
}) => {
  const containerWidth = 400;
  const containerHeight = 300;

  console.log('🖼️ [MockupContainer] Props reçues:', {
    mockupUrl: mockupUrl?.substring(0, 80) + '...',
    mockupLoaded,
    mockupError,
    designUrl: designUrl?.substring(0, 80) + '...',
    designError,
    hasDesignArea: !!designArea,
    hasAutoPosition: !!autoPosition
  });

  return (
    <div className="space-y-4">
      
      {/* Vue Mockup traditionnelle */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        <div className="bg-gray-100 px-3 py-2 border-b">
          <h4 className="text-sm font-medium text-gray-700">👕 Aperçu mockup du produit</h4>
        </div>
        <div className="relative w-full h-80 bg-gray-100 overflow-hidden">
          {mockupError ? (
            <div className="w-full h-full flex items-center justify-center text-red-500">
              <div className="text-center">
                <p>❌ Erreur mockup</p>
                <p className="text-xs mt-1">{mockupUrl?.substring(0, 40)}...</p>
                <button
                  onClick={() => {
                    console.log('🔄 Retry mockup load:', mockupUrl);
                    onMockupLoad();
                  }}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded"
                >
                  Réessayer
                </button>
              </div>
            </div>
          ) : !mockupUrl ? (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p>⚠️ Aucun mockup disponible</p>
                <p className="text-xs mt-1">URL mockup manquante</p>
              </div>
            </div>
          ) : (
            <>
              <MockupImage
                mockupUrl={mockupUrl}
                onLoad={onMockupLoad}
                onError={onMockupError}
              />
              
              {/* Zone d'impression sur le mockup */}
              {mockupLoaded && designArea && (
                <PrintAreaOverlay
                  designArea={designArea}
                  containerWidth={containerWidth}
                  containerHeight={containerHeight}
                />
              )}
              
              {/* Design positionné sur le mockup */}
              {designUrl && autoPosition && (
                designError ? (
                  <div
                    className="absolute bg-red-100 border-2 border-red-300 rounded flex items-center justify-center"
                    style={{
                      left: `${(autoPosition.x / containerWidth) * 100}%`,
                      top: `${(autoPosition.y / containerHeight) * 100}%`,
                      width: `${(autoPosition.width / containerWidth) * 100}%`,
                      height: `${(autoPosition.height / containerHeight) * 100}%`
                    }}
                  >
                    <span className="text-red-500 text-xs">❌ Erreur design</span>
                  </div>
                ) : (
                  <DesignOverlay
                    designUrl={designUrl}
                    autoPosition={autoPosition}
                    containerWidth={containerWidth}
                    containerHeight={containerHeight}
                    onLoad={onDesignLoad}
                    onError={onDesignError}
                  />
                )
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Informations de debug */}
      {designArea && autoPosition && (
        <div className="text-xs bg-gray-100 p-3 rounded border">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Zone d'impression admin:</strong>
              <br />📏 {Math.round(designArea.width)}×{Math.round(designArea.height)}px
              <br />📍 Position: ({Math.round(designArea.x)}, {Math.round(designArea.y)})
            </div>
            <div>
              <strong>Design auto-positionné:</strong>
              <br />📐 {Math.round(autoPosition.width)}×{Math.round(autoPosition.height)}px
              <br />🔍 Échelle: {Math.round(autoPosition.scale * 100)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
