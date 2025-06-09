
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ProductTemplate } from '@/types/templates';
import { useTemplateOperations } from './useTemplateOperations';
import { useTemplateForm } from './useTemplateForm';

export const useTemplates = () => {
  const { toast } = useToast();
  const { isSuperAdmin } = useAuth();
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
    if (!isSuperAdmin()) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Seuls les super administrateurs peuvent accéder aux gabarits.",
      });
      return;
    }
    loadTemplates();
  }, [isSuperAdmin]);

  const loadTemplates = async () => {
    const data = await fetchTemplates();
    // Data is already mapped in fetchTemplates
    setTemplates(data);
  };

  const handleSaveTemplate = async () => {
    const success = await saveTemplate(formData, editingTemplate);
    if (success) {
      closeDialog();
      loadTemplates();
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    const success = await deleteTemplate(templateId);
    if (success) {
      loadTemplates();
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
