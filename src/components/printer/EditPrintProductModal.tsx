
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';
import { useEditProduct } from '@/hooks/useEditProduct';
import ProductBasicInfo from './forms/ProductBasicInfo';
import ProductOptions from './forms/ProductOptions';

interface PrintProduct {
  id: string;
  name_fr?: string;
  name_en?: string;
  name_ty?: string;
  name?: string;
  description_fr?: string | null;
  description_en?: string | null;
  description_ty?: string | null;
  description?: string | null;
  base_price: number;
  material: string;
  stock_quantity: number;
  images: string[];
  available_sizes: string[];
  available_colors: string[];
  is_active: boolean;
  template_id: string | null;
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
  // Mapper le produit avec les champs français pour la compatibilité
  const mappedProduct = product ? {
    ...product,
    name_fr: product.name_fr || product.name || '',
    description_fr: product.description_fr || product.description || '',
    name: product.name || product.name_fr || '',
    description: product.description || product.description_fr || ''
  } : null;

  const {
    formData,
    setFormData,
    templates,
    isLoading,
    fetchTemplates,
    updateProduct
  } = useEditProduct(mappedProduct);

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = ['white', 'black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'gray'];

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

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
    
    const success = await updateProduct();
    if (success) {
      onProductUpdated();
      onClose();
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
          <ProductBasicInfo
            formData={formData}
            templates={templates}
            onFormDataChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
          />

          <ProductOptions
            availableSizes={availableSizes}
            availableColors={availableColors}
            selectedSizes={formData.available_sizes}
            selectedColors={formData.available_colors}
            onSizeToggle={handleSizeToggle}
            onColorToggle={handleColorToggle}
          />

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
