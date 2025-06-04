
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Move, RotateCcw } from 'lucide-react';

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
  console.log('DesignPositioner props:', {
    templateSvgUrl,
    designImageUrl,
    designArea,
    initialPosition
  });

  // Ensure designArea has valid values with fallbacks
  const safeDesignArea = {
    x: Number(designArea?.x) || 50,
    y: Number(designArea?.y) || 50,
    width: Number(designArea?.width) || 200,
    height: Number(designArea?.height) || 200
  };

  console.log('Safe design area:', safeDesignArea);

  const [position, setPosition] = useState<DesignPosition>(
    initialPosition || {
      x: safeDesignArea.x + 20,
      y: safeDesignArea.y + 20,
      width: Math.min(100, safeDesignArea.width - 40),
      height: Math.min(100, safeDesignArea.height - 40),
      rotation: 0
    }
  );
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  console.log('Current position:', position);

  // Load images and handle errors
  useEffect(() => {
    if (designImageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        console.log('Design image loaded successfully');
        setImageLoaded(true);
      };
      img.onerror = (error) => {
        console.error('Error loading design image:', error);
        setImageLoaded(false);
      };
      img.src = designImageUrl;
    }
  }, [designImageUrl]);

  useEffect(() => {
    if (templateSvgUrl) {
      // For SVG, we'll handle it differently since it's base64
      if (templateSvgUrl.startsWith('data:image/svg+xml')) {
        console.log('Template SVG loaded (base64)');
        setTemplateLoaded(true);
      } else {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          console.log('Template image loaded successfully');
          setTemplateLoaded(true);
        };
        img.onerror = (error) => {
          console.error('Error loading template image:', error);
          setTemplateLoaded(false);
        };
        img.src = templateSvgUrl;
      }
    }
  }, [templateSvgUrl]);

  const updatePosition = useCallback((newPosition: DesignPosition) => {
    // Ensure all values are valid numbers
    const validPosition = {
      x: Number(newPosition.x) || 0,
      y: Number(newPosition.y) || 0,
      width: Math.max(20, Number(newPosition.width) || 20),
      height: Math.max(20, Number(newPosition.height) || 20),
      rotation: Number(newPosition.rotation) || 0
    };

    // Constrain position within design area
    const constrainedPosition = {
      ...validPosition,
      x: Math.max(safeDesignArea.x, Math.min(safeDesignArea.x + safeDesignArea.width - validPosition.width, validPosition.x)),
      y: Math.max(safeDesignArea.y, Math.min(safeDesignArea.y + safeDesignArea.height - validPosition.height, validPosition.y))
    };
    
    console.log('Updating position:', constrainedPosition);
    setPosition(constrainedPosition);
    onPositionChange(constrainedPosition);
  }, [safeDesignArea, onPositionChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      const scaleX = 400 / rect.width;
      const scaleY = 400 / rect.height;
      setDragStart({
        x: (e.clientX - rect.left) * scaleX - position.x,
        y: (e.clientY - rect.top) * scaleY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      const scaleX = 400 / rect.width;
      const scaleY = 400 / rect.height;
      const newX = (e.clientX - rect.left) * scaleX - dragStart.x;
      const newY = (e.clientY - rect.top) * scaleY - dragStart.y;
      
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

  const handleSizeChange = (dimension: 'width' | 'height', value: number[]) => {
    const newValue = value[0];
    updatePosition({
      ...position,
      [dimension]: newValue
    });
  };

  const handleRotationChange = (rotation: number[]) => {
    updatePosition({
      ...position,
      rotation: rotation[0]
    });
  };

  const handleInputChange = (field: keyof DesignPosition, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updatePosition({
        ...position,
        [field]: numValue
      });
    }
  };

  const resetPosition = () => {
    const resetPos = {
      x: safeDesignArea.x + 20,
      y: safeDesignArea.y + 20,
      width: Math.min(100, safeDesignArea.width - 40),
      height: Math.min(100, safeDesignArea.height - 40),
      rotation: 0
    };
    updatePosition(resetPos);
  };

  // Check if we have a valid design image URL
  if (!designImageUrl) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Move className="h-5 w-5" />
            Positionnement du design
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun design sélectionné</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              style={{ maxHeight: '400px' }}
            >
              {/* Template SVG background */}
              {templateSvgUrl && templateLoaded && (
                <image
                  href={templateSvgUrl}
                  x="0"
                  y="0"
                  width="400"
                  height="400"
                  opacity="0.3"
                  preserveAspectRatio="xMidYMid meet"
                />
              )}
              
              {/* Design area boundaries */}
              <rect
                x={safeDesignArea.x}
                y={safeDesignArea.y}
                width={safeDesignArea.width}
                height={safeDesignArea.height}
                fill="rgba(51, 195, 240, 0.1)"
                stroke="#33C3F0"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              
              {/* User design image */}
              {imageLoaded && (
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
                    preserveAspectRatio="xMidYMid meet"
                  />
                  
                  {/* Selection border */}
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
                  
                  {/* Resize handle */}
                  <circle
                    cx={position.width}
                    cy={position.height}
                    r="4"
                    fill="#FF6B35"
                    className="cursor-se-resize"
                  />
                </g>
              )}
              
              {/* Loading indicator for design image */}
              {!imageLoaded && (
                <text
                  x="200"
                  y="200"
                  textAnchor="middle"
                  fill="#666"
                  fontSize="14"
                >
                  Chargement du design...
                </text>
              )}
            </svg>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label>Position X</Label>
              <Input
                type="number"
                value={Math.round(position.x)}
                onChange={(e) => handleInputChange('x', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Position Y</Label>
              <Input
                type="number"
                value={Math.round(position.y)}
                onChange={(e) => handleInputChange('y', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Largeur</Label>
              <Slider
                value={[position.width]}
                onValueChange={(value) => handleSizeChange('width', value)}
                min={20}
                max={Math.min(300, safeDesignArea.width)}
                step={1}
                className="w-full"
              />
              <div className="text-sm text-gray-500">{Math.round(position.width)}px</div>
            </div>
            
            <div className="space-y-2">
              <Label>Hauteur</Label>
              <Slider
                value={[position.height]}
                onValueChange={(value) => handleSizeChange('height', value)}
                min={20}
                max={Math.min(300, safeDesignArea.height)}
                step={1}
                className="w-full"
              />
              <div className="text-sm text-gray-500">{Math.round(position.height)}px</div>
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label>Rotation</Label>
              <Slider
                value={[position.rotation]}
                onValueChange={handleRotationChange}
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
          
          {/* Debug info */}
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
            <p>Debug: Image chargée: {imageLoaded ? 'Oui' : 'Non'}</p>
            <p>Template chargé: {templateLoaded ? 'Oui' : 'Non'}</p>
            <p>URL design: {designImageUrl ? 'Présente' : 'Manquante'}</p>
            <p>Zone design: {safeDesignArea.width}x{safeDesignArea.height}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignPositioner;
