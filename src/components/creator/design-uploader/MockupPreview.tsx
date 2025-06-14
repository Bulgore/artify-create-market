
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import type { DesignArea } from '@/types/designArea';
import { calculateAutoPosition, getImageDimensions, AutoPositionResult } from '@/utils/designPositioning';

interface MockupPreviewProps {
  mockupUrl?: string;
  designUrl?: string;
  designArea?: DesignArea;
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

  useEffect(() => {
    console.log('🖼️ MockupPreview props:', {
      mockupUrl: mockupUrl?.substring(0, 50) + '...',
      designUrl: designUrl?.substring(0, 50) + '...',
      designArea,
      designPosition
    });
  }, [mockupUrl, designUrl, designArea, designPosition]);

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

  // Calculer la position de la zone d'impression pour l'affichage (en pourcentages du conteneur)
  const getPrintAreaDisplayStyle = () => {
    if (!designArea) return null;
    
    // Dimensions du conteneur d'affichage
    const containerWidth = 400;
    const containerHeight = 300;
    
    return {
      left: `${(designArea.x / containerWidth) * 100}%`,
      top: `${(designArea.y / containerHeight) * 100}%`,
      width: `${(designArea.width / containerWidth) * 100}%`,
      height: `${(designArea.height / containerHeight) * 100}%`
    };
  };

  // Calculer la position du design pour l'affichage
  const getDesignDisplayStyle = () => {
    if (!autoPosition) return null;
    
    const containerWidth = 400;
    const containerHeight = 300;
    
    return {
      left: `${(autoPosition.x / containerWidth) * 100}%`,
      top: `${(autoPosition.y / containerHeight) * 100}%`,
      width: `${(autoPosition.width / containerWidth) * 100}%`,
      height: `${(autoPosition.height / containerHeight) * 100}%`
    };
  };

  const printAreaStyle = getPrintAreaDisplayStyle();
  const designStyle = getDesignDisplayStyle();
  
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
          {/* Mockup background */}
          <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
            {mockupError ? (
              <div className="w-full h-full flex items-center justify-center text-red-500">
                <div className="text-center">
                  <p>❌ Erreur mockup</p>
                  <p className="text-xs mt-1">{mockupUrl.substring(0, 40)}...</p>
                </div>
              </div>
            ) : (
              <img
                src={mockupUrl}
                alt="Aperçu produit"
                className="w-full h-full object-contain"
                onLoad={handleMockupLoad}
                onError={handleMockupError}
              />
            )}
            
            {/* Zone d'impression - Gabarit visible */}
            {mockupLoaded && printAreaStyle && (
              <div
                className="absolute border-2 border-red-500 border-dashed bg-red-500 bg-opacity-10"
                style={printAreaStyle}
                title="Zone d'impression définie par l'administrateur"
              >
                <div className="absolute -top-6 left-0 text-xs text-red-600 bg-white px-2 py-1 rounded shadow">
                  Zone d'impression
                </div>
              </div>
            )}
            
            {/* Design positionné automatiquement */}
            {designUrl && autoPosition && designStyle && (
              <div
                className="absolute"
                style={designStyle}
              >
                {designError ? (
                  <div className="w-full h-full bg-red-100 border-2 border-red-300 rounded flex items-center justify-center">
                    <span className="text-red-500 text-xs">❌ Design</span>
                  </div>
                ) : (
                  <img
                    src={designUrl}
                    alt="Design"
                    className="w-full h-full object-contain rounded shadow-sm"
                    onLoad={handleDesignLoad}
                    onError={handleDesignError}
                  />
                )}
              </div>
            )}
          </div>
          
          {/* Informations techniques */}
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
                  {autoPosition ? '✅ Positionné automatiquement' : '⏳ Calcul position...'}
                </span>
              </div>
            )}
            
            {designArea && (
              <div className="text-blue-600">
                📍 Zone d'impression: {designArea.width}×{designArea.height}px à ({designArea.x}, {designArea.y})
              </div>
            )}
            
            {autoPosition && (
              <div className="text-green-600">
                ✨ Position calculée: {Math.round(autoPosition.width)}×{Math.round(autoPosition.height)}px 
                (échelle: {Math.round(autoPosition.scale * 100)}%)
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
