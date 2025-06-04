
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Move, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

  // Validate and ensure designArea has proper numeric values with better defaults
  const validDesignArea = {
    x: (typeof designArea?.x === 'number' && !isNaN(designArea.x)) ? designArea.x : 50,
    y: (typeof designArea?.y === 'number' && !isNaN(designArea.y)) ? designArea.y : 50,
    width: (typeof designArea?.width === 'number' && !isNaN(designArea.width) && designArea.width > 0) ? designArea.width : 200,
    height: (typeof designArea?.height === 'number' && !isNaN(designArea.height) && designArea.height > 0) ? designArea.height : 200
  };

  console.log('Validated design area:', validDesignArea);

  const [position, setPosition] = useState<DesignPosition>(
    initialPosition || {
      x: validDesignArea.x + 10,
      y: validDesignArea.y + 10,
      width: Math.min(80, validDesignArea.width - 20),
      height: Math.min(80, validDesignArea.height - 20),
      rotation: 0
    }
  );
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [templateError, setTemplateError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const svgRef = useRef<SVGSVGElement>(null);

  // Function to get signed URL for private images
  const getSignedImageUrl = async (url: string): Promise<string> => {
    try {
      console.log('Getting signed URL for:', url);
      
      // Check if it's already a signed URL or public URL
      if (url.includes('sign') || url.includes('public')) {
        return url;
      }

      // Extract path from storage URL
      const urlParts = url.split('/storage/v1/object/');
      if (urlParts.length < 2) {
        console.log('Not a storage URL, returning as is');
        return url;
      }

      const pathPart = urlParts[1];
      const bucketAndPath = pathPart.split('/');
      const bucket = bucketAndPath[0];
      const filePath = bucketAndPath.slice(1).join('/');

      console.log('Extracted bucket:', bucket, 'path:', filePath);

      // Try to get signed URL
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 3600); // 1 hour

      if (error) {
        console.error('Error creating signed URL:', error);
        // Fallback to public URL
        const { data: publicData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);
        return publicData.publicUrl;
      }

      console.log('Created signed URL successfully');
      return data.signedUrl;
    } catch (error) {
      console.error('Error in getSignedImageUrl:', error);
      return url; // Fallback to original URL
    }
  };

  // Process design image URL
  useEffect(() => {
    const processImageUrl = async () => {
      if (!designImageUrl) {
        console.log('No design image URL provided');
        setImageUrl('');
        setImageLoaded(false);
        setImageError(false);
        return;
      }

      try {
        console.log('Processing design image URL:', designImageUrl);
        const processedUrl = await getSignedImageUrl(designImageUrl);
        setImageUrl(processedUrl);
        console.log('Processed image URL:', processedUrl);
      } catch (error) {
        console.error('Error processing image URL:', error);
        setImageUrl(designImageUrl); // Fallback
      }
    };

    processImageUrl();
  }, [designImageUrl]);

  // Preload design image
  useEffect(() => {
    if (!imageUrl) {
      setImageLoaded(false);
      setImageError(false);
      return;
    }

    console.log('Loading design image:', imageUrl);
    setImageLoaded(false);
    setImageError(false);
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log('✅ Design image loaded successfully:', {
        src: imageUrl,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      });
      setImageLoaded(true);
      setImageError(false);
    };
    
    img.onerror = (error) => {
      console.error('❌ Design image failed to load:', error, imageUrl);
      setImageLoaded(false);
      setImageError(true);
    };
    
    img.src = imageUrl;
  }, [imageUrl]);

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
    
    // Handle different template formats
    if (templateSvgUrl.startsWith('data:')) {
      console.log('✅ Template is data URL, marking as loaded');
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
      x: (typeof newPosition.x === 'number' && !isNaN(newPosition.x)) ? newPosition.x : validDesignArea.x + 10,
      y: (typeof newPosition.y === 'number' && !isNaN(newPosition.y)) ? newPosition.y : validDesignArea.y + 10,
      width: (typeof newPosition.width === 'number' && !isNaN(newPosition.width) && newPosition.width >= 10) ? newPosition.width : 80,
      height: (typeof newPosition.height === 'number' && !isNaN(newPosition.height) && newPosition.height >= 10) ? newPosition.height : 80,
      rotation: (typeof newPosition.rotation === 'number' && !isNaN(newPosition.rotation)) ? newPosition.rotation : 0
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
    if (!imageLoaded) {
      console.log('Image not loaded, ignoring mouse down');
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
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
    console.log('Started dragging');
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
    if (isDragging) {
      console.log('Stopped dragging');
      setIsDragging(false);
    }
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
      x: validDesignArea.x + 10,
      y: validDesignArea.y + 10,
      width: Math.min(80, validDesignArea.width - 20),
      height: Math.min(80, validDesignArea.height - 20),
      rotation: 0
    };
    updatePosition(resetPos);
  };

  // Check if we have valid image URL
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
            <p className="text-sm text-gray-400 mt-2">Uploadez un design pour commencer</p>
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
              
              {/* Fallback template background */}
              {(!templateLoaded || templateError) && (
                <rect
                  x="0"
                  y="0"
                  width="400"
                  height="400"
                  fill="#f8f9fa"
                  stroke="#e9ecef"
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
              {imageLoaded && !imageError && imageUrl && (
                <g
                  transform={`translate(${position.x + position.width/2}, ${position.y + position.height/2}) rotate(${position.rotation}) translate(${-position.width/2}, ${-position.height/2})`}
                >
                  <image
                    href={imageUrl}
                    x="0"
                    y="0"
                    width={position.width}
                    height={position.height}
                    onMouseDown={handleMouseDown}
                    className="cursor-move"
                    preserveAspectRatio="xMidYMid meet"
                    style={{ pointerEvents: 'all' }}
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
                    strokeDasharray="3,3"
                    className="pointer-events-none"
                  />
                  
                  {/* Corner handles for visual feedback */}
                  <circle
                    cx="0"
                    cy="0"
                    r="4"
                    fill="#FF6B35"
                    stroke="white"
                    strokeWidth="1"
                    className="pointer-events-none"
                  />
                  <circle
                    cx={position.width}
                    cy="0"
                    r="4"
                    fill="#FF6B35"
                    stroke="white"
                    strokeWidth="1"
                    className="pointer-events-none"
                  />
                  <circle
                    cx="0"
                    cy={position.height}
                    r="4"
                    fill="#FF6B35"
                    stroke="white"
                    strokeWidth="1"
                    className="pointer-events-none"
                  />
                  <circle
                    cx={position.width}
                    cy={position.height}
                    r="4"
                    fill="#FF6B35"
                    stroke="white"
                    strokeWidth="1"
                    className="pointer-events-none"
                  />
                </g>
              )}
              
              {/* Loading state */}
              {!imageLoaded && !imageError && imageUrl && (
                <g>
                  <rect
                    x={validDesignArea.x}
                    y={validDesignArea.y}
                    width={validDesignArea.width}
                    height={validDesignArea.height}
                    fill="#f8f9fa"
                    stroke="#dee2e6"
                    strokeWidth="1"
                  />
                  <text
                    x={validDesignArea.x + validDesignArea.width/2}
                    y={validDesignArea.y + validDesignArea.height/2}
                    textAnchor="middle"
                    fill="#6c757d"
                    fontSize="14"
                  >
                    Chargement du design...
                  </text>
                </g>
              )}
              
              {/* Error state */}
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
                    y={validDesignArea.y + validDesignArea.height/2 - 10}
                    textAnchor="middle"
                    fill="#ef4444"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    Erreur de chargement
                  </text>
                  <text
                    x={validDesignArea.x + validDesignArea.width/2}
                    y={validDesignArea.y + validDesignArea.height/2 + 10}
                    textAnchor="middle"
                    fill="#ef4444"
                    fontSize="12"
                  >
                    Vérifiez l'URL de l'image
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
                min={validDesignArea.x}
                max={validDesignArea.x + validDesignArea.width - position.width}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Position Y</Label>
              <Input
                type="number"
                value={Math.round(position.y)}
                onChange={(e) => handleInputChange('y', e.target.value)}
                disabled={!imageLoaded}
                min={validDesignArea.y}
                max={validDesignArea.y + validDesignArea.height - position.height}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Largeur</Label>
              <Slider
                value={[position.width]}
                onValueChange={(value) => handleSizeChange('width', value)}
                min={10}
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
                min={10}
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
              <span>Design: {imageLoaded ? 'Chargé' : imageError ? 'Erreur de chargement' : 'Chargement...'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${templateLoaded ? 'bg-green-500' : templateError ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
              <span>Template: {templateLoaded ? 'Chargé' : templateError ? 'Erreur' : 'Chargement...'}</span>
            </div>
            <div className="text-xs text-gray-600">
              Zone d'impression: {validDesignArea.width}×{validDesignArea.height}px (x:{validDesignArea.x}, y:{validDesignArea.y})
            </div>
            {imageUrl && (
              <div className="text-xs text-gray-600 truncate">
                URL: {imageUrl.substring(0, 60)}...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignPositioner;
