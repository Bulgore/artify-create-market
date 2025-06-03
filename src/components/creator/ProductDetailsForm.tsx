
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Palette } from 'lucide-react';

interface ProductData {
  name: string;
  description: string;
  margin_percentage: number;
}

interface ProductDetailsFormProps {
  productData: ProductData;
  setProductData: (data: ProductData) => void;
  finalPrice: number;
  isLoading: boolean;
  canSubmit: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const ProductDetailsForm: React.FC<ProductDetailsFormProps> = ({
  productData,
  setProductData,
  finalPrice,
  isLoading,
  canSubmit,
  onSubmit
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          3. Détails du produit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du produit *</Label>
            <Input
              id="name"
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              placeholder="Ex: Mon T-shirt personnalisé"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={productData.description}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              placeholder="Description de votre création..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="margin">Marge créateur (%)</Label>
            <Input
              id="margin"
              type="number"
              value={productData.margin_percentage}
              onChange={(e) => setProductData({ ...productData, margin_percentage: Number(e.target.value) })}
              min={5}
              max={100}
            />
            <div className="text-sm text-gray-500">
              Prix final: {finalPrice.toFixed(2)}€
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-[#33C3F0] hover:bg-[#0FA0CE]"
            disabled={isLoading || !canSubmit}
          >
            {isLoading ? "Création en cours..." : "Créer le produit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductDetailsForm;
