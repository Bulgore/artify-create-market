
import React from 'react';
import type { DesignArea } from '@/types/designArea';
import type { AutoPositionResult } from '@/utils/designPositioning';

interface MockupStatusInfoProps {
  mockupLoaded: boolean;
  mockupError: boolean;
  designUrl?: string;
  autoPosition?: AutoPositionResult;
  designArea?: DesignArea;
}

export const MockupStatusInfo: React.FC<MockupStatusInfoProps> = ({
  mockupLoaded,
  mockupError,
  designUrl,
  autoPosition,
  designArea
}) => {
  return (
    <div className="mt-3 text-xs text-gray-600 space-y-1">
      <div className="flex items-center gap-2">
        <span>Mockup:</span>
        <span className={mockupLoaded ? 'text-green-600' : mockupError ? 'text-red-600' : 'text-yellow-600'}>
          {mockupLoaded ? '✅ Chargé' : mockupError ? '❌ Erreur' : '⏳ Chargement'}
        </span>
      </div>
      
      {designUrl && (
        <div className="flex items-center gap-2">
          <span>Design:</span>
          <span className={autoPosition ? 'text-green-600' : 'text-yellow-600'}>
            {autoPosition ? '✅ Positionné automatiquement (PROFESSIONNEL)' : '⏳ Calcul position...'}
          </span>
        </div>
      )}
      
      {designArea && (
        <div className="text-blue-600">
          📍 Zone d'impression: {designArea.width}×{designArea.height}px à ({designArea.x}, {designArea.y})
        </div>
      )}
      
      {autoPosition && (
        <div className="text-green-600 font-medium">
          ✨ Position OPTIMALE: {Math.round(autoPosition.width)}×{Math.round(autoPosition.height)}px 
          (agrandissement: {Math.round(autoPosition.scale * 100)}% - centré automatiquement)
        </div>
      )}
      
      {autoPosition && (
        <div className="text-purple-600 text-xs">
          🚫 Positionnement automatique - Aucune manipulation manuelle possible (standard professionnel)
        </div>
      )}
    </div>
  );
};
