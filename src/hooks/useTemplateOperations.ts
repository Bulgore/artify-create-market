
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
      console.log('🔄 Fetching templates...');
      
      const { data, error } = await supabase
        .from('product_templates')
        .select(`
          *,
          template_printers!left(
            printer_id,
            printers!inner(
              id,
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching templates:', error);
        throw error;
      }
      
      console.log('✅ Raw templates data:', data);
      
      // Mapper avec compatibilité et récupération du printer_id
      const mappedTemplates = (data || []).map((template: any) => {
        const printerMapping = template.template_printers && template.template_printers.length > 0 
          ? template.template_printers[0] 
          : null;
        
        const mappedTemplate = {
          ...template,
          name: template.name_fr ?? template.name ?? '',
          technical_instructions: template.technical_instructions_fr ?? template.technical_instructions ?? '',
          printer_id: printerMapping?.printer_id || null,
          printer_name: printerMapping?.printers?.name || null
        };
        
        console.log('🔄 Mapped template:', {
          id: template.id,
          name: mappedTemplate.name,
          printer_id: mappedTemplate.printer_id,
          printer_name: mappedTemplate.printer_name
        });
        
        return mappedTemplate;
      });
      
      return mappedTemplates;
    } catch (error: any) {
      console.error('❌ Error fetching templates:', error);
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
    if (!user) {
      console.error('❌ No authenticated user');
      toast({
        variant: "destructive",
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour effectuer cette action.",
      });
      return false;
    }

    if (!isSuperAdmin()) {
      console.error('❌ User is not super admin');
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Seuls les super administrateurs peuvent modifier les gabarits.",
      });
      return false;
    }

    try {
      console.log('💾 Saving template with data:', formData);
      console.log('🔐 User authenticated:', user.id, 'Super admin:', isSuperAdmin());

      const templateData = {
        name_fr: formData.name || '',
        technical_instructions_fr: formData.technical_instructions || '',
        type: formData.type || '',
        created_by: user.id,
        available_positions: formData.available_positions || ['face'],
        available_colors: formData.available_colors || ['white', 'black'],
        is_active: Boolean(formData.is_active)
      };

      console.log('📝 Template data to save:', templateData);

      let templateId = editingTemplate?.id || '';

      if (editingTemplate) {
        // Mise à jour d'un template existant
        console.log('🔄 Updating existing template:', editingTemplate.id);
        
        const { error } = await supabase
          .from('product_templates')
          .update(templateData)
          .eq('id', editingTemplate.id);

        if (error) {
          console.error('❌ Update error:', error);
          throw error;
        }

        templateId = editingTemplate.id;
        console.log('✅ Template updated successfully');
      } else {
        // Création d'un nouveau template
        console.log('🆕 Creating new template');
        
        const { data, error } = await supabase
          .from('product_templates')
          .insert([templateData])
          .select()
          .single();

        if (error) {
          console.error('❌ Insert error:', error);
          throw error;
        }

        templateId = data?.id;
        console.log('✅ Template created successfully:', templateId);
      }

      // Gestion du mapping template-imprimeur
      if (templateId && formData.printer_id) {
        console.log('🔗 Managing template-printer mapping:', {
          template_id: templateId,
          printer_id: formData.printer_id
        });

        // Supprimer l'ancien mapping s'il existe
        const { error: deleteError } = await supabase
          .from('template_printers')
          .delete()
          .eq('template_id', templateId);

        if (deleteError) {
          console.error('⚠️ Error deleting old mapping (non-critical):', deleteError);
        }

        // Créer le nouveau mapping
        const { error: mappingError } = await supabase
          .from('template_printers')
          .insert({
            template_id: templateId,
            printer_id: formData.printer_id
          });

        if (mappingError) {
          console.error('❌ Mapping error:', mappingError);
          toast({
            variant: "destructive",
            title: "Avertissement",
            description: "Template sauvegardé mais erreur lors de l'association avec l'imprimeur.",
          });
        } else {
          console.log('✅ Template-printer mapping created successfully');
        }
      }

      toast({
        title: editingTemplate ? "Gabarit mis à jour" : "Gabarit créé",
        description: editingTemplate 
          ? "Le gabarit a été mis à jour avec succès."
          : "Le nouveau gabarit a été créé avec succès.",
      });

      return true;
    } catch (error: any) {
      console.error('❌ Error saving template:', error);
      
      let errorMessage = 'Erreur inconnue';
      if (error.message?.includes('row-level security')) {
        errorMessage = 'Droits insuffisants pour cette opération. Vérifiez vos permissions.';
      } else if (error.message?.includes('permission denied')) {
        errorMessage = 'Permission refusée. Seuls les super administrateurs peuvent effectuer cette action.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de sauvegarder le gabarit: ${errorMessage}`,
      });
      return false;
    }
  };

  const deleteTemplate = async (templateId: string, forceDelete: boolean = false) => {
    if (!user) {
      console.error('❌ No authenticated user');
      toast({
        variant: "destructive",
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour effectuer cette action.",
      });
      return false;
    }

    if (!isSuperAdmin()) {
      console.error('❌ User is not super admin');
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Seuls les super administrateurs peuvent supprimer les gabarits.",
      });
      return false;
    }

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
      
      let errorMessage = 'Erreur inconnue';
      if (error.message?.includes('row-level security')) {
        errorMessage = 'Droits insuffisants pour cette opération.';
      } else if (error.message?.includes('permission denied')) {
        errorMessage = 'Permission refusée.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Erreur de suppression",
        description: `Impossible de supprimer le gabarit : ${errorMessage}`
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
