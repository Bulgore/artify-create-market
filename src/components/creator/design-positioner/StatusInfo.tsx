
import React from 'react';

interface StatusInfoProps {
  imageLoaded: boolean;
  imageError: boolean;
  templateLoaded: boolean;
  templateError: boolean;
  designArea: { width: number; height: number; x: number; y: number };
  imageUrl: string;
}

export const StatusInfo: React.FC<StatusInfoProps> = ({
  imageLoaded,
  imageError,
  templateLoaded,
  templateError,
  designArea,
  imageUrl
}) => {
  return (
    <div className="mt-4 p-3 bg-gray-100 rounded text-sm space-y-1">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${imageLoaded ? 'bg-green-500' : imageError ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
        <span>Design: {imageLoaded ? 'Chargé' : imageError ? 'Erreur de chargement' : 'Chargement...'}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${templateLoaded ? 'bg-green-500' : templateError ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
        <span>Template: {templateLoaded ? 'Chargé' : templateError ? 'Erreur' : 'Chargement...'}</span>
      </div>
      <div className="text-xs text-gray-600">
        Zone d'impression: {designArea.width}×{designArea.height}px (x:{designArea.x}, y:{designArea.y})
      </div>
      {imageUrl && (
        <div className="text-xs text-gray-600 truncate">
          URL: {imageUrl.substring(0, 60)}...
        </div>
      )}
    </div>
  );
};
