
import React from 'react';

export const CanvasHeader: React.FC = () => {
  return (
    <div className="text-center space-y-2">
      <h3 className="text-lg font-semibold text-gray-800">
        Aperçu de votre design
      </h3>
      <div className="flex items-center justify-center gap-2 text-sm text-green-600">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="font-medium">Positionnement automatique activé</span>
      </div>
      <p className="text-sm text-gray-600 max-w-md mx-auto">
        Votre design est automatiquement centré et dimensionné pour un rendu optimal sur le produit final.
      </p>
    </div>
  );
};
