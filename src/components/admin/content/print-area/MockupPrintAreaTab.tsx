
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { PrintArea } from '@/types/printArea';
import { PrintAreaCanvas } from './PrintAreaCanvas';
import { PrintAreaInputs } from './PrintAreaInputs';

interface MockupPrintAreaTabProps {
  mockupUrl?: string;
  mockupPrintArea?: PrintArea;
  mockupImageLoaded: boolean;
  mockupCanvasRef: React.RefObject<HTMLCanvasElement>;
  onMockupPrintAreaChange?: (area: PrintArea) => void;
  onCanvasMouseDown: (e: React.MouseEvent<HTMLCanvasElement>, type: 'svg' | 'mockup') => void;
  onCanvasMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseUp: () => void;
  onInputChange: (field: keyof PrintArea, value: number, type: 'svg' | 'mockup') => void;
  forceRedraw: (viewType: 'svg' | 'mockup') => void;
}

export const MockupPrintAreaTab: React.FC<MockupPrintAreaTabProps> = ({
  mockupUrl,
  mockupPrintArea,
  mockupImageLoaded,
  mockupCanvasRef,
  onMockupPrintAreaChange,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
  onInputChange,
  forceRedraw
}) => {
  const currentMockupArea = mockupPrintArea || { x: 50, y: 50, width: 200, height: 200 };

  const resetMockupArea = () => {
    console.log('Resetting mockup area');
    if (onMockupPrintAreaChange) {
      onMockupPrintAreaChange({ x: 50, y: 50, width: 200, height: 200 });
    }
  };

  if (!mockupUrl) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Aucune image mockup configurée</p>
        <p className="text-sm text-gray-400">Ajoutez une URL d'image mockup dans les paramètres du gabarit</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Image Mockup - Zone d'aperçu</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={resetMockupArea}
            className="flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        </div>
        <PrintAreaCanvas
          url={mockupUrl}
          type="mockup"
          imageLoaded={mockupImageLoaded}
          canvasRef={mockupCanvasRef}
          onLoad={() => {}}
          onError={() => console.error('Mockup image failed to load')}
          onCanvasMouseDown={(e) => onCanvasMouseDown(e, 'mockup')}
          onCanvasMouseMove={onCanvasMouseMove}
          onCanvasMouseUp={onCanvasMouseUp}
          forceRedraw={forceRedraw}
        />
      </div>
      
      <PrintAreaInputs
        area={currentMockupArea}
        type="mockup"
        onInputChange={onInputChange}
      />
    </div>
  );
};
