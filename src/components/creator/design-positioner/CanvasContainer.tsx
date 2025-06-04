
import React from 'react';

interface CanvasContainerProps {
  templateLoaded: boolean;
  imageLoaded: boolean;
  imageError: boolean;
  designUrl: string;
  isDesignOutOfBounds: boolean;
  children: React.ReactNode;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({
  templateLoaded,
  imageLoaded,
  imageError,
  designUrl,
  isDesignOutOfBounds,
  children
}) => {
  return (
    <div className="border-2 border-gray-300 rounded-xl p-6 bg-white shadow-lg">
      <div className="mb-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Zone d'impression délimitée
        </div>
      </div>
      
      {children}

      {/* Indicateurs de statut en bas */}
      <div className="mt-4 flex justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${templateLoaded ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-gray-600">Template {templateLoaded ? 'chargé' : 'en attente'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${imageLoaded ? 'bg-green-500' : designUrl ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
          <span className="text-gray-600">Design {imageLoaded ? 'prêt' : designUrl ? 'chargement...' : 'en attente'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isDesignOutOfBounds ? 'bg-red-500' : imageLoaded ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-gray-600">Position {isDesignOutOfBounds ? 'incorrecte' : imageLoaded ? 'valide' : 'en attente'}</span>
        </div>
      </div>
    </div>
  );
};
