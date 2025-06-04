
import { useState } from 'react';
import { ProductTemplate, TemplateFormData, DEFAULT_TEMPLATE_FORM_DATA } from '@/types/templates';

export const useTemplateForm = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ProductTemplate | null>(null);
  const [formData, setFormData] = useState<TemplateFormData>(DEFAULT_TEMPLATE_FORM_DATA);

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

  const closeDialog = () => {
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
