
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TemplateSelector from "./TemplateSelector";

interface ProductTemplate {
  id: string;
  name: string;
  type: string;
  mockup_image_url: string;
  design_area: any;
  available_positions: string[];
  available_colors: string[];
  technical_instructions: string;
}

interface ProductFormData {
  name: string;
  description: string;
  base_price: number;
  material: string;
  stock_quantity: number;
  template_id: string | null;
  selectedTemplate: ProductTemplate | null;
  available_sizes: string[];
  available_colors: string[];
}

interface AddProductFormProps {
  formData: ProductFormData;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onTemplateSelect: (templateId: string, template: ProductTemplate) => void;
  onSizeToggle: (size: string) => void;
  onColorToggle: (color: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  formData,
  isLoading,
  onInputChange,
  onTemplateSelect,
  onSizeToggle,
  onColorToggle,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <TemplateSelector
        selectedTemplateId={formData.template_id}
        onTemplateSelect={onTemplateSelect}
      />
      
      <div className="space-y-2">
        <Label htmlFor="name">Nom du produit *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          placeholder="Ex: T-shirt coton bio"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          placeholder="Description détaillée du produit"
          className="min-h-[100px]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="material">Matériau *</Label>
          <Input
            id="material"
            name="material"
            value={formData.material}
            onChange={onInputChange}
            placeholder="Ex: 100% coton bio"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="base_price">Prix de base (€) *</Label>
          <Input
            id="base_price"
            name="base_price"
            type="number"
            value={formData.base_price}
            onChange={onInputChange}
            min={0}
            step={0.01}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="stock_quantity">Quantité en stock *</Label>
        <Input
          id="stock_quantity"
          name="stock_quantity"
          type="number"
          value={formData.stock_quantity}
          onChange={onInputChange}
          min={0}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Tailles disponibles *</Label>
        <div className="flex flex-wrap gap-2">
          {["XS", "S", "M", "L", "XL", "XXL"].map(size => (
            <Button
              key={size}
              type="button"
              variant={formData.available_sizes.includes(size) ? "default" : "outline"}
              size="sm"
              onClick={() => onSizeToggle(size)}
            >
              {size}
            </Button>
          ))}
        </div>
        {formData.available_sizes.length === 0 && (
          <p className="text-sm text-red-500">Veuillez sélectionner au moins une taille</p>
        )}
      </div>
      
      {formData.selectedTemplate && formData.selectedTemplate.available_colors.length > 0 && (
        <div className="space-y-2">
          <Label>Couleurs disponibles *</Label>
          <div className="flex flex-wrap gap-2">
            {formData.selectedTemplate.available_colors.map(color => (
              <Button
                key={color}
                type="button"
                variant={formData.available_colors.includes(color) ? "default" : "outline"}
                size="sm"
                onClick={() => onColorToggle(color)}
                className="capitalize"
              >
                {color}
              </Button>
            ))}
          </div>
          {formData.available_colors.length === 0 && (
            <p className="text-sm text-red-500">Veuillez sélectionner au moins une couleur</p>
          )}
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full bg-[#33C3F0] hover:bg-[#0FA0CE]"
        disabled={isLoading || !formData.template_id || formData.available_sizes.length === 0 || formData.available_colors.length === 0}
      >
        {isLoading ? "Ajout en cours..." : "Ajouter le produit"}
      </Button>
    </form>
  );
};

export default AddProductForm;
