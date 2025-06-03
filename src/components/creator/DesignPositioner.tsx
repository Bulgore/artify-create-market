
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Move, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface DesignPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface DesignPositionerProps {
  templateSvgUrl: string;
  designImageUrl: string;
  designArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  onPositionChange: (position: DesignPosition) => void;
  initialPosition?: DesignPosition;
}

const DesignPositioner: React.FC<DesignPositionerProps> = ({
  templateSvgUrl,
  designImageUrl,
  designArea,
  onPositionChange,
  initialPosition
}) => {
  const [position, setPosition] = useState<DesignPosition>(
    initialPosition || {
      x: designArea.x + designArea.width / 2 - 50,
      y: designArea.y + designArea.height / 2 - 50,
      width: 100,
      height: 100,
      rotation: 0
    }
  );
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const updatePosition = useCallback((newPosition: DesignPosition) => {
    // Contraindre la position dans la zone imprimable
    const constrainedPosition = {
      ...newPosition,
      x: Math.max(designArea.x, Math.min(designArea.x + designArea.width - newPosition.width, newPosition.x)),
      y: Math.max(designArea.y, Math.min(designArea.y + designArea.height - newPosition.height, newPosition.y))
    };
    
    setPosition(constrainedPosition);
    onPositionChange(constrainedPosition);
  }, [designArea, onPositionChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left - position.x,
        y: e.clientY - rect.top - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      const newX = e.clientX - rect.left - dragStart.x;
      const newY = e.clientY - rect.top - dragStart.y;
      
      updatePosition({
        ...position,
        x: newX,
        y: newY
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    updatePosition({
      ...position,
      [dimension]: value
    });
  };

  const handleRotationChange = (rotation: number) => {
    updatePosition({
      ...position,
      rotation
    });
  };

  const resetPosition = () => {
    const resetPos = {
      x: designArea.x + designArea.width / 2 - 50,
      y: designArea.y + designArea.height / 2 - 50,
      width: 100,
      height: 100,
      rotation: 0
    };
    updatePosition(resetPos);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Move className="h-5 w-5" />
            Positionnement du design
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-gray-50">
            <svg
              ref={svgRef}
              viewBox="0 0 400 400"
              className="w-full h-96 border rounded cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Template SVG en arrière-plan */}
              <image
                href={templateSvgUrl}
                x="0"
                y="0"
                width="400"
                height="400"
                opacity="0.3"
              />
              
              {/* Zone imprimable */}
              <rect
                x={designArea.x}
                y={designArea.y}
                width={designArea.width}
                height={designArea.height}
                fill="none"
                stroke="#33C3F0"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              
              {/* Design de l'utilisateur */}
              <g
                transform={`translate(${position.x + position.width/2}, ${position.y + position.height/2}) rotate(${position.rotation}) translate(${-position.width/2}, ${-position.height/2})`}
              >
                <image
                  href={designImageUrl}
                  x="0"
                  y="0"
                  width={position.width}
                  height={position.height}
                  onMouseDown={handleMouseDown}
                  className="cursor-move"
                />
                
                {/* Bordure de sélection */}
                <rect
                  x="0"
                  y="0"
                  width={position.width}
                  height={position.height}
                  fill="none"
                  stroke="#FF6B35"
                  strokeWidth="2"
                  className="pointer-events-none"
                />
              </g>
            </svg>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label>Position X</Label>
              <Input
                type="number"
                value={Math.round(position.x)}
                onChange={(e) => updatePosition({ ...position, x: Number(e.target.value) })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Position Y</Label>
              <Input
                type="number"
                value={Math.round(position.y)}
                onChange={(e) => updatePosition({ ...position, y: Number(e.target.value) })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Largeur</Label>
              <Slider
                value={[position.width]}
                onValueChange={([value]) => handleSizeChange('width', value)}
                min={20}
                max={200}
                step={1}
                className="w-full"
              />
              <div className="text-sm text-gray-500">{Math.round(position.width)}px</div>
            </div>
            
            <div className="space-y-2">
              <Label>Hauteur</Label>
              <Slider
                value={[position.height]}
                onValueChange={([value]) => handleSizeChange('height', value)}
                min={20}
                max={200}
                step={1}
                className="w-full"
              />
              <div className="text-sm text-gray-500">{Math.round(position.height)}px</div>
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label>Rotation</Label>
              <Slider
                value={[position.rotation]}
                onValueChange={([value]) => handleRotationChange(value)}
                min={-180}
                max={180}
                step={1}
                className="w-full"
              />
              <div className="text-sm text-gray-500">{position.rotation}°</div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button onClick={resetPosition} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignPositioner;
