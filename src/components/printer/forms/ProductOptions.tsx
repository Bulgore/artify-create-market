
import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface ProductOptionsProps {
  availableSizes: string[];
  availableColors: string[];
  selectedSizes: string[];
  selectedColors: string[];
  onSizeToggle: (size: string) => void;
  onColorToggle: (color: string) => void;
}

const ProductOptions: React.FC<ProductOptionsProps> = ({
  availableSizes,
  availableColors,
  selectedSizes,
  selectedColors,
  onSizeToggle,
  onColorToggle
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Tailles disponibles *</Label>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map(size => (
            <Badge
              key={size}
              variant={selectedSizes.includes(size) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onSizeToggle(size)}
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
              variant={selectedColors.includes(color) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onColorToggle(color)}
            >
              {color}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductOptions;
