
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import type { PrintArea } from '@/types/printArea';
import type { DesignPosition } from '@/types/design';
import { getPrimaryMockupUrl } from '@/utils/mockupUtils';

interface MockupPreviewProps {
  mockupUrl?: string;
  designUrl?: string;
  designArea?: PrintArea;
  designPosition?: DesignPosition;
}

export const MockupPreview: React.FC<MockupPreviewProps> = ({
  mockupUrl,
  designUrl,
  designArea,
  designPosition
}) => {
  const [mockupLoaded, setMockupLoaded] = useState(false);
  const [mockupError, setMockupError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

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

  const handleMockupLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('✅ [MockupPreview] Mockup chargé');
    const img = e.currentTarget;
    setMockupLoaded(true);
    setMockupError(false);
    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    if (containerRef.current) {
      setContainerSize({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }
  };

  const handleMockupError = () => {
    console.error('❌ [MockupPreview] Erreur mockup:', mockupUrl);
    setMockupError(true);
    setMockupLoaded(false);
  };

  const scaleX = naturalSize.width ? containerSize.width / naturalSize.width : 1;
  const scaleY = naturalSize.height ? containerSize.height / naturalSize.height : 1;

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

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
            <div ref={containerRef} className="relative w-full h-80 bg-gray-100 overflow-hidden">
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
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: `${designPosition.x * scaleX}px`,
                    top: `${designPosition.y * scaleY}px`,
                    width: `${designPosition.width * scaleX}px`,
                    height: `${designPosition.height * scaleY}px`,
                    transform: designPosition.rotation ? `rotate(${designPosition.rotation}deg)` : 'none',
                    zIndex: 10
                  }}
                >
                  <img
                    src={designUrl}
                    alt="Design du produit"
                    className="w-full h-full object-contain border-2 border-green-400 shadow-md rounded"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  />
                </div>
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
