
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DesignArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

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
  if (!mockupUrl || !designUrl) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aperçu du mockup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              {!designUrl ? "Uploadez un design" : "Mockup non disponible"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aperçu du mockup</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <img
            src={mockupUrl}
            alt="Mockup du produit"
            className="w-full h-auto rounded-lg"
          />
          
          {designArea && (
            <div 
              className="absolute border-2 border-blue-500 border-dashed bg-blue-100 bg-opacity-50"
              style={{
                left: `${(designArea.x / 400) * 100}%`,
                top: `${(designArea.y / 400) * 100}%`,
                width: `${(designArea.width / 400) * 100}%`,
                height: `${(designArea.height / 400) * 100}%`,
              }}
            >
              {designUrl && (
                <img
                  src={designUrl}
                  alt="Design"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          )}
        </div>
        
        {designArea && (
          <div className="mt-4 text-sm text-gray-600">
            <p>Zone d'impression: {designArea.width}×{designArea.height}px</p>
            <p>Position: x={designArea.x}, y={designArea.y}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
