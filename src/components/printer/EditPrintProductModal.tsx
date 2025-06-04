
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';

interface PrintProduct {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  material: string;
  stock_quantity: number;
  images: string[];
  available_sizes: string[];
  available_colors: string[];
  is_active: boolean;
  template_id: string | null;
}

interface ProductTemplate {
  id: string;
  name: string;
  type: string;
}

interface EditPrintProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: PrintProduct | null;
  onProductUpdated: () => void;
}

const EditPrintProductModal: React.FC<EditPrintProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onProductUpdated
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: 0,
    material: '',
    stock_quantity: 0,
    available_sizes: [] as string[],
    available_colors: [] as string[],
    is_active: true,
    template_id: '' as string | null
  });
  const [templates, setTemplates] = useState<ProductTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = ['white', 'black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'gray'];

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        base_price: product.base_price,
        material: product.material,
        stock_quantity: product.stock_quantity,
        available_sizes: product.available_sizes,
        available_colors: product.available_colors,
        is_active: product.is_active,
        template_id: product.template_id || null
      });
    }
  }, [product]);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('product_templates')
        .select('id, name, type')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les gabarits."
      });
    }
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      available_sizes: prev.available_sizes.includes(size)
        ? prev.available_sizes.filter(s => s !== size)
        : [...prev.available_sizes, size]
    }));
  };

  const handleColorToggle = (color: string) => {
    setFormData(prev => ({
      ...prev,
      available_colors: prev.available_colors.includes(color)
        ? prev.available_colors.filter(c => c !== color)
        : [...prev.available_colors, color]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;

    if (formData.available_sizes.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner au moins une taille."
      });
      return;
    }

    if (formData.available_colors.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner au moins une couleur."
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('print_products')
        .update({
          name: formData.name.trim(),
          description: formData.description?.trim() || null,
          base_price: formData.base_price,
          material: formData.material.trim(),
          stock_quantity: formData.stock_quantity,
          available_sizes: formData.available_sizes,
          available_colors: formData.available_colors,
          is_active: formData.is_active,
          template_id: formData.template_id || null
        })
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: "Produit mis à jour",
        description: "Le produit a été mis à jour avec succès."
      });

      onProductUpdated();
      onClose();
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le produit."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le produit</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du produit *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">Matériau *</Label>
              <Input
                id="material"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Gabarit *</Label>
            <Select 
              value={formData.template_id || ''} 
              onValueChange={(value) => setFormData({ ...formData, template_id: value || null })}
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
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
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
                onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tailles disponibles *</Label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(size => (
                <Badge
                  key={size}
                  variant={formData.available_sizes.includes(size) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleSizeToggle(size)}
                >
                  {size}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Couleurs disponibles *</Label>
            <div className="flex flex-wrap gap-2">
              {availableColors.map(color => (
                <Badge
                  key={color}
                  variant={formData.available_colors.includes(color) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleColorToggle(color)}
                >
                  {color}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Produit actif</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#33C3F0] hover:bg-[#0FA0CE]">
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPrintProductModal;
