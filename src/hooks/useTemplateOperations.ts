
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ProductTemplate, TemplateFormData } from '@/types/templates';

export const useTemplateOperations = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les gabarits.",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const saveTemplate = async (formData: TemplateFormData, editingTemplate: ProductTemplate | null) => {
    if (!user) return false;

    try {
      console.log('Saving template with data:', formData);
      
      // S'assurer que les zones sont des objets valides avec des nombres
      const cleanDesignArea = {
        x: Number(formData.design_area.x) || 0,
        y: Number(formData.design_area.y) || 0,
        width: Number(formData.design_area.width) || 200,
        height: Number(formData.design_area.height) || 200
      };

      const cleanMockupArea = formData.mockup_area ? {
        x: Number(formData.mockup_area.x) || 50,
        y: Number(formData.mockup_area.y) || 50,
        width: Number(formData.mockup_area.width) || 200,
        height: Number(formData.mockup_area.height) || 200
      } : null;

      const templateData = {
        name: formData.name || '',
        type: formData.type || '',
        svg_file_url: formData.svg_file_url || '',
        mockup_image_url: formData.mockup_image_url || '',
        created_by: user.id,
        design_area: JSON.stringify(cleanDesignArea),
        mockup_area: cleanMockupArea ? JSON.stringify(cleanMockupArea) : null,
        available_positions: formData.available_positions || ['face'],
        available_colors: formData.available_colors || ['white', 'black'],
        technical_instructions: formData.technical_instructions || '',
        is_active: Boolean(formData.is_active)
      };

      console.log('Template data to save:', templateData);

      if (editingTemplate) {
        const { error } = await supabase
          .from('product_templates')
          .update(templateData)
          .eq('id', editingTemplate.id);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        toast({
          title: "Gabarit mis à jour",
          description: "Le gabarit a été mis à jour avec succès.",
        });
      } else {
        const { error } = await supabase
          .from('product_templates')
          .insert([templateData]);

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        toast({
          title: "Gabarit créé",
          description: "Le nouveau gabarit a été créé avec succès.",
        });
      }

      return true;
    } catch (error: any) {
      console.error('Error saving template:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de sauvegarder le gabarit: ${error.message || 'Erreur inconnue'}`,
      });
      return false;
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      const { error } = await supabase
        .from('product_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;
      
      toast({
        title: "Gabarit supprimé",
        description: "Le gabarit a été supprimé avec succès.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting template:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le gabarit.",
      });
      return false;
    }
  };

  return {
    isLoading,
    fetchTemplates,
    saveTemplate,
    deleteTemplate
  };
};
