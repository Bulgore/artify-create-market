
import React from 'react';

interface EditProductNotFoundProps {
  onBack: () => void;
}

export const EditProductNotFound: React.FC<EditProductNotFoundProps> = ({ onBack }) => {
  return (
    <div className="p-8">
      <div className="text-center text-gray-500">
        <p>Produit non trouvé</p>
        <button className="mt-4 px-4 py-2 bg-gray-600 text-white rounded" onClick={onBack}>
          Retour
        </button>
      </div>
    </div>
  );
};
