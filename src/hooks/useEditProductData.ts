
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { mapPrintProductWithCompatibility } from '@/types/customProduct';
import { mapTemplateWithCompatibility } from '@/types/templates';
import type { PrintProduct } from '@/types/customProduct';
import { toast } from '@/hooks/use-toast';
import { buildImageUrl } from '@/utils/imageUrl';

export const useEditProductData = () => {
  const [loading, setLoading] = useState(true);
  const [printProduct, setPrintProduct] = useState<PrintProduct | null>(null);
  const [designUrl, setDesignUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async (productId: string) => {
    console.log('🔍 [useEditProductData] Début du chargement du produit:', productId);
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 [useEditProductData] Utilisateur actuel:', user?.id);

      // Requête pour récupérer le produit créateur avec son print_product
      console.log('📡 [useEditProductData] Exécution de la requête SELECT...');
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

      console.log('📊 [useEditProductData] Résultat de la requête:', {
        data: data ? 'Données reçues' : 'Pas de données',
        error: error,
        productId: productId,
        creatorId: data?.creator_id,
        currentUserId: user?.id,
        status: data?.status,
        isPublished: data?.is_published
      });

      if (error) {
        console.error('❌ [useEditProductData] Erreur Supabase:', error);
        throw new Error(`Erreur database: ${error.message} (Code: ${error.code})`);
      }

      if (!data) {
        console.error('❌ [useEditProductData] Aucune donnée retournée pour le produit:', productId);
        throw new Error('Produit introuvable');
      }

      // Vérification des permissions
      if (data.creator_id !== user?.id) {
        console.error('❌ [useEditProductData] Permission refusée:', {
          productCreatorId: data.creator_id,
          currentUserId: user?.id
        });
        throw new Error('Vous n\'êtes pas autorisé à modifier ce produit');
      }

      console.log('✅ [useEditProductData] Données du produit chargées:', {
        name: data.name_fr,
        printProductId: data.print_product_id,
        designUrl: data.original_design_url
      });

      // Mapper le produit d'impression
      if (!data.print_products) {
        console.error('❌ [useEditProductData] Pas de print_products associé');
        throw new Error('Produit d\'impression non trouvé');
      }

      const mapped = mapPrintProductWithCompatibility(data.print_products);
      
      // Récupérer le template séparément avec compatibilité
      if (mapped.template_id) {
        console.log('🔍 [useEditProductData] Récupération du template:', mapped.template_id);
        const { data: templateData } = await supabase
          .from('product_templates')
          .select('*')
          .eq('id', mapped.template_id)
          .single();

        if (templateData) {
          // Utiliser la fonction de compatibilité pour mapper le template
          const mappedTemplate = mapTemplateWithCompatibility(templateData);
          // Ensure compatibility with both template types and include all required fields
          mapped.product_templates = {
            ...mappedTemplate,
            name: mappedTemplate.name || mappedTemplate.name_fr || '',
            technical_instructions: mappedTemplate.technical_instructions || mappedTemplate.technical_instructions_fr || '',
            created_by: templateData.created_by || user?.id || '',
            updated_at: templateData.updated_at || new Date().toISOString()
          };
          console.log('✅ [useEditProductData] Template récupéré:', mapped.product_templates.name);

          // Récupérer les mockups du template avec validation d'URL
          const { data: mockupsData } = await supabase
            .from('product_mockups')
            .select('*')
            .eq('product_template_id', templateData.id)
            .order('display_order');

          if (mockupsData && mockupsData.length > 0) {
            // Filtrer et valider les URLs des mockups
            const validMockups = mockupsData
              .filter(m => m.mockup_url && typeof m.mockup_url === 'string')
              .map(m => {
                let processedUrl = m.mockup_url;
                
                // Nettoyer l'URL si elle contient des caractères invalides
                if (processedUrl.includes('.js')) {
                  console.warn('⚠️ [useEditProductData] URL mockup invalide détectée:', processedUrl);
                  // Essayer de récupérer une URL valide ou utiliser un placeholder
                  processedUrl = '/placeholder.svg';
                }
                
                return {
                  ...m,
                  mockup_url: buildImageUrl(processedUrl),
                  url: buildImageUrl(processedUrl)
                };
              });

            if (validMockups.length > 0) {
              mapped.product_templates.product_mockups = validMockups;
              console.log('✅ [useEditProductData] Mockups valides récupérés:', validMockups.length);
            } else {
              console.warn('⚠️ [useEditProductData] Aucun mockup valide trouvé, utilisation du placeholder');
              mapped.product_templates.product_mockups = [{
                id: 'placeholder',
                mockup_url: '/placeholder.svg',
                url: '/placeholder.svg',
                mockup_name: 'Placeholder',
                product_template_id: templateData.id,
                display_order: 0,
                is_primary: true,
                print_area: null,
                has_print_area: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }];
            }
          } else {
            console.warn('⚠️ [useEditProductData] Aucun mockup trouvé pour ce template');
            // Ajouter un mockup placeholder
            mapped.product_templates.product_mockups = [{
              id: 'placeholder',
              mockup_url: '/placeholder.svg',
              url: '/placeholder.svg',
              mockup_name: 'Placeholder',
              product_template_id: templateData.id,
              display_order: 0,
              is_primary: true,
              print_area: null,
              has_print_area: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }];
          }
        }
      }

      setPrintProduct(mapped);
      
      // Configuration des données du produit
      const designUrl = data.original_design_url || '';
      setDesignUrl(designUrl);

      console.log('✅ [useEditProductData] Chargement terminé avec succès');
      return { product: data, designUrl };

    } catch (error: any) {
      console.error('💥 [useEditProductData] Erreur lors du chargement:', error);
      setError(error.message || 'Erreur lors du chargement du produit');
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || "Impossible de charger le produit."
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    printProduct,
    designUrl,
    error,
    setDesignUrl,
    fetchProduct
  };
};
