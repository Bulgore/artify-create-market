
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, X } from "lucide-react";
import { TemplateFormData } from "@/types/templates";
import { MockupManager } from "./MockupManager";
import { PrinterSelector } from "./PrinterSelector";

interface TemplateFormProps {
  formData: TemplateFormData;
  setFormData: (data: TemplateFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
  templateId?: string;
}

const TemplateForm: React.FC<TemplateFormProps> = ({
  formData,
  setFormData,
  onSave,
  onCancel,
  isEditing,
  templateId
}) => {
  const handlePrinterChange = (printerId: string) => {
    console.log('🔄 Printer selection changed:', printerId);
    setFormData({ ...formData, printer_id: printerId });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nom du produit</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="T-shirt classique"
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Input
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            placeholder="T-shirt, Mug, Sac..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Positions disponibles (séparées par des virgules)</Label>
          <Input
            value={formData.available_positions.join(', ')}
            onChange={(e) => setFormData({
              ...formData, 
              available_positions: e.target.value.split(',').map(s => s.trim()).filter(s => s)
            })}
            placeholder="face, dos, manche"
          />
        </div>
        <div>
          <Label>Couleurs disponibles (séparées par des virgules)</Label>
          <Input
            value={formData.available_colors.join(', ')}
            onChange={(e) => setFormData({
              ...formData, 
              available_colors: e.target.value.split(',').map(s => s.trim()).filter(s => s)
            })}
            placeholder="white, black, red"
          />
        </div>
      </div>

      <PrinterSelector
        selectedPrinterId={formData.printer_id}
        onPrinterChange={handlePrinterChange}
      />

      <div>
        <Label htmlFor="instructions">Instructions techniques</Label>
        <Textarea
          id="instructions"
          value={formData.technical_instructions}
          onChange={(e) => setFormData({...formData, technical_instructions: e.target.value})}
          placeholder="Instructions pour les créateurs..."
          className="h-24"
        />
      </div>

      {isEditing && templateId && (
        <div>
          <Label>Gestion des Mockups</Label>
          <MockupManager templateId={templateId} />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
        <Button onClick={onSave} disabled={!formData.printer_id} className="bg-[#33C3F0] hover:bg-[#0FA0CE]">
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </div>
  );
};

export default TemplateForm;
