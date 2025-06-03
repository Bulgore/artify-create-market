
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ProductTemplate, TemplateFormData, DEFAULT_TEMPLATE_FORM_DATA } from '@/types/templates';

export const useTemplates = () => {
  const { toast } = useToast();
  const { user, isSuperAdmin } = useAuth();
  const [templates, setTemplates] = useState<ProductTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ProductTemplate | null>(null);
  const [formData, setFormData] = useState<TemplateFormData>(DEFAULT_TEMPLATE_FORM_DATA);

  useEffect(() => {
    if (!isSuperAdmin()) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Seuls les super administrateurs peuvent accéder aux gabarits.",
      });
      return;
    }
    fetchTemplates();
  }, [isSuperAdmin]);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les gabarits.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!user) return;

    try {
      const templateData = {
        ...formData,
        created_by: user.id,
        design_area: JSON.stringify(formData.design_area),
        mockup_area: formData.mockup_area ? JSON.stringify(formData.mockup_area) : null
      };

      if (editingTemplate) {
        const { error } = await supabase
          .from('product_templates')
          .update(templateData)
          .eq('id', editingTemplate.id);

        if (error) throw error;
        
        toast({
          title: "Gabarit mis à jour",
          description: "Le gabarit a été mis à jour avec succès.",
        });
      } else {
        const { error } = await supabase
          .from('product_templates')
          .insert([templateData]);

        if (error) throw error;
        
        toast({
          title: "Gabarit créé",
          description: "Le nouveau gabarit a été créé avec succès.",
        });
      }

      setIsDialogOpen(false);
      setEditingTemplate(null);
      resetForm();
      fetchTemplates();
    } catch (error: any) {
      console.error('Error saving template:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder le gabarit.",
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
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
      
      fetchTemplates();
    } catch (error: any) {
      console.error('Error deleting template:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le gabarit.",
      });
    }
  };

  const resetForm = () => {
    setFormData({ ...DEFAULT_TEMPLATE_FORM_DATA });
  };

  const openEditDialog = (template: ProductTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      type: template.type,
      svg_file_url: template.svg_file_url,
      mockup_image_url: template.mockup_image_url,
      design_area: typeof template.design_area === 'string' 
        ? JSON.parse(template.design_area) 
        : template.design_area,
      mockup_area: template.mockup_area 
        ? (typeof template.mockup_area === 'string' ? JSON.parse(template.mockup_area) : template.mockup_area)
        : { x: 50, y: 50, width: 200, height: 200 },
      available_positions: template.available_positions,
      available_colors: template.available_colors,
      technical_instructions: template.technical_instructions,
      is_active: template.is_active
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingTemplate(null);
    resetForm();
    setIsDialogOpen(true);
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
