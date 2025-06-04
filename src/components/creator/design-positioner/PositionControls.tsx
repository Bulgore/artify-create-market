
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Move, Maximize, RotateCw } from 'lucide-react';

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Move className="h-5 w-5" />
          Contrôles de positionnement
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!imageLoaded && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 text-sm">
              ⏳ En attente du chargement de l'image...
            </p>
          </div>
        )}
        
        <div className="space-y-6">
          {/* Position */}
          <div>
            <Label className="text-base font-medium flex items-center gap-2 mb-3">
              <Move className="h-4 w-4" />
              Position
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Position X</Label>
                <Input
                  type="number"
                  value={Math.round(position.x)}
                  onChange={(e) => onInputChange('x', e.target.value)}
                  disabled={!imageLoaded}
                  min={designArea.x}
                  max={designArea.x + designArea.width - position.width}
                  className="text-center"
                />
                <div className="text-xs text-gray-500 text-center">
                  {Math.round(position.x)}px
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Position Y</Label>
                <Input
                  type="number"
                  value={Math.round(position.y)}
                  onChange={(e) => onInputChange('y', e.target.value)}
                  disabled={!imageLoaded}
                  min={designArea.y}
                  max={designArea.y + designArea.height - position.height}
                  className="text-center"
                />
                <div className="text-xs text-gray-500 text-center">
                  {Math.round(position.y)}px
                </div>
              </div>
            </div>
          </div>

          {/* Taille */}
          <div>
            <Label className="text-base font-medium flex items-center gap-2 mb-3">
              <Maximize className="h-4 w-4" />
              Dimensions
            </Label>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-600">Largeur</Label>
                  <span className="text-sm font-medium text-blue-600">
                    {Math.round(position.width)}px
                  </span>
                </div>
                <Slider
                  value={[position.width]}
                  onValueChange={(value) => onSizeChange('width', value)}
                  min={20}
                  max={Math.min(300, designArea.width)}
                  step={1}
                  className="w-full"
                  disabled={!imageLoaded}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-600">Hauteur</Label>
                  <span className="text-sm font-medium text-blue-600">
                    {Math.round(position.height)}px
                  </span>
                </div>
                <Slider
                  value={[position.height]}
                  onValueChange={(value) => onSizeChange('height', value)}
                  min={20}
                  max={Math.min(300, designArea.height)}
                  step={1}
                  className="w-full"
                  disabled={!imageLoaded}
                />
              </div>
            </div>
          </div>
          
          {/* Rotation */}
          <div>
            <Label className="text-base font-medium flex items-center gap-2 mb-3">
              <RotateCw className="h-4 w-4" />
              Rotation
            </Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-600">Angle</Label>
                <span className="text-sm font-medium text-purple-600">
                  {position.rotation}°
                </span>
              </div>
              <Slider
                value={[position.rotation]}
                onValueChange={onRotationChange}
                min={-180}
                max={180}
                step={1}
                className="w-full"
                disabled={!imageLoaded}
              />
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 mt-6 pt-4 border-t">
          <Button 
            onClick={onReset} 
            variant="outline" 
            size="sm"
            disabled={!imageLoaded}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Réinitialiser
          </Button>
          <div className="text-xs text-gray-500 flex items-center ml-auto">
            Design dans la zone: {position.x >= designArea.x && 
                                  position.y >= designArea.y && 
                                  position.x + position.width <= designArea.x + designArea.width && 
                                  position.y + position.height <= designArea.y + designArea.height ? '✅' : '⚠️'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
