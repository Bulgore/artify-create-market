
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { PrintArea } from '@/types/printArea';
import { PrintAreaCanvas } from './PrintAreaCanvas';
import { PrintAreaInputs } from './PrintAreaInputs';

interface SVGPrintAreaTabProps {
  svgUrl: string;
  printArea: PrintArea;
  svgImageLoaded: boolean;
  svgCanvasRef: React.RefObject<HTMLCanvasElement>;
  onPrintAreaChange: (area: PrintArea) => void;
  onCanvasMouseDown: (e: React.MouseEvent<HTMLCanvasElement>, type: 'svg' | 'mockup') => void;
  onCanvasMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseUp: () => void;
  onInputChange: (field: keyof PrintArea, value: number, type: 'svg' | 'mockup') => void;
  forceRedraw: (viewType: 'svg' | 'mockup') => void;
}

export const SVGPrintAreaTab: React.FC<SVGPrintAreaTabProps> = ({
  svgUrl,
  printArea,
  svgImageLoaded,
  svgCanvasRef,
  onPrintAreaChange,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
  onInputChange,
  forceRedraw
}) => {
  const resetSvgArea = () => {
    console.log('Resetting SVG area');
    onPrintAreaChange({ x: 50, y: 50, width: 200, height: 200 });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Fichier SVG - Zone d'impression</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={resetSvgArea}
            className="flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        </div>
        <PrintAreaCanvas
          url={svgUrl}
          type="svg"
          imageLoaded={svgImageLoaded}
          canvasRef={svgCanvasRef}
          onLoad={() => {}}
          onError={() => console.error('SVG template failed to load')}
          onCanvasMouseDown={(e) => onCanvasMouseDown(e, 'svg')}
          onCanvasMouseMove={onCanvasMouseMove}
          onCanvasMouseUp={onCanvasMouseUp}
          forceRedraw={forceRedraw}
        />
      </div>
      
      <PrintAreaInputs
        area={printArea}
        type="svg"
        onInputChange={onInputChange}
      />
    </div>
  );
};
