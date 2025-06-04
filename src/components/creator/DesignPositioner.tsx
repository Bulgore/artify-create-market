
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
  console.log('DesignPositioner received props:', {
    templateSvgUrl: templateSvgUrl?.substring(0, 50) + '...',
    designImageUrl: designImageUrl?.substring(0, 50) + '...',
    designArea,
    initialPosition
  });

  // Validate and ensure designArea has proper numeric values
  const validDesignArea = {
    x: isNaN(Number(designArea?.x)) ? 50 : Number(designArea.x),
    y: isNaN(Number(designArea?.y)) ? 50 : Number(designArea.y),
    width: isNaN(Number(designArea?.width)) || Number(designArea.width) <= 0 ? 200 : Number(designArea.width),
    height: isNaN(Number(designArea?.height)) || Number(designArea.height) <= 0 ? 200 : Number(designArea.height)
  };

  console.log('Validated design area:', validDesignArea);

  const [position, setPosition] = useState<DesignPosition>(
    initialPosition || {
      x: validDesignArea.x + 20,
      y: validDesignArea.y + 20,
      width: Math.min(100, validDesignArea.width - 40),
      height: Math.min(100, validDesignArea.height - 40),
      rotation: 0
    }
  );
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [templateError, setTemplateError] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Preload design image
  useEffect(() => {
    if (!designImageUrl) {
      console.log('No design image URL provided');
      setImageLoaded(false);
      setImageError(false);
      return;
    }

    console.log('Loading design image:', designImageUrl);
    setImageLoaded(false);
    setImageError(false);
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log('✅ Design image loaded successfully:', {
        src: designImageUrl,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      });
      setImageLoaded(true);
      setImageError(false);
    };
    
    img.onerror = (error) => {
      console.error('❌ Design image failed to load:', error, designImageUrl);
      setImageLoaded(false);
      setImageError(true);
    };
    
    img.src = designImageUrl;
  }, [designImageUrl]);

  // Preload template
  useEffect(() => {
    if (!templateSvgUrl) {
      console.log('No template URL provided');
      setTemplateLoaded(false);
      setTemplateError(false);
      return;
    }

    console.log('Loading template:', templateSvgUrl);
    setTemplateLoaded(false);
    setTemplateError(false);
    
    // Handle base64 SVG differently
    if (templateSvgUrl.startsWith('data:image/svg+xml')) {
      console.log('✅ Template is base64 SVG, marking as loaded');
      setTemplateLoaded(true);
      setTemplateError(false);
    } else {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        console.log('✅ Template image loaded successfully');
        setTemplateLoaded(true);
        setTemplateError(false);
      };
      
      img.onerror = (error) => {
        console.error('❌ Template failed to load:', error, templateSvgUrl);
        setTemplateLoaded(false);
        setTemplateError(true);
      };
      
      img.src = templateSvgUrl;
    }
  }, [templateSvgUrl]);

  const updatePosition = useCallback((newPosition: DesignPosition) => {
    // Ensure all values are valid numbers with proper fallbacks
    const safePosition = {
      x: isNaN(Number(newPosition.x)) ? validDesignArea.x + 20 : Number(newPosition.x),
      y: isNaN(Number(newPosition.y)) ? validDesignArea.y + 20 : Number(newPosition.y),
      width: isNaN(Number(newPosition.width)) || Number(newPosition.width) < 20 ? 100 : Number(newPosition.width),
      height: isNaN(Number(newPosition.height)) || Number(newPosition.height) < 20 ? 100 : Number(newPosition.height),
      rotation: isNaN(Number(newPosition.rotation)) ? 0 : Number(newPosition.rotation)
    };

    // Constrain position within design area
    const constrainedPosition = {
      ...safePosition,
      x: Math.max(validDesignArea.x, Math.min(validDesignArea.x + validDesignArea.width - safePosition.width, safePosition.x)),
      y: Math.max(validDesignArea.y, Math.min(validDesignArea.y + validDesignArea.height - safePosition.height, safePosition.y))
    };
    
    console.log('Updating position to:', constrainedPosition);
    setPosition(constrainedPosition);
    onPositionChange(constrainedPosition);
  }, [validDesignArea, onPositionChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageLoaded) return;
    
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
    if (!isDragging || !imageLoaded) return;
    
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
      x: validDesignArea.x + 20,
      y: validDesignArea.y + 20,
      width: Math.min(100, validDesignArea.width - 40),
      height: Math.min(100, validDesignArea.height - 40),
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
              {/* Template background */}
              {templateSvgUrl && templateLoaded && !templateError && (
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
              
              {/* Fallback if template fails to load */}
              {(!templateLoaded || templateError) && (
                <rect
                  x="0"
                  y="0"
                  width="400"
                  height="400"
                  fill="#f0f0f0"
                  stroke="#ddd"
                  strokeWidth="1"
                />
              )}
              
              {/* Design area boundaries */}
              <rect
                x={validDesignArea.x}
                y={validDesignArea.y}
                width={validDesignArea.width}
                height={validDesignArea.height}
                fill="rgba(51, 195, 240, 0.1)"
                stroke="#33C3F0"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              
              {/* Design area label */}
              <text
                x={validDesignArea.x + 5}
                y={validDesignArea.y + 15}
                fontSize="12"
                fill="#33C3F0"
                fontWeight="bold"
              >
                Zone d'impression
              </text>
              
              {/* User design image */}
              {imageLoaded && !imageError && (
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
                    r="6"
                    fill="#FF6B35"
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-se-resize"
                  />
                </g>
              )}
              
              {/* Loading/Error states */}
              {!imageLoaded && !imageError && (
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
              
              {imageError && (
                <g>
                  <rect
                    x={validDesignArea.x}
                    y={validDesignArea.y}
                    width={validDesignArea.width}
                    height={validDesignArea.height}
                    fill="#fee2e2"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                  <text
                    x={validDesignArea.x + validDesignArea.width/2}
                    y={validDesignArea.y + validDesignArea.height/2}
                    textAnchor="middle"
                    fill="#ef4444"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    Erreur de chargement
                  </text>
                </g>
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
                disabled={!imageLoaded}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Position Y</Label>
              <Input
                type="number"
                value={Math.round(position.y)}
                onChange={(e) => handleInputChange('y', e.target.value)}
                disabled={!imageLoaded}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Largeur</Label>
              <Slider
                value={[position.width]}
                onValueChange={(value) => handleSizeChange('width', value)}
                min={20}
                max={Math.min(300, validDesignArea.width)}
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
                onValueChange={(value) => handleSizeChange('height', value)}
                min={20}
                max={Math.min(300, validDesignArea.height)}
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
                onValueChange={handleRotationChange}
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
              onClick={resetPosition} 
              variant="outline" 
              size="sm"
              disabled={!imageLoaded}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
          
          {/* Status info */}
          <div className="mt-4 p-3 bg-gray-100 rounded text-sm space-y-1">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${imageLoaded ? 'bg-green-500' : imageError ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
              <span>Design: {imageLoaded ? 'Chargé' : imageError ? 'Erreur' : 'Chargement...'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${templateLoaded ? 'bg-green-500' : templateError ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
              <span>Template: {templateLoaded ? 'Chargé' : templateError ? 'Erreur' : 'Chargement...'}</span>
            </div>
            <div className="text-xs text-gray-600">
              Zone d'impression: {validDesignArea.width}×{validDesignArea.height}px
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignPositioner;
