
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { PrintProduct } from '@/types/customProduct';
import type { GeneratedMockup } from '@/types/creatorProduct';

interface ProductData {
  name: string;
  description: string;
  margin_percentage: number;
}

export const useProductSubmission = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    selectedProduct: PrintProduct,
    designUrl: string,
    designPosition: any,
    productData: ProductData
  ): Promise<boolean> => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour créer un produit."
      });
      return false;
    }

    setIsLoading(true);

    try {
      console.log('🚀 Création du produit créateur - données complètes');

      const creatorProductData = {
        creator_id: user.id,
        print_product_id: selectedProduct.id,
        name_fr: productData.name.trim(),
        description_fr: productData.description?.trim() || null,
        creator_margin_percentage: productData.margin_percentage,
        design_data: {
          designUrl,
          position: designPosition,
          originalDimensions: designPosition ? {
            width: designPosition.width / designPosition.scale,
            height: designPosition.height / designPosition.scale
          } : null
        },
        original_design_url: designUrl,
        design_file_info: {
          uploadedAt: new Date().toISOString(),
          fileType: designUrl.includes('.svg') ? 'svg' : 'image',
          autoPositioned: true
        },
        generated_mockups: [] as GeneratedMockup[],
        is_published: false,
        status: 'active' // Utiliser 'active' au lieu de 'draft' pour éviter l'erreur de contrainte
      };

      console.log('📦 Données finales du produit:', creatorProductData);

      const { data, error } = await supabase
        .from('creator_products')
        .insert([creatorProductData])
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur lors de la création:', error);
        
        // Gestion spécifique des erreurs de contrainte
        if (error.message.includes('creator_products_status_check')) {
          throw new Error('Statut invalide. Utilisation du statut par défaut.');
        }
        
        throw error;
      }

      console.log('✅ Produit créateur créé avec succès:', data);

      toast({
        title: "Produit créé avec succès !",
        description: `"${productData.name}" a été ajouté à vos créations.`
      });

      return true;

    } catch (error: any) {
      console.error('❌ Erreur critique lors de la création:', error);
      
      let errorMessage = "Impossible de créer le produit.";
      
      if (error.message?.includes('status_check')) {
        errorMessage = "Erreur de statut du produit. Veuillez réessayer.";
      } else if (error.message?.includes('foreign key')) {
        errorMessage = "Erreur de liaison avec le produit d'impression.";
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
