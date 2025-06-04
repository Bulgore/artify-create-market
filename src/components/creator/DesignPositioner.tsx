
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Move } from 'lucide-react';
import { ImageLoader } from './design-positioner/ImageLoader';
import { DesignCanvas } from './design-positioner/DesignCanvas';
import { PositionControls } from './design-positioner/PositionControls';
import { StatusInfo } from './design-positioner/StatusInfo';

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
  const svgRef = useRef<SVGSVGElement>(null);

  // Template loading
  useEffect(() => {
    if (!templateSvgUrl) {
      setTemplateLoaded(false);
      setTemplateError(false);
      return;
    }

    console.log('Loading template:', templateSvgUrl);
    setTemplateLoaded(false);
    setTemplateError(false);
    
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
    if (!imageLoaded) return;
    
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
    updatePosition({
      ...position,
      [dimension]: value[0]
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
      {/* Image loaders */}
      <ImageLoader 
        imageUrl={designImageUrl} 
        onLoad={setImageLoaded} 
        onError={setImageError} 
      />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Move className="h-5 w-5" />
            Positionnement du design
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={svgRef}>
            <DesignCanvas
              templateUrl={templateSvgUrl}
              designUrl={designImageUrl}
              designArea={validDesignArea}
              position={position}
              imageLoaded={imageLoaded}
              templateLoaded={templateLoaded}
              imageError={imageError}
              templateError={templateError}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />
          </div>
          
          <PositionControls
            position={position}
            designArea={validDesignArea}
            imageLoaded={imageLoaded}
            onInputChange={handleInputChange}
            onSizeChange={handleSizeChange}
            onRotationChange={handleRotationChange}
            onReset={resetPosition}
          />
          
          <StatusInfo
            imageLoaded={imageLoaded}
            imageError={imageError}
            templateLoaded={templateLoaded}
            templateError={templateError}
            designArea={validDesignArea}
            imageUrl={designImageUrl}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignPositioner;
