
import React from 'react';

interface MockupImageProps {
  mockupUrl: string;
  onLoad: () => void;
  onError: () => void;
}

export const MockupImage: React.FC<MockupImageProps> = ({
  mockupUrl,
  onLoad,
  onError
}) => {
  return (
    <img
      src={mockupUrl}
      alt="Aperçu produit"
      className="w-full h-full object-contain"
      onLoad={onLoad}
      onError={onError}
    />
  );
};
