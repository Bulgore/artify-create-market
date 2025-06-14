
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

  // ✅ CORRECTION: Calcul de position centrée basé sur les dimensions réelles du conteneur
  const getCenteredPosition = () => {
    if (!designArea) {
      // Position par défaut centrée
      return {
        left: '30%',
        top: '40%',
        width: '40%',
        height: '20%'
      };
    }

    // Convertir les valeurs de design area en pourcentages du conteneur
    const containerWidth = 100; // 100% du conteneur
    const containerHeight = 100; // 100% du conteneur
    
    // Calculer la position centrée avec une taille optimale
    const designWidth = Math.min(containerWidth * 0.4, 40); // 40% max du conteneur
    const designHeight = Math.min(containerHeight * 0.3, 30); // 30% max du conteneur
    
    const centerX = (containerWidth - designWidth) / 2;
    const centerY = (containerHeight - designHeight) / 2 + 10; // Légèrement vers le haut
    
    return {
      left: `${centerX}%`,
      top: `${centerY}%`,
      width: `${designWidth}%`,
      height: `${designHeight}%`
    };
  };

  const centeredStyle = getCenteredPosition();
  
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
            
            {/* Design overlay - POSITION CENTRÉE AUTOMATIQUE */}
            {designUrl && mockupLoaded && (
              <div
                className="absolute"
                style={centeredStyle}
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
              <div>Design: {designLoaded ? '✅ Centré automatiquement' : designError ? '❌ Erreur' : '⏳ Positionnement auto'}</div>
            )}
            <div className="text-green-600">📍 Position: Centrée automatiquement</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
