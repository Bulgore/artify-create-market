
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TemplateForm from "./TemplateForm";
import { ProductTemplate, TemplateFormData } from "@/types/templates";

interface TemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingTemplate: ProductTemplate | null;
  formData: TemplateFormData;
  setFormData: (data: TemplateFormData) => void;
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
