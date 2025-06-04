
import React from 'react';
import { SimpleDesignUploader } from './design-uploader/SimpleDesignUploader';
import { DesignPreview } from './design-uploader/DesignPreview';
import { MockupPreview } from './design-uploader/MockupPreview';
import DesignPreviewSection from './DesignPreviewSection';
import ProductSelector from './ProductSelector';
import { useDesignManagement } from '@/hooks/useDesignManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Package, Settings } from 'lucide-react';

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

  console.log('🎨 CreatorWorkspace state:', {
    designUrl: designUrl?.substring(0, 50) + '...',
    selectedProduct: selectedProduct?.name,
    showPositioner,
    designPosition
  });

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

      {/* Étape 3: Positionnement (CRITIQUE!) */}
      {showPositioner && selectedProduct && designUrl && (
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
      )}

      {/* Aperçu du mockup final */}
      {selectedProduct && designUrl && designPosition && (
        <MockupPreview
          mockupUrl={selectedProduct.product_templates?.mockup_image_url}
          designUrl={designUrl}
          designArea={{
            x: (designPosition.x / 400) * 100,
            y: (designPosition.y / 400) * 100,
            width: (designPosition.width / 400) * 100,
            height: (designPosition.height / 400) * 100
          }}
        />
      )}
    </div>
  );
};

export default CreatorWorkspace;
