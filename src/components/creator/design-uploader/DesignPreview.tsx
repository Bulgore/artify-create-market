
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface DesignPreviewProps {
  designUrl: string;
  onRemove: () => void;
}

export const DesignPreview: React.FC<DesignPreviewProps> = ({
  designUrl,
  onRemove
}) => {
  if (!designUrl) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <p className="text-gray-500">Aucun design uploadé</p>
            <p className="text-sm text-gray-400 mt-2">
              Uploadez un fichier PNG, SVG ou JPEG
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Design uploadé</h3>
            <button
              onClick={onRemove}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Supprimer
            </button>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <img
              src={designUrl}
              alt="Design uploadé"
              className="w-full h-48 object-contain rounded"
              onError={(e) => {
                console.error('Erreur de chargement de l\'image:', designUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          
          <div className="text-sm text-gray-600">
            <p>URL: {designUrl.substring(0, 50)}...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
