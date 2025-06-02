
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TemplateForm from "./TemplateForm";

interface ProductTemplate {
  id: string;
  name: string;
  type: string;
  svg_file_url: string;
  mockup_image_url: string;
  design_area: any;
  available_positions: string[];
  available_colors: string[];
  technical_instructions: string;
  is_active: boolean;
  created_at: string;
}

interface FormData {
  name: string;
  type: string;
  svg_file_url: string;
  mockup_image_url: string;
  design_area: { x: number; y: number; width: number; height: number };
  available_positions: string[];
  available_colors: string[];
  technical_instructions: string;
  is_active: boolean;
}

interface TemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingTemplate: ProductTemplate | null;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSave: () => void;
}

const TemplateDialog: React.FC<TemplateDialogProps> = ({
  isOpen,
  onClose,
  editingTemplate,
  formData,
  setFormData,
  onSave
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingTemplate ? 'Modifier le gabarit' : 'Créer un nouveau gabarit'}
          </DialogTitle>
        </DialogHeader>
        
        <TemplateForm
          formData={formData}
          setFormData={setFormData}
          onSave={onSave}
          onCancel={onClose}
          isEditing={!!editingTemplate}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TemplateDialog;
