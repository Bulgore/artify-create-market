import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProductData {
  name: string;
  description: string;
  margin_percentage: number;
}

export const useCreatorProductUpdate = (productId: string) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (
    designUrl: string,
    designPosition: any,
    productData: ProductData
  ): Promise<boolean> => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "Vous devez être connecté pour modifier un produit."
      });
      return false;
    }

    setIsLoading(true);
    try {
      const updateData = {
        name_fr: productData.name.trim(),
        description_fr: productData.description?.trim() || null,
        creator_margin_percentage: productData.margin_percentage,
        design_data: {
          designUrl,
          position: designPosition
        },
        original_design_url: designUrl,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('creator_products')
        .update(updateData)
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: 'Produit mis à jour',
        description: `"${productData.name}" a été mis à jour.`
      });
      return true;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || "Impossible de mettre à jour le produit."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleUpdate };
};
