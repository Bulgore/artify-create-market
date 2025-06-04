
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import type { DesignArea } from '@/types/designArea';

interface MockupPreviewProps {
  mockupUrl?: string;
  designUrl?: string;
  designArea?: DesignArea;
}

export const MockupPreview: React.FC<MockupPreviewProps> = ({
  mockupUrl,
  designUrl,
  designArea
}) => {
  const [mockupLoaded, setMockupLoaded] = useState(false);
  const [designLoaded, setDesignLoaded] = useState(false);
  const [mockupError, setMockupError] = useState(false);
  const [designError, setDesignError] = useState(false);

  useEffect(() => {
    console.log('🖼️ MockupPreview props:', {
      mockupUrl: mockupUrl?.substring(0, 50) + '...',
      designUrl: designUrl?.substring(0, 50) + '...',
      designArea
    });
  }, [mockupUrl, designUrl, designArea]);

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
            
            {/* Design overlay */}
            {designUrl && mockupLoaded && designArea && (
              <div
                className="absolute"
                style={{
                  left: `${designArea.x}%`,
                  top: `${designArea.y}%`,
                  width: `${designArea.width}%`,
                  height: `${designArea.height}%`,
                }}
              >
                {designError ? (
                  <div className="w-full h-full bg-red-100 border-2 border-red-300 rounded flex items-center justify-center">
                    <span className="text-red-500 text-xs">❌ Design</span>
                  </div>
                ) : (
                  <img
                    src={designUrl}
                    alt="Design"
                    className="w-full h-full object-contain"
                    onLoad={handleDesignLoad}
                    onError={handleDesignError}
                  />
                )}
              </div>
            )}
          </div>
          
          {/* Status indicators */}
          <div className="mt-2 text-xs text-gray-500">
            <div>Mockup: {mockupLoaded ? '✅' : mockupError ? '❌' : '⏳'}</div>
            {designUrl && <div>Design: {designLoaded ? '✅' : designError ? '❌' : '⏳'}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
