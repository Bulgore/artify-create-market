
import React from 'react';

interface EditProductErrorProps {
  error: string;
  onRetry: () => void;
  onBack: () => void;
}

export const EditProductError: React.FC<EditProductErrorProps> = ({ 
  error, 
  onRetry, 
  onBack 
}) => {
  return (
    <div className="p-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onRetry}
          >
            Réessayer
          </button>
          <button 
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={onBack}
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
};
