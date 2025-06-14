
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PrintProduct, ProductData } from '@/types/customProduct';
import { parseDesignArea } from '@/types/designArea';
import { calculateAutoPosition, getImageDimensions } from '@/utils/designPositioning';

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

    // Validation essentielle uniquement - SEUL LE FRANÇAIS EST OBLIGATOIRE
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

    // CORRECTION : Vérifier uniquement le nom français (pas les autres langues)
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
      let finalPosition = designPosition;
      
      // Si aucune position fournie, calculer automatiquement
      if (!finalPosition) {
        console.log('🔧 Calcul automatique de la position...');
        
        try {
          const designArea = parseDesignArea(selectedProduct.product_templates.design_area);
          const designDimensions = await getImageDimensions(designUrl);
          
          const autoPosition = calculateAutoPosition(designDimensions, designArea);
          
          finalPosition = {
            x: autoPosition.x,
            y: autoPosition.y,
            width: autoPosition.width,
            height: autoPosition.height,
            rotation: 0,
            scale: autoPosition.scale
          };
          
          console.log('✅ Position auto-calculée avec précision:', finalPosition);
          
        } catch (error) {
          console.error('❌ Erreur calcul automatique:', error);
          
          // Fallback sécurisé
          const designArea = parseDesignArea(selectedProduct.product_templates.design_area);
          finalPosition = {
            x: designArea.x + (designArea.width * 0.1),
            y: designArea.y + (designArea.height * 0.1),
            width: designArea.width * 0.8,
            height: designArea.height * 0.8,
            rotation: 0,
            scale: 0.8
          };
          
          console.log('⚠️ Position fallback utilisée:', finalPosition);
        }
      }

      console.log('✅ Validation réussie, création du produit avec position:', finalPosition);

      // CORRECTION MULTILINGUE : Utiliser le français comme base et fallback
      const { error } = await supabase
        .from('creator_products')
        .insert({
          creator_id: user.id,
          print_product_id: selectedProduct.id,
          // Champs multilingues avec fallback automatique sur le français
          name_fr: productData.name.trim(),
          name_en: productData.name.trim(), // Fallback sur français
          name_ty: productData.name.trim(), // Fallback sur français
          description_fr: productData.description?.trim() || '',
          description_en: productData.description?.trim() || '', // Fallback sur français
          description_ty: productData.description?.trim() || '', // Fallback sur français
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
        description: "Votre produit personnalisé a été créé avec succès avec positionnement automatique professionnel."
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
