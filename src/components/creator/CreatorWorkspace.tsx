
import React from 'react';
import { SimpleDesignUploader } from './design-uploader/SimpleDesignUploader';
import { DesignPreview } from './design-uploader/DesignPreview';
import { MockupPreview } from './design-uploader/MockupPreview';
import DesignPreviewSection from './DesignPreviewSection';
import ProductSelector from './ProductSelector';
import ProductDetailsForm from './ProductDetailsForm';
import { useDesignManagement } from '@/hooks/useDesignManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Package, Settings, Eye } from 'lucide-react';

const CreatorWorkspace: React.FC = () => {
  const {
    designUrl,
    designPosition,
    showPositioner,
    handleDesignUpload,
    handlePositionChange,
    resetDesign
  } = useDesignManagement();

  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [productData, setProductData] = React.useState({
    name: '',
    description: '',
    margin_percentage: 20
  });

  console.log('🎨 CreatorWorkspace state:', {
    designUrl: designUrl?.substring(0, 50) + '...',
    selectedProduct: selectedProduct?.name,
    showPositioner,
    designPosition
  });

  // Calcul du prix final
  const basePrice = selectedProduct?.base_price || 0;
  const finalPrice = basePrice * (1 + productData.margin_percentage / 100);

  // Validation pour soumettre
  const canSubmit = selectedProduct && designUrl && productData.name.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    console.log('Submitting product:', {
      selectedProduct,
      designUrl,
      designPosition,
      productData,
      finalPrice
    });
    // TODO: Implémenter la soumission
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Studio Créateur</h1>
        <p className="text-blue-100">Créez et personnalisez vos produits uniques</p>
      </div>

      {/* Étape 1: Sélection du produit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Étape 1: Choisir un produit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProductSelector onProductSelect={setSelectedProduct} />
        </CardContent>
      </Card>

      {/* Étape 2: Upload du design */}
      {selectedProduct && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Étape 2: Uploader votre design
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleDesignUploader onDesignUpload={handleDesignUpload} />
          </CardContent>
        </Card>
      )}

      {/* Aperçu du design uploadé */}
      {designUrl && (
        <DesignPreview designUrl={designUrl} onRemove={resetDesign} />
      )}

      {/* Étape 3: Positionnement + Aperçu en temps réel */}
      {showPositioner && selectedProduct && designUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colonne gauche: Éditeur de positionnement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Étape 3: Positionner votre design
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DesignPreviewSection
                showPositioner={showPositioner}
                selectedProduct={selectedProduct}
                designUrl={designUrl}
                onPositionChange={handlePositionChange}
              />
            </CardContent>
          </Card>

          {/* Colonne droite: Aperçu mockup temps réel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Aperçu temps réel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MockupPreview
                mockupUrl={selectedProduct.product_templates?.mockup_image_url}
                designUrl={designUrl}
                designArea={designPosition ? {
                  x: (designPosition.x / 400) * 100,
                  y: (designPosition.y / 400) * 100,
                  width: (designPosition.width / 400) * 100,
                  height: (designPosition.height / 400) * 100
                } : undefined}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Étape 4: Détails du produit */}
      {selectedProduct && designUrl && (
        <ProductDetailsForm
          productData={productData}
          setProductData={setProductData}
          finalPrice={finalPrice}
          isLoading={false}
          canSubmit={!!canSubmit}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default CreatorWorkspace;
