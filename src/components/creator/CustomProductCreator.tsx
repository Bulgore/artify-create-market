
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimplifiedProductCreation } from './SimplifiedProductCreation';
import { useCustomProductCreator } from '@/hooks/useCustomProductCreator';

interface CustomProductCreatorProps {
  onBack?: () => void;
}

const CustomProductCreator: React.FC<CustomProductCreatorProps> = ({ onBack }) => {
  const {
    printProducts,
    isLoading,
    handleProductCreate
  } = useCustomProductCreator();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-2">Chargement des produits...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Créer un produit personnalisé</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Sélectionnez un produit, uploadez votre design et définissez vos paramètres de vente.
          </p>
          
          <SimplifiedProductCreation
            printProducts={printProducts}
            onProductCreate={handleProductCreate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomProductCreator;
