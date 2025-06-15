
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
    console.log('🚀 useProductSubmission - handleSubmit DÉMARRÉ:', {
      selectedProduct: selectedProduct?.name,
      selectedProductId: selectedProduct?.id,
      designUrl: !!designUrl,
      designUrlPreview: designUrl?.substring(0, 50),
      productName: productData.name,
      userId: user?.id
    });

    // VALIDATION EXPLICITE - Un seul champ à la fois
    if (!selectedProduct) {
      console.log('❌ ÉCHEC: Produit manquant');
      toast({
        variant: "destructive",
        title: "Produit requis",
        description: "Veuillez sélectionner un produit dans la liste."
      });
      return false;
    }

    if (!selectedProduct.id) {
      console.log('❌ ÉCHEC: Produit sans ID');
      toast({
        variant: "destructive",
        title: "Erreur produit",
        description: "Le produit sélectionné n'a pas d'identifiant valide."
      });
      return false;
    }

    if (!selectedProduct.product_templates) {
      console.log('❌ ÉCHEC: Produit sans template');
      toast({
        variant: "destructive",
        title: "Produit non configuré",
        description: "Ce produit n'a pas de template configuré par l'administrateur."
      });
      return false;
    }

    if (!designUrl || designUrl.trim() === '') {
      console.log('❌ ÉCHEC: Design manquant');
      toast({
        variant: "destructive",
        title: "Design requis",
        description: "Veuillez uploader un fichier de design (PNG, JPG, SVG)."
      });
      return false;
    }

    if (!productData.name || productData.name.trim() === '') {
      console.log('❌ ÉCHEC: Nom du produit manquant');
      toast({
        variant: "destructive",
        title: "Nom requis",
        description: "Veuillez renseigner un nom pour votre produit."
      });
      return false;
    }

    if (!user) {
      console.log('❌ ÉCHEC: Utilisateur non connecté');
      toast({
        variant: "destructive",
        title: "Authentification requise",
        description: "Vous devez être connecté pour créer un produit."
      });
      return false;
    }

    console.log('✅ VALIDATION RÉUSSIE - Début de la création du produit');

    setIsLoading(true);

    try {
      let finalPosition = designPosition;
      
      // Calcul automatique de la position si nécessaire
      if (!finalPosition) {
        console.log('🔧 Calcul automatique de la position...');
        
        try {
          const designArea = parseDesignArea(selectedProduct.product_templates.design_area);
          console.log('📐 Zone d\'impression définie:', designArea);
          
          const designDimensions = await getImageDimensions(designUrl);
          console.log('📏 Dimensions du design:', designDimensions);
          
          const autoPosition = calculateAutoPosition(designDimensions, designArea);
          
          finalPosition = {
            x: autoPosition.x,
            y: autoPosition.y,
            width: autoPosition.width,
            height: autoPosition.height,
            rotation: 0,
            scale: autoPosition.scale
          };
          
          console.log('✅ Position automatique calculée:', finalPosition);
          
        } catch (error) {
          console.error('⚠️ Erreur calcul automatique (utilisation fallback):', error);
          
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

      console.log('💾 Insertion en base de données...');

      // Préparer les données à insérer
      const insertData = {
        creator_id: user.id,
        print_product_id: selectedProduct.id,
        name_fr: productData.name.trim(),
        name_en: productData.name.trim(), // Fallback automatique
        name_ty: productData.name.trim(), // Fallback automatique
        description_fr: productData.description?.trim() || '',
        description_en: productData.description?.trim() || '', // Fallback automatique
        description_ty: productData.description?.trim() || '', // Fallback automatique
        creator_margin_percentage: productData.margin_percentage || 20,
        design_data: {
          design_image_url: designUrl,
          position: finalPosition,
          template_svg_url: selectedProduct.product_templates.svg_file_url
        },
        preview_url: selectedProduct.product_templates.mockup_image_url,
        is_published: false
      };

      console.log('📤 Données à insérer:', insertData);

      const { error } = await supabase
        .from('creator_products')
        .insert(insertData);

      if (error) {
        console.error('❌ Erreur base de données:', error);
        throw error;
      }

      console.log('✅ Produit créé avec succès en base de données');

      toast({
        title: "✅ Produit créé avec succès",
        description: `Votre produit "${productData.name}" a été créé et sauvegardé.`
      });

      return true;
    } catch (error: any) {
      console.error('❌ Erreur lors de la création du produit:', error);
      
      let errorMessage = "Une erreur inattendue s'est produite lors de la création du produit.";
      
      if (error?.message?.includes('duplicate')) {
        errorMessage = "Ce nom de produit existe déjà. Veuillez choisir un autre nom.";
      } else if (error?.message?.includes('foreign key')) {
        errorMessage = "Erreur de configuration du produit. Contactez l'administrateur.";
      } else if (error?.message?.includes('auth')) {
        errorMessage = "Problème d'authentification. Veuillez vous reconnecter.";
      } else if (error?.message) {
        errorMessage = `Erreur: ${error.message}`;
      }
      
      toast({
        variant: "destructive",
        title: "❌ Erreur de création",
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
