
import React from 'react';
import { MockupImage } from './MockupImage';
import { PrintAreaOverlay } from './PrintAreaOverlay';
import { DesignOverlay } from './DesignOverlay';
import { SVGDisplay } from '@/components/ui/SVGDisplay';
import type { DesignArea } from '@/types/designArea';
import type { AutoPositionResult } from '@/utils/designPositioning';

interface MockupContainerProps {
  mockupUrl: string;
  mockupLoaded: boolean;
  mockupError: boolean;
  designUrl?: string;
  designError: boolean;
  designArea?: DesignArea;
  autoPosition?: AutoPositionResult;
  svgTemplateUrl?: string;
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
  svgTemplateUrl,
  onMockupLoad,
  onMockupError,
  onDesignLoad,
  onDesignError
}) => {
  const containerWidth = 400;
  const containerHeight = 300;

  return (
    <div className="space-y-4">
      {/* Vue SVG Template avec zone d'impression visible */}
      {svgTemplateUrl && (
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
          <div className="bg-gray-100 px-3 py-2 border-b">
            <h4 className="text-sm font-medium text-gray-700">📐 Template SVG avec zone d'impression</h4>
          </div>
          <div className="relative h-64 bg-white">
            <SVGDisplay 
              svgUrl={svgTemplateUrl}
              className="w-full h-full"
              showError={false}
              onLoad={() => console.log('✅ SVG template affiché')}
              onError={() => console.log('⚠️ SVG template non affiché (non bloquant)')}
            />
            
            {/* Overlay de la zone d'impression sur le SVG */}
            {designArea && (
              <div
                className="absolute border-2 border-blue-500 border-dashed bg-blue-500 bg-opacity-20 pointer-events-none"
                style={{
                  left: `${(designArea.x / 400) * 100}%`,
                  top: `${(designArea.y / 300) * 100}%`,
                  width: `${(designArea.width / 400) * 100}%`,
                  height: `${(designArea.height / 300) * 100}%`
                }}
                title={`Zone d'impression définie par l'admin (${Math.round(designArea.width)}×${Math.round(designArea.height)}px)`}
              >
                <div className="absolute -top-6 left-0 text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded shadow font-medium">
                  Zone d'impression ({Math.round(designArea.width)}×{Math.round(designArea.height)}px)
                </div>
              </div>
            )}
            
            {/* Design positionné dans le SVG */}
            {designUrl && autoPosition && !designError && (
              <div
                className="absolute pointer-events-none border border-green-500 rounded"
                style={{
                  left: `${(autoPosition.x / 400) * 100}%`,
                  top: `${(autoPosition.y / 300) * 100}%`,
                  width: `${(autoPosition.width / 400) * 100}%`,
                  height: `${(autoPosition.height / 300) * 100}%`
                }}
              >
                <img
                  src={designUrl}
                  alt="Design dans zone SVG"
                  className="w-full h-full object-contain"
                  style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                />
                <div className="absolute -bottom-5 left-0 text-xs text-green-700 bg-green-100 px-1 py-0.5 rounded font-medium">
                  Auto-centré {Math.round(autoPosition.scale * 100)}%
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
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
                <p className="text-xs mt-1">{mockupUrl.substring(0, 40)}...</p>
              </div>
            </div>
          ) : (
            <MockupImage
              mockupUrl={mockupUrl}
              onLoad={onMockupLoad}
              onError={onMockupError}
            />
          )}
          
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
