
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import type { DesignArea } from '@/types/designArea';
import { calculateAutoPosition, getImageDimensions, AutoPositionResult } from '@/utils/designPositioning';
import { MockupContainer } from './mockup/MockupContainer';
import { MockupStatusInfo } from './mockup/MockupStatusInfo';

interface MockupPreviewProps {
  mockupUrl?: string;
  designUrl?: string;
  designArea?: DesignArea;
  designPosition?: any;
  svgTemplateUrl?: string;
}

export const MockupPreview: React.FC<MockupPreviewProps> = ({
  mockupUrl,
  designUrl,
  designArea,
  designPosition,
  svgTemplateUrl
}) => {
  const [mockupLoaded, setMockupLoaded] = useState(false);
  const [designLoaded, setDesignLoaded] = useState(false);
  const [mockupError, setMockupError] = useState(false);
  const [designError, setDesignError] = useState(false);
  const [autoPosition, setAutoPosition] = useState<AutoPositionResult | null>(null);

  useEffect(() => {
    console.log('🖼️ MockupPreview props:', {
      mockupUrl: mockupUrl?.substring(0, 50) + '...',
      designUrl: designUrl?.substring(0, 50) + '...',
      designArea,
      designPosition,
      svgTemplateUrl: svgTemplateUrl?.substring(0, 50) + '...'
    });
  }, [mockupUrl, designUrl, designArea, designPosition, svgTemplateUrl]);

  // Calculer la position automatique quand le design et la zone sont disponibles
  useEffect(() => {
    if (designUrl && designArea && mockupLoaded) {
      console.log('🔄 Calcul de la position automatique...');
      
      getImageDimensions(designUrl)
        .then(dimensions => {
          const position = calculateAutoPosition(dimensions, designArea);
          setAutoPosition(position);
          console.log('✅ Position automatique calculée:', position);
        })
        .catch(error => {
          console.error('❌ Erreur calcul position:', error);
        });
    }
  }, [designUrl, designArea, mockupLoaded]);

  const handleMockupLoad = () => {
    console.log('✅ Mockup loaded successfully');
    setMockupLoaded(true);
    setMockupError(false);
  };

  const handleMockupError = () => {
    console.error('❌ Mockup failed to load:', mockupUrl);
    setMockupError(true);
    setMockupLoaded(false);
  };

  const handleDesignLoad = () => {
    console.log('✅ Design overlay loaded successfully');
    setDesignLoaded(true);
    setDesignError(false);
  };

  const handleDesignError = () => {
    console.error('❌ Design overlay failed to load:', designUrl);
    setDesignError(true);
    setDesignLoaded(false);
  };

  if (!mockupUrl) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Aperçu du produit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun aperçu disponible</p>
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
            svgTemplateUrl={svgTemplateUrl}
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
