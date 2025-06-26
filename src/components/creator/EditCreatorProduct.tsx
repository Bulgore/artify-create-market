
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
import { buildImageUrl } from '@/utils/imageUrl';

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
  const [error, setError] = useState<string | null>(null);

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
    console.log('🔍 [EditCreatorProduct] Début du chargement du produit:', productId);
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 [EditCreatorProduct] Utilisateur actuel:', user?.id);

      // Requête pour récupérer le produit créateur avec son print_product
      console.log('📡 [EditCreatorProduct] Exécution de la requête SELECT...');
      const { data, error } = await supabase
        .from('creator_products')
        .select(`
          *,
          print_products!inner(
            *
          )
        `)
        .eq('id', productId)
        .single();

      console.log('📊 [EditCreatorProduct] Résultat de la requête:', {
        data: data ? 'Données reçues' : 'Pas de données',
        error: error,
        productId: productId,
        creatorId: data?.creator_id,
        currentUserId: user?.id,
        status: data?.status,
        isPublished: data?.is_published
      });

      if (error) {
        console.error('❌ [EditCreatorProduct] Erreur Supabase:', error);
        throw new Error(`Erreur database: ${error.message} (Code: ${error.code})`);
      }

      if (!data) {
        console.error('❌ [EditCreatorProduct] Aucune donnée retournée pour le produit:', productId);
        throw new Error('Produit introuvable');
      }

      // Vérification des permissions
      if (data.creator_id !== user?.id) {
        console.error('❌ [EditCreatorProduct] Permission refusée:', {
          productCreatorId: data.creator_id,
          currentUserId: user?.id
        });
        throw new Error('Vous n\'êtes pas autorisé à modifier ce produit');
      }

      console.log('✅ [EditCreatorProduct] Données du produit chargées:', {
        name: data.name_fr,
        printProductId: data.print_product_id,
        designUrl: data.original_design_url
      });

      // Mapper le produit d'impression
      if (!data.print_products) {
        console.error('❌ [EditCreatorProduct] Pas de print_products associé');
        throw new Error('Produit d\'impression non trouvé');
      }

      const mapped = mapPrintProductWithCompatibility(data.print_products);
      
      // Récupérer le template séparément
      if (mapped.template_id) {
        console.log('🔍 [EditCreatorProduct] Récupération du template:', mapped.template_id);
        const { data: templateData } = await supabase
          .from('product_templates')
          .select('*')
          .eq('id', mapped.template_id)
          .single();

        if (templateData) {
          mapped.product_templates = templateData;
          console.log('✅ [EditCreatorProduct] Template récupéré:', templateData.name_fr);

          // Récupérer les mockups du template
          const { data: mockupsData } = await supabase
            .from('product_mockups')
            .select('*')
            .eq('product_template_id', templateData.id)
            .order('display_order');

          if (mockupsData && mockupsData.length > 0) {
            mapped.product_templates.product_mockups = mockupsData.map(m => ({
              ...m,
              mockup_url: buildImageUrl(m.mockup_url),
              url: buildImageUrl(m.mockup_url)
            }));
            console.log('✅ [EditCreatorProduct] Mockups récupérés:', mockupsData.length);
          } else {
            console.warn('⚠️ [EditCreatorProduct] Aucun mockup trouvé pour ce template');
          }
        }
      }

      setPrintProduct(mapped);
      
      // Configuration des données du produit
      const designUrl = data.original_design_url || '';
      setDesignUrl(designUrl);
      setProductData({
        name: data.name_fr || '',
        description: data.description_fr || '',
        margin_percentage: data.creator_margin_percentage || 20
      });

      console.log('🎨 [EditCreatorProduct] Configuration du design:', {
        designUrl: designUrl,
        hasDesign: !!designUrl
      });

      // Calcul de la position du design si présent
      if (designUrl && mapped) {
        await calculateDesignPosition(designUrl, mapped);
      }

      console.log('✅ [EditCreatorProduct] Chargement terminé avec succès');

    } catch (error: any) {
      console.error('💥 [EditCreatorProduct] Erreur lors du chargement:', error);
      setError(error.message || 'Erreur lors du chargement du produit');
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || "Impossible de charger le produit."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDesignUpload = async (url: string) => {
    console.log('📤 [EditCreatorProduct] Upload du design:', url);
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

  // Fonction pour obtenir l'URL du mockup principal
  const getPrimaryMockupUrl = () => {
    if (!printProduct?.product_templates?.product_mockups || !Array.isArray(printProduct.product_templates.product_mockups)) {
      console.warn('⚠️ [EditCreatorProduct] Aucun mockup disponible');
      return undefined;
    }

    // Chercher le mockup principal
    const primaryMockup = printProduct.product_templates.product_mockups.find(
      m => m.id === printProduct.product_templates?.primary_mockup_id
    );

    if (primaryMockup) {
      return buildImageUrl(primaryMockup.mockup_url);
    }

    // Fallback sur le premier mockup
    const firstMockup = printProduct.product_templates.product_mockups[0];
    if (firstMockup) {
      return buildImageUrl(firstMockup.mockup_url);
    }

    return undefined;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-2">
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={fetchProduct}
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
  }

  if (!printProduct) {
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
  }

  return (
    <div className="space-y-6">
      <button className="text-sm underline" onClick={onBack}>← Retour</button>
      
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
            mockupUrl={getPrimaryMockupUrl()}
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
