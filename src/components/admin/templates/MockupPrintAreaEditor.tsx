
import React, { useRef, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProductMockups } from '@/hooks/useProductMockups';
import { Save, RotateCcw } from 'lucide-react';
import { buildImageUrl } from '@/utils/imageUrl';

interface MockupPrintAreaEditorProps {
  mockup: {
    id: string;
    mockup_url: string;
    mockup_name: string;
    print_area: any;
    has_print_area: boolean;
  };
  onClose: () => void;
}

export const MockupPrintAreaEditor: React.FC<MockupPrintAreaEditorProps> = ({
  mockup,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { updatePrintArea } = useProductMockups();
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [printArea, setPrintArea] = useState(
    mockup.print_area || { x: 50, y: 50, width: 200, height: 200 }
  );

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      imageRef.current = image;
      drawCanvas();
    };
    image.src = buildImageUrl(mockup.mockup_url);
  }, [mockup.mockup_url]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = 600;
    canvas.height = (600 * image.height) / image.width;

    // Draw image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Draw print area rectangle
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    const scaleX = canvas.width / image.width;
    const scaleY = canvas.height / image.height;
    
    ctx.strokeRect(
      printArea.x * scaleX,
      printArea.y * scaleY,
      printArea.width * scaleX,
      printArea.height * scaleY
    );

    // Draw corner handles
    ctx.fillStyle = '#3B82F6';
    ctx.setLineDash([]);
    const handleSize = 8;
    
    const corners = [
      { x: printArea.x * scaleX, y: printArea.y * scaleY },
      { x: (printArea.x + printArea.width) * scaleX, y: printArea.y * scaleY },
      { x: printArea.x * scaleX, y: (printArea.y + printArea.height) * scaleY },
      { x: (printArea.x + printArea.width) * scaleX, y: (printArea.y + printArea.height) * scaleY }
    ];
    
    corners.forEach(corner => {
      ctx.fillRect(corner.x - handleSize/2, corner.y - handleSize/2, handleSize, handleSize);
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPoint({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const scaleX = image.width / canvas.width;
    const scaleY = image.height / canvas.height;

    const newPrintArea = {
      x: Math.min(startPoint.x, currentX) * scaleX,
      y: Math.min(startPoint.y, currentY) * scaleY,
      width: Math.abs(currentX - startPoint.x) * scaleX,
      height: Math.abs(currentY - startPoint.y) * scaleY
    };

    setPrintArea(newPrintArea);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    drawCanvas();
  };

  const resetPrintArea = () => {
    setPrintArea({ x: 50, y: 50, width: 200, height: 200 });
  };

  const savePrintArea = async () => {
    await updatePrintArea(mockup.id, printArea);
    onClose();
  };

  useEffect(() => {
    drawCanvas();
  }, [printArea]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Zone d'impression - {mockup.mockup_name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="border rounded-lg p-4 bg-gray-50">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="w-full cursor-crosshair border rounded"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              <p className="text-sm text-gray-600 mt-2">
                Cliquez et glissez pour définir la zone d'impression
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="print-x">Position X</Label>
                <Input
                  id="print-x"
                  type="number"
                  value={Math.round(printArea.x)}
                  onChange={(e) => setPrintArea({...printArea, x: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="print-y">Position Y</Label>
                <Input
                  id="print-y"
                  type="number"
                  value={Math.round(printArea.y)}
                  onChange={(e) => setPrintArea({...printArea, y: Number(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="print-width">Largeur</Label>
                <Input
                  id="print-width"
                  type="number"
                  value={Math.round(printArea.width)}
                  onChange={(e) => setPrintArea({...printArea, width: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="print-height">Hauteur</Label>
                <Input
                  id="print-height"
                  type="number"
                  value={Math.round(printArea.height)}
                  onChange={(e) => setPrintArea({...printArea, height: Number(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2 pt-4">
              <Button
                variant="outline"
                onClick={resetPrintArea}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              
              <Button
                onClick={savePrintArea}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
