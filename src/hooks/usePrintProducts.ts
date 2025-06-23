
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { mapPrintProductWithCompatibility, PrintProduct } from '@/types/customProduct';
import { buildImageUrl } from '@/utils/imageUrl';

export const usePrintProducts = () => {
  const [printProducts, setPrintProducts] = useState<PrintProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrintProducts = async () => {
    try {
      console.log('🔄 Fetching print products...');
      setIsLoading(true);
      setError(null);

      // Correction de la requête pour éviter l'ambiguïté des relations
      const { data, error } = await supabase
        .from('print_products')
        .select(`
          *,
          product_templates!print_products_template_id_fkey (
            id,
            name_fr,
            name_en,
            name_ty,
            technical_instructions_fr,
            technical_instructions_en,
            technical_instructions_ty,
            type,
            primary_mockup_id,
            available_positions,
            available_colors,
            is_active,
            created_by,
            created_at,
            updated_at,
            product_mockups!product_mockups_product_template_id_fkey (
              id,
              mockup_url,
              mockup_name,
              is_primary,
              display_order,
              print_area,
              has_print_area
            )
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ CRITICAL ERROR in fetchPrintProducts:', error);
        throw error;
      }

      console.log('✅ Raw print products data:', data?.length || 0);

      // Mapper les produits avec compatibilité
      const mappedProducts = (data || []).map((product: any) => {
        const mapped = mapPrintProductWithCompatibility(product);
        
        // Traiter les mockups si disponibles
        if (product.product_templates?.product_mockups) {
          mapped.product_templates = {
            ...mapped.product_templates!,
            product_mockups: product.product_templates.product_mockups.map((m: any) => ({
              ...m,
              mockup_url: buildImageUrl(m.mockup_url),
              url: buildImageUrl(m.mockup_url)
            }))
          };
        }

        return mapped;
      });

      console.log('✅ Mapped print products:', mappedProducts.length);
      setPrintProducts(mappedProducts);

    } catch (error: any) {
      console.error('❌ Error in fetchPrintProducts:', error);
      setError(error.message || 'Erreur lors du chargement des produits');
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les produits d'impression."
      });
      setPrintProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrintProducts();
  }, []);

  return {
    printProducts,
    isLoading,
    error,
    refetch: fetchPrintProducts
  };
};
