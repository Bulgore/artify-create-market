
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductTemplate {
  id: string;
  name: string;
  type: string;
}

interface ProductFormData {
  name: string;
  description: string;
  base_price: number;
  material: string;
  stock_quantity: number;
  is_active: boolean;
  template_id: string | null;
}

interface ProductBasicInfoProps {
  formData: ProductFormData;
  templates: ProductTemplate[];
  onFormDataChange: (updates: Partial<ProductFormData>) => void;
}

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({
  formData,
  templates,
  onFormDataChange
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du produit *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onFormDataChange({ name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="material">Matériau *</Label>
          <Input
            id="material"
            value={formData.material}
            onChange={(e) => onFormDataChange({ material: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="template">Gabarit *</Label>
        <Select 
          value={formData.template_id || ''} 
          onValueChange={(value) => onFormDataChange({ template_id: value || null })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un gabarit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Aucun gabarit</SelectItem>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name} ({template.type})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500">
          Le gabarit est requis pour que les créateurs puissent utiliser ce produit.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFormDataChange({ description: e.target.value })}
          className="min-h-[80px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="base_price">Prix de base *</Label>
          <Input
            id="base_price"
            type="number"
            step="0.01"
            min="0"
            value={formData.base_price}
            onChange={(e) => onFormDataChange({ base_price: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock_quantity">Stock</Label>
          <Input
            id="stock_quantity"
            type="number"
            min="0"
            value={formData.stock_quantity}
            onChange={(e) => onFormDataChange({ stock_quantity: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => onFormDataChange({ is_active: checked })}
        />
        <Label htmlFor="is_active">Produit actif</Label>
      </div>
    </div>
  );
};

export default ProductBasicInfo;
