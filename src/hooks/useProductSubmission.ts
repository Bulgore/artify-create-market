
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
    console.log('🚀 useProductSubmission - handleSubmit avec validation SIMPLE:', {
      selectedProduct: selectedProduct?.name,
      designUrl: !!designUrl,
      designPosition,
      productData
    });

    // Validation SIMPLE - SEULEMENT 3 champs essentiels
    if (!selectedProduct || !selectedProduct.product_templates) {
      console.log('❌ Produit manquant ou sans template');
      toast({
        variant: "destructive",
        title: "Produit requis",
        description: "Veuillez sélectionner un produit."
      });
      return false;
    }

    if (!designUrl || designUrl.trim() === '') {
      console.log('❌ Design manquant');
      toast({
        variant: "destructive",
        title: "Design requis",
        description: "Veuillez uploader un design."
      });
      return false;
    }

    if (!productData.name || productData.name.trim() === '') {
      console.log('❌ Nom du produit manquant');
      toast({
        variant: "destructive",
        title: "Nom requis",
        description: "Veuillez renseigner le nom du produit."
      });
      return false;
    }

    if (!user) {
      console.log('❌ Utilisateur non connecté');
      toast({
        variant: "destructive",
        title: "Erreur d'authentification",
        description: "Vous devez être connecté."
      });
      return false;
    }

    console.log('✅ Validation SIMPLE réussie - 3 champs OK, création du produit');

    setIsLoading(true);

    try {
      let finalPosition = designPosition;
      
      // Calcul automatique PROFESSIONNEL de la position
      if (!finalPosition) {
        console.log('🔧 Calcul automatique PROFESSIONNEL de la position avec coordonnées EXACTES...');
        
        try {
          const designArea = parseDesignArea(selectedProduct.product_templates.design_area);
          console.log('📐 Zone d\'impression EXACTE récupérée:', designArea);
          
          const designDimensions = await getImageDimensions(designUrl);
          console.log('📏 Dimensions design récupérées:', designDimensions);
          
          const autoPosition = calculateAutoPosition(designDimensions, designArea);
          
          finalPosition = {
            x: autoPosition.x,
            y: autoPosition.y,
            width: autoPosition.width,
            height: autoPosition.height,
            rotation: 0,
            scale: autoPosition.scale
          };
          
          console.log('✅ Position auto-calculée avec PRÉCISION PROFESSIONNELLE:', finalPosition);
          
        } catch (error) {
          console.error('❌ Erreur calcul automatique PROFESSIONNEL:', error);
          
          // Fallback sécurisé - ne pas faire échouer la création
          const designArea = parseDesignArea(selectedProduct.product_templates.design_area);
          finalPosition = {
            x: designArea.x + (designArea.width * 0.1),
            y: designArea.y + (designArea.height * 0.1),
            width: designArea.width * 0.8,
            height: designArea.height * 0.8,
            rotation: 0,
            scale: 0.8
          };
          
          console.log('⚠️ Position fallback utilisée (non bloquant):', finalPosition);
        }
      }

      console.log('✅ Création du produit avec position EXACTE:', finalPosition);

      // Insertion SIMPLE sans blocage multi-langue
      const { error } = await supabase
        .from('creator_products')
        .insert({
          creator_id: user.id,
          print_product_id: selectedProduct.id,
          // Champs SIMPLES - une seule langue principale
          name_fr: productData.name.trim(),
          name_en: productData.name.trim(), // Auto-fallback
          name_ty: productData.name.trim(), // Auto-fallback
          description_fr: productData.description?.trim() || '',
          description_en: productData.description?.trim() || '', // Auto-fallback
          description_ty: productData.description?.trim() || '', // Auto-fallback
          creator_margin_percentage: productData.margin_percentage || 20,
          design_data: {
            design_image_url: designUrl,
            position: finalPosition,
            template_svg_url: selectedProduct.product_templates.svg_file_url
          },
          preview_url: selectedProduct.product_templates.mockup_image_url,
          is_published: false
        });

      if (error) {
        console.error('❌ Erreur base de données lors de la création:', error);
        throw error;
      }

      console.log('✅ Produit créé avec succès avec positionnement automatique PROFESSIONNEL');

      toast({
        title: "Produit créé avec succès",
        description: `Votre produit "${productData.name}" a été créé avec positionnement automatique professionnel.`
      });

      return true;
    } catch (error: any) {
      console.error('❌ Erreur lors de la création du produit:', error);
      
      let errorMessage = "Erreur lors de la création du produit. Veuillez réessayer.";
      
      if (error?.message?.includes('duplicate')) {
        errorMessage = "Ce nom de produit existe déjà. Veuillez choisir un autre nom.";
      } else if (error?.message?.includes('foreign key')) {
        errorMessage = "Erreur de configuration du produit. Contactez l'administrateur.";
      }
      
      toast({
        variant: "destructive",
        title: "Erreur de création",
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
