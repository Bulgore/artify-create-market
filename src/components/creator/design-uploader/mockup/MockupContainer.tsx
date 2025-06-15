
import React from 'react';
import { MockupImage } from './MockupImage';
import { PrintAreaOverlay } from './PrintAreaOverlay';
import { DesignOverlay } from './DesignOverlay';
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

  return (
    <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
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
      
      {/* Zone d'impression - Gabarit visible */}
      {mockupLoaded && designArea && (
        <PrintAreaOverlay
          designArea={designArea}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
        />
      )}
      
      {/* Design positionné automatiquement */}
      {designUrl && autoPosition && (
        designError ? (
          <div
            className="absolute w-full h-full bg-red-100 border-2 border-red-300 rounded flex items-center justify-center"
            style={{
              left: `${(autoPosition.x / containerWidth) * 100}%`,
              top: `${(autoPosition.y / containerHeight) * 100}%`,
              width: `${(autoPosition.width / containerWidth) * 100}%`,
              height: `${(autoPosition.height / containerHeight) * 100}%`
            }}
          >
            <span className="text-red-500 text-xs">❌ Design</span>
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
  );
};
