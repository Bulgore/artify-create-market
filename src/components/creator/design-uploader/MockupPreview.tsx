
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import type { DesignArea } from '@/types/designArea';

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

  useEffect(() => {
    console.log('🖼️ MockupPreview props:', {
      mockupUrl: mockupUrl?.substring(0, 50) + '...',
      designUrl: designUrl?.substring(0, 50) + '...',
      designArea,
      designPosition
    });
  }, [mockupUrl, designUrl, designArea, designPosition]);

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

  // ✅ CORRECTION: Utiliser les vraies dimensions de la zone d'impression pour centrer le design
  const getDesignPositionInPrintArea = () => {
    if (!designArea) {
      console.warn('⚠️ Aucune zone d\'impression définie, utilisation position par défaut');
      return {
        left: '25%',
        top: '30%',
        width: '50%',
        height: '40%'
      };
    }

    console.log('📐 Calcul position avec zone d\'impression:', designArea);

    // Convertir les coordonnées absolues de la zone d'impression en pourcentages du mockup
    // Note: Ces valeurs devraient idéalement venir des dimensions réelles du mockup
    const mockupWidth = 400; // Largeur du conteneur mockup
    const mockupHeight = 400; // Hauteur du conteneur mockup
    
    // Position et taille de la zone d'impression en pourcentages
    const printAreaLeft = (designArea.x / mockupWidth) * 100;
    const printAreaTop = (designArea.y / mockupHeight) * 100;
    const printAreaWidth = (designArea.width / mockupWidth) * 100;
    const printAreaHeight = (designArea.height / mockupHeight) * 100;
    
    // Le design occupe 90% de la zone d'impression (marge de sécurité)
    const designSizeRatio = 0.9;
    const designWidth = printAreaWidth * designSizeRatio;
    const designHeight = printAreaHeight * designSizeRatio;
    
    // Centrer le design dans la zone d'impression
    const designLeft = printAreaLeft + (printAreaWidth - designWidth) / 2;
    const designTop = printAreaTop + (printAreaHeight - designHeight) / 2;

    console.log('🎯 Position calculée:', {
      printArea: { left: printAreaLeft, top: printAreaTop, width: printAreaWidth, height: printAreaHeight },
      design: { left: designLeft, top: designTop, width: designWidth, height: designHeight }
    });

    return {
      left: `${designLeft}%`,
      top: `${designTop}%`,
      width: `${designWidth}%`,
      height: `${designHeight}%`
    };
  };

  const designStyle = getDesignPositionInPrintArea();

  // Calculer la position de la zone d'impression pour l'affichage
  const getPrintAreaStyle = () => {
    if (!designArea) return null;
    
    const mockupWidth = 400;
    const mockupHeight = 400;
    
    return {
      left: `${(designArea.x / mockupWidth) * 100}%`,
      top: `${(designArea.y / mockupHeight) * 100}%`,
      width: `${(designArea.width / mockupWidth) * 100}%`,
      height: `${(designArea.height / mockupHeight) * 100}%`
    };
  };

  const printAreaStyle = getPrintAreaStyle();
  
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
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
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
            
            {/* Zone d'impression - Affichage du gabarit */}
            {mockupLoaded && printAreaStyle && (
              <div
                className="absolute border-2 border-red-500 border-dashed bg-red-500 bg-opacity-10"
                style={printAreaStyle}
                title="Zone d'impression définie par l'administrateur"
              >
                <div className="absolute -top-6 left-0 text-xs text-red-600 bg-white px-1 rounded">
                  Zone d'impression
                </div>
              </div>
            )}
            
            {/* Design overlay - POSITION AUTOMATIQUE DANS LA ZONE D'IMPRESSION */}
            {designUrl && mockupLoaded && (
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
                    className="w-full h-full object-contain rounded"
                    onLoad={handleDesignLoad}
                    onError={handleDesignError}
                  />
                )}
              </div>
            )}
          </div>
          
          {/* Status indicators */}
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <div>Mockup: {mockupLoaded ? '✅ Chargé' : mockupError ? '❌ Erreur' : '⏳ Chargement'}</div>
            {designUrl && (
              <div>Design: {designLoaded ? '✅ Positionné automatiquement' : designError ? '❌ Erreur' : '⏳ Positionnement auto'}</div>
            )}
            {designArea && (
              <div className="text-blue-600">📍 Zone d'impression: {designArea.width}x{designArea.height}px à ({designArea.x}, {designArea.y})</div>
            )}
            <div className="text-green-600">✨ Position: Centrée automatiquement dans la zone d'impression</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
