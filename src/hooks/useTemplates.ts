
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ProductTemplate } from '@/types/templates';
import { useTemplateOperations } from './useTemplateOperations';
import { useTemplateForm } from './useTemplateForm';

export const useTemplates = () => {
  const { toast } = useToast();
  const { isSuperAdmin, user } = useAuth();
  const [templates, setTemplates] = useState<ProductTemplate[]>([]);
  
  const { isLoading, fetchTemplates, saveTemplate, deleteTemplate } = useTemplateOperations();
  const {
    isDialogOpen,
    setIsDialogOpen,
    editingTemplate,
    formData,
    setFormData,
    openEditDialog,
    openCreateDialog,
    closeDialog
  } = useTemplateForm();

  useEffect(() => {
    console.log('🔄 useTemplates effect - Auth state:', {
      user: user?.id,
      isSuperAdmin: isSuperAdmin()
    });

    if (!user) {
      console.log('❌ No authenticated user');
      return;
    }

    if (!isSuperAdmin()) {
      console.log('❌ User is not super admin');
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Seuls les super administrateurs peuvent accéder aux gabarits.",
      });
      return;
    }
    
    loadTemplates();
  }, [user, isSuperAdmin]);

  const loadTemplates = async () => {
    console.log('🔄 Loading templates...');
    try {
      const data = await fetchTemplates();
      setTemplates(data);
      console.log('✅ Templates loaded:', data.length);
    } catch (error) {
      console.error('❌ Error loading templates:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les gabarits.",
      });
    }
  };

  const handleSaveTemplate = async () => {
    console.log('💾 Attempting to save template...');
    try {
      const success = await saveTemplate(formData, editingTemplate);
      if (success) {
        console.log('✅ Template saved successfully');
        closeDialog();
        await loadTemplates(); // Recharger la liste
      }
    } catch (error) {
      console.error('❌ Error saving template:', error);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    console.log('🗑️ Attempting to delete template:', templateId);
    try {
      const success = await deleteTemplate(templateId);
      if (success) {
        console.log('✅ Template deleted successfully');
        await loadTemplates(); // Recharger la liste
      }
    } catch (error) {
      console.error('❌ Error deleting template:', error);
    }
  };

  return {
    templates,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    editingTemplate,
    formData,
    setFormData,
    handleSaveTemplate,
    handleDeleteTemplate,
    openEditDialog,
    openCreateDialog
  };
};
