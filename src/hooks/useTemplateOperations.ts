
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
        .select('*, template_printers(printer_id)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Mapper avec compatibilité
      const mappedTemplates = (data || []).map((template: any) => ({
        ...template,
        name: template.name_fr ?? template.name ?? '',
        technical_instructions: template.technical_instructions_fr ?? template.technical_instructions ?? '',
        printer_id: template.template_printers?.printer_id || null
      }));
      
      return mappedTemplates;
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

      const templateData = {
        name_fr: formData.name || '',
        technical_instructions_fr: formData.technical_instructions || '',
        type: formData.type || '',
        created_by: user.id,
        available_positions: formData.available_positions || ['face'],
        available_colors: formData.available_colors || ['white', 'black'],
        is_active: Boolean(formData.is_active)
      };

      console.log('Template data to save:', templateData);

      let templateId = editingTemplate?.id || '';

      if (editingTemplate) {
        const { error } = await supabase
          .from('product_templates')
          .update(templateData)
          .eq('id', editingTemplate.id);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }

        templateId = editingTemplate.id;

        toast({
          title: "Gabarit mis à jour",
          description: "Le gabarit a été mis à jour avec succès.",
        });
      } else {
        const { data, error } = await supabase
          .from('product_templates')
          .insert([templateData])
          .select()
          .single();

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }

        templateId = data?.id;

        toast({
          title: "Gabarit créé",
          description: "Le nouveau gabarit a été créé avec succès.",
        });
      }

      if (templateId && formData.printer_id) {
        await supabase
          .from('template_printers')
          .upsert({ template_id: templateId, printer_id: formData.printer_id }, { onConflict: 'template_id' });
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
          .select('id, name_fr, template_id')
          .eq('template_id', templateId);

        if (printProductsError) {
          console.error('❌ Error checking print_products:', printProductsError);
          throw printProductsError;
        }

        console.log(`Found ${printProducts?.length || 0} references in print_products:`, printProducts);

        const allReferences = [];
        if (printProducts && printProducts.length > 0) {
          allReferences.push({ table: 'print_products', products: printProducts });
        }

        if (allReferences.length > 0) {
          const referencesText = allReferences.map(ref => 
            `${ref.table}: ${ref.products.map(p => `${p.name_fr || p.id} (ID: ${p.id})`).join(', ')}`
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
