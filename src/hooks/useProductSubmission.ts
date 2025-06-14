
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
    console.log('🚀 useProductSubmission - handleSubmit called with:', {
      selectedProduct: selectedProduct?.name,
      designUrl: !!designUrl,
      designPosition,
      productData
    });

    // ✅ CORRECTION: Validation simplifiée - designPosition n'est plus requis
    if (!selectedProduct || !selectedProduct.product_templates || !designUrl || !user) {
      console.log('❌ Validation failed:', {
        hasProduct: !!selectedProduct,
        hasTemplate: !!selectedProduct?.product_templates,
        hasDesign: !!designUrl,
        hasUser: !!user
      });

      toast({
        variant: "destructive",
        title: "Informations manquantes",
        description: "Veuillez sélectionner un produit et uploader un design."
      });
      return false;
    }

    if (!productData.name?.trim()) {
      toast({
        variant: "destructive",
        title: "Nom manquant",
        description: "Veuillez renseigner le nom du produit."
      });
      return false;
    }

    setIsLoading(true);

    try {
      // ✅ Générer une position automatique si manquante
      const autoPosition = designPosition || {
        x: 30,
        y: 40, 
        width: 40,
        height: 20,
        rotation: 0
      };

      console.log('✅ All validations passed, creating product with auto position:', autoPosition);

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
            position: autoPosition,
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
      
      const errorMessage = error?.message?.includes('duplicate') 
        ? "Ce produit existe déjà. Veuillez modifier le nom ou les paramètres."
        : "Erreur lors de la création du produit. Veuillez réessayer.";
      
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
