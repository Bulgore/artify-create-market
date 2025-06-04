
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface DesignPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface DesignArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PositionControlsProps {
  position: DesignPosition;
  designArea: DesignArea;
  imageLoaded: boolean;
  onInputChange: (field: keyof DesignPosition, value: string) => void;
  onSizeChange: (dimension: 'width' | 'height', value: number[]) => void;
  onRotationChange: (rotation: number[]) => void;
  onReset: () => void;
}

export const PositionControls: React.FC<PositionControlsProps> = ({
  position,
  designArea,
  imageLoaded,
  onInputChange,
  onSizeChange,
  onRotationChange,
  onReset
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Label>Position X</Label>
          <Input
            type="number"
            value={Math.round(position.x)}
            onChange={(e) => onInputChange('x', e.target.value)}
            disabled={!imageLoaded}
            min={designArea.x}
            max={designArea.x + designArea.width - position.width}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Position Y</Label>
          <Input
            type="number"
            value={Math.round(position.y)}
            onChange={(e) => onInputChange('y', e.target.value)}
            disabled={!imageLoaded}
            min={designArea.y}
            max={designArea.y + designArea.height - position.height}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Largeur</Label>
          <Slider
            value={[position.width]}
            onValueChange={(value) => onSizeChange('width', value)}
            min={10}
            max={Math.min(300, designArea.width)}
            step={1}
            className="w-full"
            disabled={!imageLoaded}
          />
          <div className="text-sm text-gray-500">{Math.round(position.width)}px</div>
        </div>
        
        <div className="space-y-2">
          <Label>Hauteur</Label>
          <Slider
            value={[position.height]}
            onValueChange={(value) => onSizeChange('height', value)}
            min={10}
            max={Math.min(300, designArea.height)}
            step={1}
            className="w-full"
            disabled={!imageLoaded}
          />
          <div className="text-sm text-gray-500">{Math.round(position.height)}px</div>
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label>Rotation</Label>
          <Slider
            value={[position.rotation]}
            onValueChange={onRotationChange}
            min={-180}
            max={180}
            step={1}
            className="w-full"
            disabled={!imageLoaded}
          />
          <div className="text-sm text-gray-500">{position.rotation}°</div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button 
          onClick={onReset} 
          variant="outline" 
          size="sm"
          disabled={!imageLoaded}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      </div>
    </>
  );
};
