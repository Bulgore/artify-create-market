
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
      console.log('🚀 Création du produit créateur avec les nouvelles données');

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
        status: 'active' // Changé de 'pending' à 'active' pour éviter l'erreur de contrainte
      };

      console.log('📦 Données du produit créateur:', creatorProductData);

      const { data, error } = await supabase
        .from('creator_products')
        .insert([creatorProductData])
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur lors de la création:', error);
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
      toast({
        variant: "destructive",
        title: "Erreur de création",
        description: error.message || "Impossible de créer le produit."
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
