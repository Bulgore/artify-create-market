
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PrintArea } from '@/types/printArea';

interface PrintAreaInputsProps {
  area: PrintArea;
  type: 'svg' | 'mockup';
  onInputChange: (field: keyof PrintArea, value: number, type: 'svg' | 'mockup') => void;
}

export const PrintAreaInputs: React.FC<PrintAreaInputsProps> = ({
  area,
  type,
  onInputChange
}) => {
  const idPrefix = type === 'svg' ? 'svg' : 'mockup';
  const title = type === 'svg' 
    ? 'Coordonnées de la zone d\'impression SVG'
    : 'Coordonnées de la zone d\'aperçu mockup';

  return (
    <div className="space-y-4">
      <Label>{title}</Label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${idPrefix}-x`}>X</Label>
          <Input
            id={`${idPrefix}-x`}
            type="number"
            value={Math.round(area.x * 100) / 100}
            onChange={(e) => onInputChange('x', Number(e.target.value), type)}
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}-y`}>Y</Label>
          <Input
            id={`${idPrefix}-y`}
            type="number"
            value={Math.round(area.y * 100) / 100}
            onChange={(e) => onInputChange('y', Number(e.target.value), type)}
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}-width`}>Largeur</Label>
          <Input
            id={`${idPrefix}-width`}
            type="number"
            value={Math.round(area.width * 100) / 100}
            onChange={(e) => onInputChange('width', Number(e.target.value), type)}
            min="10"
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}-height`}>Hauteur</Label>
          <Input
            id={`${idPrefix}-height`}
            type="number"
            value={Math.round(area.height * 100) / 100}
            onChange={(e) => onInputChange('height', Number(e.target.value), type)}
            min="10"
            step="0.01"
          />
        </div>
      </div>
      <div className={`mt-4 p-3 border rounded ${
        type === 'svg' 
          ? 'bg-green-50 border-green-200' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <p className={`text-sm font-medium ${
          type === 'svg' ? 'text-green-700' : 'text-blue-700'
        }`}>
          {type === 'svg' ? 'Zone d\'impression actuelle:' : 'Zone d\'aperçu actuelle:'}
        </p>
        <p className={`text-xs mt-1 ${
          type === 'svg' ? 'text-green-600' : 'text-blue-600'
        }`}>
          Position: ({Math.round(area.x)}, {Math.round(area.y)}) | 
          Taille: {Math.round(area.width)}×{Math.round(area.height)}px
        </p>
      </div>
    </div>
  );
};
