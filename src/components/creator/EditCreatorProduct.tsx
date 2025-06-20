import React, { useEffect, useState } from 'react';
import { DesignUploadHandler } from './simplified/DesignUploadHandler';
import { MockupSection } from './simplified/MockupSection';
import { ProductCreationForm } from './simplified/ProductCreationForm';
import { useDesignPositioning } from '@/hooks/useDesignPositioning';
import { useProductData } from '@/hooks/useProductData';
import { mapPrintProductWithCompatibility } from '@/types/customProduct';
import type { PrintProduct } from '@/types/customProduct';
import { supabase } from '@/integrations/supabase/client';
import { useCreatorProductUpdate } from '@/hooks/useCreatorProductUpdate';
import { toast } from '@/hooks/use-toast';

interface EditCreatorProductProps {
  productId: string;
  onUpdated: () => void;
  onBack: () => void;
}

export const EditCreatorProduct: React.FC<EditCreatorProductProps> = ({
  productId,
  onUpdated,
  onBack
}) => {
  const [loading, setLoading] = useState(true);
  const [printProduct, setPrintProduct] = useState<PrintProduct | null>(null);
  const [designUrl, setDesignUrl] = useState('');

  const {
    autoDesignPosition,
    designArea,
    calculateDesignPosition,
    resetDesignPosition
  } = useDesignPositioning();

  const { productData, setProductData } = useProductData();
  const { isLoading, handleUpdate } = useCreatorProductUpdate(productId);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('creator_products')
      .select(`*, print_products(*, product_templates(*, product_mockups(id,mockup_url,mockup_name,print_area,is_primary,display_order)))`)
      .eq('id', productId)
      .single();

    if (error || !data) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "Impossible de charger le produit."
      });
      return;
    }

    const mapped = mapPrintProductWithCompatibility(data.print_products);
    setPrintProduct(mapped);
    setDesignUrl(data.original_design_url || '');
    setProductData({
      name: data.name_fr || '',
      description: data.description_fr || '',
      margin_percentage: data.creator_margin_percentage || 20
    });
    await calculateDesignPosition(data.original_design_url || '', mapped);
    setLoading(false);
  };

  const handleDesignUpload = async (url: string) => {
    setDesignUrl(url);
    resetDesignPosition();
    await calculateDesignPosition(url, printProduct);
  };

  const submit = async () => {
    const success = await handleUpdate(designUrl, autoDesignPosition, productData);
    if (success) {
      onUpdated();
    }
  };

  if (loading || !printProduct) return <div>Chargement...</div>;

  return (
    <div className="space-y-6">
      <button className="text-sm underline" onClick={onBack}>Retour</button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <DesignUploadHandler
            selectedProduct={printProduct}
            designUrl={designUrl}
            autoDesignPosition={autoDesignPosition}
            onDesignUpload={handleDesignUpload}
            onDesignRemove={() => setDesignUrl('')}
          />
        </div>
        <div className="space-y-6">
          <MockupSection
            mockupUrl={
              Array.isArray(printProduct.product_templates?.product_mockups)
                ? printProduct.product_templates?.product_mockups.find(
                    m => m.id === printProduct.product_templates?.primary_mockup_id
                  )?.mockup_url
                : undefined
            }
            designUrl={designUrl}
            designArea={designArea || undefined}
            designPosition={autoDesignPosition}
          />

          <ProductCreationForm
            selectedProduct={printProduct}
            designUrl={designUrl}
            productData={productData}
            setProductData={setProductData}
            autoDesignPosition={autoDesignPosition}
            onSubmit={submit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
