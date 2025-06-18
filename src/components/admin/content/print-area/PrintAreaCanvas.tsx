
import React from 'react';
import { SVGDisplay } from '@/components/ui/SVGDisplay';

interface PrintAreaCanvasProps {
  url: string;
  type: 'svg' | 'mockup';
  imageLoaded: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onLoad: () => void;
  onError: () => void;
  onCanvasMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseUp: () => void;
  forceRedraw: (viewType: 'svg' | 'mockup') => void;
}

export const PrintAreaCanvas: React.FC<PrintAreaCanvasProps> = ({
  url,
  type,
  imageLoaded,
  canvasRef,
  onLoad,
  onError,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
  forceRedraw
}) => {
  if (!url) {
    const placeholderText = type === 'svg' 
      ? 'Aucun fichier SVG sélectionné'
      : 'Aucune image mockup sélectionnée';
    
    return (
      <div className="h-96 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500 bg-gray-50">
        {placeholderText}
      </div>
    );
  }

  if (type === 'svg') {
    return (
      <div className="border border-gray-300 rounded overflow-hidden bg-white relative">
        <div className="w-full relative" style={{ minHeight: '400px', maxHeight: '600px' }}>
          <SVGDisplay 
            svgUrl={url}
            className="w-full h-full block"
            onLoad={() => {
              console.log('SVG template loaded for print area selection');
              setTimeout(() => forceRedraw('svg'), 150);
              onLoad();
            }}
            onError={onError}
          />
          
          {imageLoaded && (
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 cursor-move w-full h-full"
              onMouseDown={onCanvasMouseDown}
              onMouseMove={onCanvasMouseMove}
              onMouseUp={onCanvasMouseUp}
              onMouseLeave={onCanvasMouseUp}
              style={{ 
                minHeight: '400px',
                pointerEvents: 'auto'
              }}
            />
          )}
        </div>
      </div>
    );
  }

  // Mockup canvas
  return (
    <div className="border border-gray-300 rounded overflow-hidden bg-white">
      {imageLoaded ? (
        <canvas
          ref={canvasRef}
          className="cursor-move max-w-full block mx-auto"
          onMouseDown={onCanvasMouseDown}
          onMouseMove={onCanvasMouseMove}
          onMouseUp={onCanvasMouseUp}
          onMouseLeave={onCanvasMouseUp}
          style={{ maxHeight: '500px' }}
        />
      ) : (
        <div className="h-96 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p>Chargement de l'image mockup...</p>
          </div>
        </div>
      )}
    </div>
  );
};
