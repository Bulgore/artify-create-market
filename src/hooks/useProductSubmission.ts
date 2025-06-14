
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PrintProduct, ProductData } from '@/types/customProduct';
import { parseDesignArea } from '@/types/designArea';

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

    // ✅ CORRECTION: Validation ultra-simplifiée
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
      // ✅ CORRECTION: Auto-générer position basée sur la zone d'impression
      let finalPosition = designPosition;
      
      if (!finalPosition) {
        console.log('🔧 Génération automatique de la position...');
        const designArea = parseDesignArea(selectedProduct.product_templates.design_area);
        
        finalPosition = {
          x: designArea.x + (designArea.width * 0.1),
          y: designArea.y + (designArea.height * 0.1),
          width: designArea.width * 0.8,
          height: designArea.height * 0.8,
          rotation: 0
        };
        
        console.log('🎯 Position auto-générée:', { designArea, finalPosition });
      }

      console.log('✅ All validations passed, creating product with position:', finalPosition);

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
            position: finalPosition,
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
        description: "Votre produit personnalisé a été créé avec succès avec positionnement automatique."
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
