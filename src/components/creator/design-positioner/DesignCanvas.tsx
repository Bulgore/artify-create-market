
import React, { forwardRef } from 'react';
import { CanvasHeader } from './CanvasHeader';
import { OutOfBoundsAlert } from './OutOfBoundsAlert';
import { CanvasContainer } from './CanvasContainer';
import { CanvasContent } from './CanvasContent';
import { CanvasOverlays } from './CanvasOverlays';
import { DesignElement } from './DesignElement';
import { CanvasStates } from './CanvasStates';

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

interface DesignCanvasProps {
  templateUrl: string;
  designUrl: string;
  designArea: DesignArea;
  position: DesignPosition;
  imageLoaded: boolean;
  templateLoaded: boolean;
  imageError: boolean;
  templateError: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
}

export const DesignCanvas = forwardRef<SVGSVGElement, DesignCanvasProps>(({
  templateUrl,
  designUrl,
  designArea,
  position,
  imageLoaded,
  templateLoaded,
  imageError,
  templateError,
  onMouseDown,
  onMouseMove,
  onMouseUp
}, ref) => {
  console.log('🎨 DesignCanvas render:', {
    designUrl: designUrl?.substring(0, 50) + '...',
    imageLoaded,
    imageError,
    templateLoaded,
    templateError,
    designArea,
    position
  });

  // Vérifier si le design dépasse de la zone d'impression
  const isDesignOutOfBounds = designUrl && imageLoaded && (
    position.x < designArea.x ||
    position.y < designArea.y ||
    position.x + position.width > designArea.x + designArea.width ||
    position.y + position.height > designArea.y + designArea.height
  );

  return (
    <div className="space-y-4">
      <CanvasHeader />
      
      <OutOfBoundsAlert isOutOfBounds={isDesignOutOfBounds} />

      <CanvasContainer
        templateLoaded={templateLoaded}
        imageLoaded={imageLoaded}
        imageError={imageError}
        designUrl={designUrl}
        isDesignOutOfBounds={isDesignOutOfBounds}
      >
        <svg
          ref={ref}
          viewBox="0 0 400 400"
          className="w-full max-w-lg mx-auto border-2 border-gray-200 rounded-lg cursor-crosshair bg-gray-50"
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ height: '500px' }}
        >
          <CanvasContent
            templateUrl={templateUrl}
            templateLoaded={templateLoaded}
            templateError={templateError}
          />
          
          <CanvasOverlays
            designArea={designArea}
            isDesignOutOfBounds={isDesignOutOfBounds}
          />
          
          {/* Design de l'utilisateur avec interaction améliorée */}
          {imageLoaded && !imageError && designUrl && (
            <DesignElement
              designUrl={designUrl}
              position={position}
              isOutOfBounds={isDesignOutOfBounds}
              onMouseDown={onMouseDown}
            />
          )}
          
          <CanvasStates
            designArea={designArea}
            designUrl={designUrl}
            imageLoaded={imageLoaded}
            imageError={imageError}
          />
        </svg>
      </CanvasContainer>
    </div>
  );
});

DesignCanvas.displayName = 'DesignCanvas';
