
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { PrintProduct } from '@/types/customProduct';

interface ProductData {
  name: string;
  description: string;
  margin_percentage: number;
}

interface ProductDetailsSectionProps {
  selectedProduct: PrintProduct;
  productData: ProductData;
  setProductData: (data: ProductData) => void;
  canSubmit: boolean;
  onSubmit: () => void;
}

export const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({
  selectedProduct,
  productData,
  setProductData,
  canSubmit,
  onSubmit
}) => {
  const finalPrice = selectedProduct.base_price * (1 + productData.margin_percentage / 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails du produit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Nom du produit *</Label>
          <Input
            id="name"
            value={productData.name}
            onChange={(e) => setProductData({...productData, name: e.target.value})}
            placeholder="Mon super design"
          />
          <p className="text-xs text-gray-500 mt-1">
            Le nom en français sera automatiquement utilisé pour toutes les langues
          </p>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={productData.description}
            onChange={(e) => setProductData({...productData, description: e.target.value})}
            placeholder="Description du produit..."
          />
          <p className="text-xs text-gray-500 mt-1">
            La description en français sera automatiquement utilisée pour toutes les langues
          </p>
        </div>

        <div>
          <Label htmlFor="margin">Marge créateur (%)</Label>
          <Input
            id="margin"
            type="number"
            value={productData.margin_percentage}
            onChange={(e) => setProductData({...productData, margin_percentage: Number(e.target.value)})}
            min="0"
            max="100"
          />
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span>Prix de base:</span>
            <span>{selectedProduct.base_price.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Marge ({productData.margin_percentage}%):</span>
            <span>+{(selectedProduct.base_price * productData.margin_percentage / 100).toFixed(2)} €</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Prix final:</span>
            <span>{finalPrice.toFixed(2)} €</span>
          </div>
        </div>

        <Button 
          onClick={onSubmit}
          className="w-full"
          disabled={!canSubmit}
        >
          {canSubmit ? 'Créer le produit' : 'Informations manquantes'}
        </Button>
      </CardContent>
    </Card>
  );
};
