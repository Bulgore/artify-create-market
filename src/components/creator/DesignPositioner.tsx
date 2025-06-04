
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Move } from 'lucide-react';
import { ImageLoader } from './design-positioner/ImageLoader';
import { DesignCanvas } from './design-positioner/DesignCanvas';
import { PositionControls } from './design-positioner/PositionControls';
import { StatusInfo } from './design-positioner/StatusInfo';
import { useDesignPositioner } from '@/hooks/useDesignPositioner';
import { useTemplateLoader } from '@/hooks/useTemplateLoader';
import { useDesignInteractions } from '@/hooks/useDesignInteractions';

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
  console.log('🎯 DesignPositioner received props:', {
    templateSvgUrl: templateSvgUrl?.substring(0, 50) + '...',
    designImageUrl: designImageUrl?.substring(0, 50) + '...',
    designArea,
    initialPosition
  });

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    position,
    validDesignArea,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    containerRef,
    svgRef,
    updatePosition,
    resetPosition
  } = useDesignPositioner({
    designArea,
    initialPosition,
    onPositionChange
  });

  const { templateLoaded, templateError } = useTemplateLoader({
    templateSvgUrl
  });

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleSizeChange,
    handleRotationChange,
    handleInputChange
  } = useDesignInteractions({
    position,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    svgRef,
    updatePosition,
    imageLoaded
  });

  const handleImageLoad = (loaded: boolean) => {
    console.log('📸 Image load status changed:', loaded);
    setImageLoaded(loaded);
  };

  const handleImageError = (error: boolean) => {
    console.log('❌ Image error status changed:', error);
    setImageError(error);
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
      {/* Image loader - toujours actif si on a une URL */}
      <ImageLoader 
        imageUrl={designImageUrl} 
        onLoad={handleImageLoad} 
        onError={handleImageError} 
      />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Move className="h-5 w-5" />
            Positionnement du design
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={containerRef}>
            <DesignCanvas
              ref={svgRef}
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
