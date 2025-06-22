
import { useState } from 'react';
import { ProductTemplate, TemplateFormData, DEFAULT_TEMPLATE_FORM_DATA } from '@/types/templates';

export const useTemplateForm = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ProductTemplate | null>(null);
  const [formData, setFormData] = useState<TemplateFormData>(DEFAULT_TEMPLATE_FORM_DATA);

  const resetForm = () => {
    console.log('🔄 Resetting form to default values');
    setFormData({ ...DEFAULT_TEMPLATE_FORM_DATA });
  };

  const openEditDialog = (template: ProductTemplate) => {
    console.log('📝 Opening edit dialog for template:', {
      id: template.id,
      name: template.name_fr || template.name || '',
      printer_id: template.printer_id
    });
    
    setEditingTemplate(template);
    
    // Mapper les données du template vers le formulaire avec des valeurs par défaut sûres
    const mappedFormData: TemplateFormData = {
      name: template.name_fr || template.name || '',
      type: template.type || '',
      available_positions: Array.isArray(template.available_positions) && template.available_positions.length > 0 
        ? template.available_positions 
        : ['face'],
      available_colors: Array.isArray(template.available_colors) && template.available_colors.length > 0 
        ? template.available_colors 
        : ['white', 'black'],
      technical_instructions: template.technical_instructions_fr || template.technical_instructions || '',
      is_active: template.is_active !== undefined ? template.is_active : true,
      printer_id: template.printer_id || ''
    };
    
    console.log('📝 Mapped form data:', mappedFormData);
    setFormData(mappedFormData);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    console.log('🆕 Opening create dialog');
    setEditingTemplate(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    console.log('❌ Closing dialog');
    setIsDialogOpen(false);
    setEditingTemplate(null);
    resetForm();
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    editingTemplate,
    formData,
    setFormData,
    resetForm,
    openEditDialog,
    openCreateDialog,
    closeDialog
  };
};
