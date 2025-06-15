
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

    // Validation SIMPLE et CLAIRE - seulement les 3 champs ESSENTIELS
    if (!selectedProduct || !selectedProduct.product_templates) {
      console.log('❌ Produit manquant ou sans template');
      toast({
        variant: "destructive",
        title: "Produit manquant",
        description: "Veuillez sélectionner un produit."
      });
      return false;
    }

    if (!designUrl) {
      console.log('❌ Design manquant');
      toast({
        variant: "destructive",
        title: "Design manquant",
        description: "Veuillez uploader un design."
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

    // Vérifier UNIQUEMENT le nom (champ obligatoire minimal)
    if (!productData.name?.trim()) {
      console.log('❌ Nom du produit manquant');
      toast({
        variant: "destructive",
        title: "Nom manquant",
        description: "Veuillez renseigner le nom du produit."
      });
      return false;
    }

    console.log('✅ Validation SIMPLE réussie - création du produit avec positionnement automatique PROFESSIONNEL');

    setIsLoading(true);

    try {
      let finalPosition = designPosition;
      
      // Calcul automatique PROFESSIONNEL de la position si non fournie
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

      console.log('✅ Validation SIMPLE réussie, création du produit avec position EXACTE:', finalPosition);

      // Insertion avec champs SIMPLES - pas de blocage multi-langue
      const { error } = await supabase
        .from('creator_products')
        .insert({
          creator_id: user.id,
          print_product_id: selectedProduct.id,
          // Champs SIMPLES avec une seule langue (FR par défaut)
          name_fr: productData.name.trim(),
          name_en: productData.name.trim(), // Fallback automatique
          name_ty: productData.name.trim(), // Fallback automatique
          description_fr: productData.description?.trim() || '',
          description_en: productData.description?.trim() || '', // Fallback automatique
          description_ty: productData.description?.trim() || '', // Fallback automatique
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
        console.error('❌ Erreur base de données lors de la création:', error);
        throw error;
      }

      console.log('✅ Produit créé avec succès avec positionnement automatique PROFESSIONNEL');

      toast({
        title: "Produit créé avec succès",
        description: "Votre produit personnalisé a été créé avec positionnement automatique professionnel selon la zone définie par l'admin."
      });

      return true;
    } catch (error: any) {
      console.error('❌ Erreur lors de la création du produit:', error);
      
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
