
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
    <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
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
      
      {/* Affichage du template SVG en arrière-plan si disponible - NOUVELLE VERSION AMÉLIORÉE */}
      {mockupLoaded && svgTemplateUrl && (
        <div className="absolute inset-0 pointer-events-none opacity-25 z-5">
          <SVGDisplay 
            svgUrl={svgTemplateUrl}
            className="w-full h-full"
            showError={false}
            onLoad={() => console.log('✅ SVG template affiché en arrière-plan')}
            onError={() => console.log('⚠️ SVG template non affiché (non bloquant)')}
          />
        </div>
      )}
      
      {/* Zone d'impression - Gabarit visible AVEC coordonnées EXACTES */}
      {mockupLoaded && designArea && (
        <PrintAreaOverlay
          designArea={designArea}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
        />
      )}
      
      {/* Design positionné automatiquement avec coordonnées EXACTES */}
      {designUrl && autoPosition && (
        designError ? (
          <div
            className="absolute bg-red-100 border-2 border-red-300 rounded flex items-center justify-center z-10"
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
      
      {/* Informations de debug pour vérification */}
      {designArea && autoPosition && (
        <div className="absolute bottom-2 left-2 text-xs bg-black bg-opacity-75 text-white px-2 py-1 rounded z-20">
          Zone: {Math.round(designArea.width)}×{Math.round(designArea.height)} | 
          Design: {Math.round(autoPosition.width)}×{Math.round(autoPosition.height)} | 
          Échelle: {Math.round(autoPosition.scale * 100)}%
        </div>
      )}
    </div>
  );
};
