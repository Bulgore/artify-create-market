
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import type { PrintArea } from '@/types/printArea';
import { getPrimaryMockupUrl } from '@/utils/mockupUtils';

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
  const [mockupError, setMockupError] = useState(false);

  // Reset des états quand l'URL change
  useEffect(() => {
    setMockupLoaded(false);
    setMockupError(false);
  }, [mockupUrl]);

  console.log('🖼️ [MockupPreview] Rendu avec:', {
    mockupUrl: mockupUrl?.substring(0, 50) + '...',
    designUrl: designUrl?.substring(0, 50) + '...',
    hasDesignArea: !!designArea,
    hasDesignPosition: !!designPosition
  });

  const handleMockupLoad = () => {
    console.log('✅ [MockupPreview] Mockup chargé');
    setMockupLoaded(true);
    setMockupError(false);
  };

  const handleMockupError = () => {
    console.error('❌ [MockupPreview] Erreur mockup:', mockupUrl);
    setMockupError(true);
    setMockupLoaded(false);
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
          <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed border-gray-300">
            <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 font-medium">Aucun aperçu disponible</p>
            <p className="text-xs text-gray-400 mt-2">Le produit sélectionné n'a pas de mockup configuré</p>
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
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <div className="bg-gray-100 px-3 py-2 border-b">
              <h4 className="text-sm font-medium text-gray-700">👕 Mockup du produit</h4>
            </div>
            <div className="relative w-full h-80 bg-gray-100 overflow-hidden">
              {mockupError ? (
                <div className="w-full h-full flex items-center justify-center text-red-500">
                  <div className="text-center">
                    <p>❌ Erreur de chargement</p>
                    <p className="text-xs mt-1">Mockup indisponible</p>
                  </div>
                </div>
              ) : (
                <img
                  src={mockupUrl}
                  alt="Mockup du produit"
                  className="w-full h-full object-contain"
                  onLoad={handleMockupLoad}
                  onError={handleMockupError}
                />
              )}
              
              {/* Overlay design si disponible */}
              {designUrl && designPosition && mockupLoaded && (
                <img
                  src={designUrl}
                  alt="Design du produit"
                  className="absolute object-contain border-2 border-green-400 shadow-md"
                  style={{
                    // Utilisation des coordonnées EXACTES de la zone d'impression admin
                    left: `${(designPosition.x / 400) * 100}%`,
                    top: `${(designPosition.y / 400) * 100}%`,
                    width: `${(designPosition.width / 400) * 100}%`,
                    height: `${(designPosition.height / 400) * 100}%`,
                    transform: designPosition.rotation ? `rotate(${designPosition.rotation}deg)` : 'none'
                  }}
                />
              )}
            </div>
          </div>
          
          {/* Info de debug simplifiée */}
          <div className="mt-4 text-xs bg-gray-100 p-3 rounded border">
            <div className="font-bold text-gray-700 mb-1">État du mockup:</div>
            <div className="text-gray-600">
              {mockupLoaded ? '✅ Chargé' : mockupError ? '❌ Erreur' : '⏳ Chargement...'}
            </div>
            {designPosition && (
              <div className="mt-2">
                <div className="font-bold text-gray-700">Position du design:</div>
                <div className="text-gray-600">
                  📐 {Math.round(designPosition.width || 0)}×{Math.round(designPosition.height || 0)}px
                  | 🔍 {Math.round((designPosition.scale || 1) * 100)}%
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
