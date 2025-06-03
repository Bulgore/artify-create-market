
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, X } from "lucide-react";
import TemplateFileUpload from "../content/TemplateFileUpload";
import PrintAreaSelector from "../content/PrintAreaSelector";
import { TemplateFormData } from "@/types/templates";

interface TemplateFormProps {
  formData: TemplateFormData;
  setFormData: (data: TemplateFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

const TemplateForm: React.FC<TemplateFormProps> = ({
  formData,
  setFormData,
  onSave,
  onCancel,
  isEditing
}) => {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TemplateFileUpload
          label="Fichier SVG du produit"
          accept=".svg,image/svg+xml"
          currentUrl={formData.svg_file_url}
          onUrlChange={(url) => setFormData({...formData, svg_file_url: url})}
          fileType="svg"
        />
        
        <TemplateFileUpload
          label="Image mockup du produit"
          accept="image/*"
          currentUrl={formData.mockup_image_url}
          onUrlChange={(url) => setFormData({...formData, mockup_image_url: url})}
          fileType="image"
        />
      </div>

      <PrintAreaSelector
        svgUrl={formData.svg_file_url}
        mockupUrl={formData.mockup_image_url}
        printArea={formData.design_area}
        onPrintAreaChange={(area) => setFormData({...formData, design_area: area})}
        mockupPrintArea={formData.mockup_area}
        onMockupPrintAreaChange={(area) => setFormData({...formData, mockup_area: area})}
      />

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

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
        <Button onClick={onSave} className="bg-[#33C3F0] hover:bg-[#0FA0CE]">
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </div>
  );
};

export default TemplateForm;
