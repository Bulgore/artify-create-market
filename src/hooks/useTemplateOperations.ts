
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ProductTemplate, TemplateFormData } from '@/types/templates';

export const useTemplateOperations = () => {
  const { toast } = useToast();
  const { user, isSuperAdmin } = useAuth();
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

  const deleteTemplate = async (templateId: string, forceDelete: boolean = false) => {
    try {
      console.log(`Attempting to delete template: ${templateId}, force: ${forceDelete}`);
      
      if (!forceDelete) {
        // Vérifier les références dans print_products
        console.log('Checking print_products for template usage...');
        const { data: printProducts, error: printProductsError } = await supabase
          .from('print_products')
          .select('id, name')
          .eq('template_id', templateId);

        if (printProductsError) {
          console.error('Error checking print_products:', printProductsError);
          throw printProductsError;
        }

        // Vérifier les références dans tshirt_templates
        console.log('Checking tshirt_templates for template usage...');
        const { data: tshirtTemplates, error: tshirtError } = await supabase
          .from('tshirt_templates')
          .select('id, name')
          .eq('template_id', templateId);

        if (tshirtError) {
          console.error('Error checking tshirt_templates:', tshirtError);
          throw tshirtError;
        }

        const allReferences = [];
        if (printProducts && printProducts.length > 0) {
          allReferences.push({ table: 'print_products', products: printProducts });
        }
        if (tshirtTemplates && tshirtTemplates.length > 0) {
          allReferences.push({ table: 'tshirt_templates', products: tshirtTemplates });
        }

        if (allReferences.length > 0) {
          const referencesText = allReferences.map(ref => 
            `${ref.table}: ${ref.products.map(p => p.name || p.id).join(', ')}`
          ).join('\n');
          
          console.log('Template is referenced by:', referencesText);
          
          // Si c'est un super admin, proposer la suppression forcée
          if (isSuperAdmin()) {
            const forceConfirm = confirm(
              `Ce gabarit est utilisé par :\n${referencesText}\n\n` +
              `En tant que super administrateur, voulez-vous forcer la suppression ?\n` +
              `ATTENTION: Cela supprimera aussi toutes les références dans les autres tables.`
            );
            
            if (forceConfirm) {
              return await deleteTemplate(templateId, true);
            }
            return false;
          } else {
            toast({
              variant: "destructive",
              title: "Impossible de supprimer",
              description: `Ce gabarit est utilisé par :\n${referencesText}\nVeuillez d'abord supprimer ces références.`
            });
            return false;
          }
        }
      }

      // Suppression (normale ou forcée)
      if (forceDelete && isSuperAdmin()) {
        console.log('Force deleting template and all references...');
        
        // Supprimer d'abord toutes les références dans print_products
        const { error: printProductsError } = await supabase
          .from('print_products')
          .update({ template_id: null })
          .eq('template_id', templateId);

        if (printProductsError) {
          console.error('Error removing print_products references:', printProductsError);
        }

        // Supprimer les références dans tshirt_templates
        const { error: tshirtTemplatesError } = await supabase
          .from('tshirt_templates')
          .update({ template_id: null })
          .eq('template_id', templateId);

        if (tshirtTemplatesError) {
          console.error('Error removing tshirt_templates references:', tshirtTemplatesError);
        }
      }

      // Supprimer le gabarit
      const { error } = await supabase
        .from('product_templates')
        .delete()
        .eq('id', templateId);

      if (error) {
        console.error('Error deleting template:', error);
        throw error;
      }

      console.log(`Template ${templateId} deleted successfully`);
      
      toast({
        title: "Gabarit supprimé",
        description: forceDelete 
          ? "Le gabarit et toutes ses références ont été supprimés avec succès."
          : "Le gabarit a été supprimé avec succès."
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting template:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de supprimer le gabarit : ${error.message || 'Erreur inconnue'}`
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
