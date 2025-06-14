
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
      console.log('🚀 Creating product with data:', {
        creator_id: user.id,
        print_product_id: selectedProduct.id,
        productData
      });

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

      if (error) {
        console.error('❌ Database error creating product:', error);
        throw error;
      }

      console.log('✅ Product created successfully');

      toast({
        title: "Produit créé",
        description: "Votre produit personnalisé a été créé avec succès."
      });

      return true;
    } catch (error: any) {
      console.error('❌ Error creating product:', error);
      
      // ✅ CORRECTION : Message d'erreur utilisateur amélioré
      const errorMessage = error?.message?.includes('duplicate') 
        ? "Ce produit existe déjà. Veuillez modifier le nom ou les paramètres."
        : "Erreur lors de la création du produit. Veuillez réessayer ou contacter le support.";
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage
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
