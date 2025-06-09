
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PrintProduct, ProductData } from '@/types/customProduct';

export const useProductSubmission = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    selectedProduct: PrintProduct | null,
    designUrl: string,
    designPosition: any,
    productData: ProductData
  ) => {
    if (!selectedProduct || !selectedProduct.product_templates || !designUrl || !designPosition || !user) {
      toast({
        variant: "destructive",
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs et positionner votre design."
      });
      return false;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('creator_products')
        .insert({
          creator_id: user.id,
          print_product_id: selectedProduct.id,
          name_fr: productData.name,
          description_fr: productData.description,
          creator_margin_percentage: productData.margin_percentage,
          design_data: {
            design_image_url: designUrl,
            position: designPosition,
            template_svg_url: selectedProduct.product_templates.svg_file_url
          },
          preview_url: selectedProduct.product_templates.mockup_image_url,
          is_published: false
        });

      if (error) throw error;

      toast({
        title: "Produit créé",
        description: "Votre produit personnalisé a été créé avec succès."
      });

      return true;
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le produit."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubmit
  };
};
