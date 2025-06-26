
import React from 'react';

export const EditProductLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Chargement du produit...</p>
      </div>
    </div>
  );
};
