
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PrintProduct {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  material: string;
  stock_quantity: number;
  images: string[];
  available_sizes: string[];
  available_colors: string[];
  is_active: boolean;
  template_id: string | null;
}

interface ProductTemplate {
  id: string;
  name: string;
  type: string;
}

interface EditProductFormData {
  name: string;
  description: string;
  base_price: number;
  material: string;
  stock_quantity: number;
  available_sizes: string[];
  available_colors: string[];
  is_active: boolean;
  template_id: string | null;
}

export const useEditProduct = (product: PrintProduct | null) => {
  const [formData, setFormData] = useState<EditProductFormData>({
    name: '',
    description: '',
    base_price: 0,
    material: '',
    stock_quantity: 0,
    available_sizes: [],
    available_colors: [],
    is_active: true,
    template_id: null
  });
  const [templates, setTemplates] = useState<ProductTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (product) {
      console.log('Setting form data for product:', product);
      console.log('Product template_id:', product.template_id);
      
      setFormData({
        name: product.name,
        description: product.description || '',
        base_price: product.base_price,
        material: product.material,
        stock_quantity: product.stock_quantity,
        available_sizes: product.available_sizes,
        available_colors: product.available_colors,
        is_active: product.is_active,
        template_id: product.template_id
      });
    }
  }, [product]);

  const fetchTemplates = async () => {
    try {
      console.log('Fetching templates for product editing...');
      const { data, error } = await supabase
        .from('product_templates')
        .select('id, name, type')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      
      console.log('Templates fetched:', data?.length || 0);
      setTemplates(data || []);
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les gabarits."
      });
    }
  };

  const updateProduct = async (): Promise<boolean> => {
    if (!product) return false;

    if (formData.available_sizes.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner au moins une taille."
      });
      return false;
    }

    if (formData.available_colors.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner au moins une couleur."
      });
      return false;
    }

    setIsLoading(true);

    try {
      console.log('Updating product with data:', formData);
      console.log('Template ID being saved:', formData.template_id);

      const updateData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        base_price: formData.base_price,
        material: formData.material.trim(),
        stock_quantity: formData.stock_quantity,
        available_sizes: formData.available_sizes,
        available_colors: formData.available_colors,
        is_active: formData.is_active,
        template_id: formData.template_id === 'none' ? null : formData.template_id
      };

      console.log('Final update data:', updateData);

      const { error } = await supabase
        .from('print_products')
        .update(updateData)
        .eq('id', product.id);

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      console.log('Product updated successfully');
      
      toast({
        title: "Produit mis à jour",
        description: "Le produit a été mis à jour avec succès."
      });

      return true;
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de mettre à jour le produit: ${error.message || 'Erreur inconnue'}`
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    templates,
    isLoading,
    fetchTemplates,
    updateProduct
  };
};
