
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import type { PrintArea } from '@/types/printArea';
import { calculateAutoPosition, getImageDimensions, AutoPositionResult } from '@/utils/designPositioning';
import { MockupContainer } from './mockup/MockupContainer';
import { MockupStatusInfo } from './mockup/MockupStatusInfo';

interface MockupPreviewProps {
  mockupUrl?: string;
  designUrl?: string;
  designArea?: PrintArea;
  designPosition?: any;
}

export const MockupPreview: React.FC<MockupPreviewProps> = ({
  mockupUrl,
  designUrl,
  designArea,
  designPosition
}) => {
  const [mockupLoaded, setMockupLoaded] = useState(false);
  const [designLoaded, setDesignLoaded] = useState(false);
  const [mockupError, setMockupError] = useState(false);
  const [designError, setDesignError] = useState(false);
  const [autoPosition, setAutoPosition] = useState<AutoPositionResult | null>(null);

  // Debug logs détaillés
  useEffect(() => {
    console.log('🖼️ [MockupPreview] Props reçues:', {
      mockupUrl: mockupUrl ? mockupUrl.substring(0, 80) + '...' : 'AUCUNE',
      designUrl: designUrl ? designUrl.substring(0, 80) + '...' : 'AUCUNE',
      designArea,
      designPosition,
      hasDesignArea: !!designArea,
      hasDesignPosition: !!designPosition
    });
  }, [mockupUrl, designUrl, designArea, designPosition]);

  // Reset states quand les props changent
  useEffect(() => {
    console.log('🔄 [MockupPreview] Reset des états pour nouveau design');
    setDesignLoaded(false);
    setDesignError(false);
    setAutoPosition(null);
  }, [designUrl]);

  // Calculer la position automatique quand le design et la zone sont disponibles
  useEffect(() => {
    if (designUrl && designArea && mockupLoaded) {
      console.log('🔄 [MockupPreview] Calcul de la position automatique...', {
        designUrl: designUrl.substring(0, 50) + '...',
        designArea,
        mockupLoaded
      });
      
      getImageDimensions(designUrl)
        .then(dimensions => {
          console.log('📐 [MockupPreview] Dimensions du design:', dimensions);
          const position = calculateAutoPosition(dimensions, designArea);
          setAutoPosition(position);
          console.log('✅ [MockupPreview] Position automatique calculée:', position);
        })
        .catch(error => {
          console.error('❌ [MockupPreview] Erreur calcul position:', error);
          setDesignError(true);
        });
    } else {
      console.log('⏳ [MockupPreview] Conditions non réunies pour calcul position:', {
        hasDesignUrl: !!designUrl,
        hasDesignArea: !!designArea,
        mockupLoaded
      });
    }
  }, [designUrl, designArea, mockupLoaded]);

  const handleMockupLoad = () => {
    console.log('✅ [MockupPreview] Mockup chargé avec succès');
    setMockupLoaded(true);
    setMockupError(false);
  };

  const handleMockupError = () => {
    console.error('❌ [MockupPreview] Erreur de chargement du mockup:', mockupUrl);
    setMockupError(true);
    setMockupLoaded(false);
  };

  const handleDesignLoad = () => {
    console.log('✅ [MockupPreview] Design overlay chargé avec succès');
    setDesignLoaded(true);
    setDesignError(false);
  };

  const handleDesignError = () => {
    console.error('❌ [MockupPreview] Erreur de chargement du design overlay:', designUrl);
    setDesignError(true);
    setDesignLoaded(false);
  };

  if (!mockupUrl) {
    console.warn('⚠️ [MockupPreview] Aucune URL de mockup fournie');
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Aperçu du produit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed border-gray-300">
            <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 font-medium">Aucun aperçu disponible</p>
            <p className="text-xs text-gray-400 mt-2">Le produit sélectionné n'a pas de mockup configuré</p>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
              <strong>🔍 Debug:</strong> mockupUrl = {mockupUrl || 'undefined'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Aperçu du produit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <MockupContainer
            mockupUrl={mockupUrl}
            mockupLoaded={mockupLoaded}
            mockupError={mockupError}
            designUrl={designUrl}
            designError={designError}
            designArea={designArea}
            autoPosition={autoPosition}
            onMockupLoad={handleMockupLoad}
            onMockupError={handleMockupError}
            onDesignLoad={handleDesignLoad}
            onDesignError={handleDesignError}
          />
          
          <MockupStatusInfo
            mockupLoaded={mockupLoaded}
            mockupError={mockupError}
            designUrl={designUrl}
            autoPosition={autoPosition}
            designArea={designArea}
          />
        </div>
      </CardContent>
    </Card>
  );
};
