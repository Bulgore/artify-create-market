
import React from 'react';

interface EditProductHeaderProps {
  onBack: () => void;
}

export const EditProductHeader: React.FC<EditProductHeaderProps> = ({ onBack }) => {
  return (
    <button className="text-sm underline" onClick={onBack}>
      ← Retour
    </button>
  );
};
