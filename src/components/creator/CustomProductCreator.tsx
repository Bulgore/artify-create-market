
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useCustomProductCreator } from '@/hooks/useCustomProductCreator';
import ProductCreationForm from './ProductCreationForm';
import DesignPreviewSection from './DesignPreviewSection';

interface CustomProductCreatorProps {
  onBack: () => void;
}

const CustomProductCreator: React.FC<CustomProductCreatorProps> = ({ onBack }) => {
  const {
    printProducts,
    selectedProduct,
    designUrl,
    designPosition,
    isLoading,
    showPositioner,
    productData,
    setProductData,
    handleProductSelect,
    handleDesignUpload,
    handlePositionChange,
    calculateFinalPrice,
    handleSubmit
  } = useCustomProductCreator();

  const onSubmitWrapper = async (e: React.FormEvent) => {
    const success = await handleSubmit(e);
    if (success) {
      onBack();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold">Créer un produit personnalisé</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductCreationForm
          printProducts={printProducts}
          selectedProduct={selectedProduct}
          onProductSelect={handleProductSelect}
          designUrl={designUrl}
          onDesignUpload={handleDesignUpload}
          productData={productData}
          setProductData={setProductData}
          finalPrice={calculateFinalPrice()}
          isLoading={isLoading}
          canSubmit={!!designPosition}
          onSubmit={onSubmitWrapper}
        />

        <div>
          <DesignPreviewSection
            showPositioner={showPositioner}
            selectedProduct={selectedProduct}
            designUrl={designUrl}
            onPositionChange={handlePositionChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomProductCreator;
