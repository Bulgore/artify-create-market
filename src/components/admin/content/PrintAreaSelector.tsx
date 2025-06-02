
import React, { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Move, MousePointer } from 'lucide-react';

interface PrintArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PrintAreaSelectorProps {
  svgUrl: string;
  printArea: PrintArea;
  onPrintAreaChange: (area: PrintArea) => void;
}

const PrintAreaSelector: React.FC<PrintAreaSelectorProps> = ({
  svgUrl,
  printArea,
  onPrintAreaChange
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Vérifier si on clique sur la zone existante pour la déplacer
    if (printArea.width > 0 && printArea.height > 0) {
      const inArea = x >= printArea.x && x <= printArea.x + printArea.width &&
                     y >= printArea.y && y <= printArea.y + printArea.height;
      
      if (inArea) {
        setIsDragging(true);
        setDragOffset({ x: x - printArea.x, y: y - printArea.y });
        return;
      }
    }
    
    // Sinon, commencer un nouveau rectangle
    setIsDrawing(true);
    onPrintAreaChange({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (isDrawing) {
      const width = x - printArea.x;
      const height = y - printArea.y;
      onPrintAreaChange({ ...printArea, width, height });
    } else if (isDragging) {
      const newX = Math.max(0, Math.min(canvasSize.width - printArea.width, x - dragOffset.x));
      const newY = Math.max(0, Math.min(canvasSize.height - printArea.height, y - dragOffset.y));
      onPrintAreaChange({ ...printArea, x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsDragging(false);
    setIsResizing(false);
  };

  const resetArea = () => {
    onPrintAreaChange({ x: 50, y: 50, width: 100, height: 100 });
  };

  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setCanvasSize({ width: rect.width, height: rect.height });
    }
  }, [svgUrl]);

  if (!svgUrl) {
    return (
      <div className="space-y-2">
        <Label>Zone d'impression</Label>
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            <MousePointer className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Uploadez d'abord un fichier SVG pour définir la zone d'impression</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Zone d'impression</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetArea}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="mb-4 text-sm text-gray-600">
            <p className="flex items-center gap-2 mb-1">
              <Move className="h-4 w-4" />
              Cliquez et glissez pour créer une zone de sélection
            </p>
            <p>Cliquez sur une zone existante pour la déplacer</p>
          </div>
          
          <div
            ref={canvasRef}
            className="relative w-full h-96 border border-gray-300 rounded-lg overflow-hidden cursor-crosshair bg-white"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              backgroundImage: `url(${svgUrl})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }}
          >
            {printArea.width > 0 && printArea.height > 0 && (
              <div
                className="absolute border-2 border-red-500 bg-red-200 bg-opacity-30 cursor-move"
                style={{
                  left: printArea.x,
                  top: printArea.y,
                  width: Math.abs(printArea.width),
                  height: Math.abs(printArea.height)
                }}
              >
                <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Zone d'impression
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 grid grid-cols-4 gap-2 text-sm">
            <div>
              <span className="text-gray-600">X:</span> {Math.round(printArea.x)}px
            </div>
            <div>
              <span className="text-gray-600">Y:</span> {Math.round(printArea.y)}px
            </div>
            <div>
              <span className="text-gray-600">W:</span> {Math.round(Math.abs(printArea.width))}px
            </div>
            <div>
              <span className="text-gray-600">H:</span> {Math.round(Math.abs(printArea.height))}px
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrintAreaSelector;
