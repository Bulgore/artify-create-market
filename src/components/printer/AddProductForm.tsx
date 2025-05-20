
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProductFormData {
  name: string;
  description: string;
  base_price: number;
  material: string;
  stock_quantity: number;
  print_area: { width: number; height: number; unit: string };
  images: string[];
  available_sizes: string[];
}

interface AddProductFormProps {
  formData: ProductFormData;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSizeToggle: (size: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  formData,
  isLoading,
  onInputChange,
  onSelectChange,
  onSizeToggle,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nom du produit</Label>
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
          <Label htmlFor="material">Matériau</Label>
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
          <Label htmlFor="base_price">Prix de base (€)</Label>
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
        <Label htmlFor="stock_quantity">Quantité en stock</Label>
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
        <Label>Tailles disponibles</Label>
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
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-[#33C3F0] hover:bg-[#0FA0CE]"
        disabled={isLoading}
      >
        {isLoading ? "Ajout en cours..." : "Ajouter le produit"}
      </Button>
    </form>
  );
};

export default AddProductForm;
