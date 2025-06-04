
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
      console.log(`\n=== DEBUT SUPPRESSION TEMPLATE ===`);
      console.log(`Template ID: ${templateId}`);
      console.log(`Force delete: ${forceDelete}`);
      console.log(`User is super admin: ${isSuperAdmin()}`);
      console.log(`User ID: ${user?.id}`);
      
      if (!forceDelete) {
        console.log(`🔍 Checking template references...`);
        
        // Vérifier les références dans print_products
        console.log('Checking print_products...');
        const { data: printProducts, error: printProductsError } = await supabase
          .from('print_products')
          .select('id, name, template_id')
          .eq('template_id', templateId);

        if (printProductsError) {
          console.error('❌ Error checking print_products:', printProductsError);
          throw printProductsError;
        }

        console.log(`Found ${printProducts?.length || 0} references in print_products:`, printProducts);

        // Vérifier les références dans tshirt_templates
        console.log('Checking tshirt_templates...');
        const { data: tshirtTemplates, error: tshirtError } = await supabase
          .from('tshirt_templates')
          .select('id, name, template_id')
          .eq('template_id', templateId);

        if (tshirtError) {
          console.error('❌ Error checking tshirt_templates:', tshirtError);
          throw tshirtError;
        }

        console.log(`Found ${tshirtTemplates?.length || 0} references in tshirt_templates:`, tshirtTemplates);

        const allReferences = [];
        if (printProducts && printProducts.length > 0) {
          allReferences.push({ table: 'print_products', products: printProducts });
        }
        if (tshirtTemplates && tshirtTemplates.length > 0) {
          allReferences.push({ table: 'tshirt_templates', products: tshirtTemplates });
        }

        if (allReferences.length > 0) {
          const referencesText = allReferences.map(ref => 
            `${ref.table}: ${ref.products.map(p => `${p.name || p.id} (ID: ${p.id})`).join(', ')}`
          ).join('\n');
          
          console.log('⚠️ Template has references:', referencesText);
          
          // Si c'est un super admin, proposer la suppression forcée
          if (isSuperAdmin()) {
            console.log('🔧 User is super admin - offering force delete option');
            const forceConfirm = confirm(
              `⚠️ Ce gabarit est utilisé par :\n${referencesText}\n\n` +
              `En tant que super administrateur, voulez-vous FORCER la suppression ?\n\n` +
              `⚠️ ATTENTION: Cette action :\n` +
              `• Supprimera le gabarit définitivement\n` +
              `• Retirera toutes les références dans les produits\n` +
              `• Ne peut pas être annulée\n\n` +
              `Continuer ?`
            );
            
            if (forceConfirm) {
              console.log('✅ Super admin confirmed force delete');
              return await deleteTemplate(templateId, true);
            } else {
              console.log('❌ Super admin cancelled force delete');
              return false;
            }
          } else {
            console.log('❌ User is not super admin - blocking delete');
            toast({
              variant: "destructive",
              title: "Impossible de supprimer",
              description: `Ce gabarit est utilisé par :\n${referencesText}\n\nVeuillez d'abord supprimer ces références ou contactez un administrateur.`
            });
            return false;
          }
        } else {
          console.log('✅ No references found - proceeding with normal delete');
        }
      }

      // Suppression (normale ou forcée)
      if (forceDelete && isSuperAdmin()) {
        console.log('🔧 Executing FORCE DELETE as super admin...');
        
        // Supprimer d'abord toutes les références dans print_products
        console.log('Removing references from print_products...');
        const { error: printProductsError } = await supabase
          .from('print_products')
          .update({ template_id: null })
          .eq('template_id', templateId);

        if (printProductsError) {
          console.error('❌ Error removing print_products references:', printProductsError);
          // Continue malgré l'erreur pour essayer de nettoyer
        } else {
          console.log('✅ print_products references removed');
        }

        // Supprimer les références dans tshirt_templates
        console.log('Removing references from tshirt_templates...');
        const { error: tshirtTemplatesError } = await supabase
          .from('tshirt_templates')
          .update({ template_id: null })
          .eq('template_id', templateId);

        if (tshirtTemplatesError) {
          console.error('❌ Error removing tshirt_templates references:', tshirtTemplatesError);
          // Continue malgré l'erreur pour essayer de supprimer le template
        } else {
          console.log('✅ tshirt_templates references removed');
        }
      }

      // Supprimer le gabarit
      console.log('🗑️ Deleting template...');
      const { error } = await supabase
        .from('product_templates')
        .delete()
        .eq('id', templateId);

      if (error) {
        console.error('❌ Error deleting template:', error);
        throw error;
      }

      console.log(`✅ Template ${templateId} deleted successfully`);
      console.log(`=== FIN SUPPRESSION TEMPLATE ===\n`);
      
      toast({
        title: "Gabarit supprimé",
        description: forceDelete 
          ? "Le gabarit et toutes ses références ont été supprimés avec succès."
          : "Le gabarit a été supprimé avec succès."
      });
      
      return true;
    } catch (error: any) {
      console.error('❌ CRITICAL ERROR in deleteTemplate:', error);
      toast({
        variant: "destructive",
        title: "Erreur de suppression",
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
