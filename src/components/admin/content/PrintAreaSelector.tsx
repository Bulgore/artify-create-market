
import React, { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { MousePointer, Square, Info } from 'lucide-react';

interface PrintArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PrintAreaSelectorProps {
  svgUrl: string;
  mockupUrl?: string;
  printArea: PrintArea;
  onPrintAreaChange: (area: PrintArea) => void;
  mockupPrintArea?: PrintArea;
  onMockupPrintAreaChange?: (area: PrintArea) => void;
}

const PrintAreaSelector: React.FC<PrintAreaSelectorProps> = ({
  svgUrl,
  mockupUrl,
  printArea,
  onPrintAreaChange,
  mockupPrintArea,
  onMockupPrintAreaChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeView, setActiveView] = useState<'svg' | 'mockup'>('svg');
  const svgRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, action: 'drag' | 'resize') => {
    e.preventDefault();
    const rect = (activeView === 'svg' ? svgRef.current : mockupRef.current)?.getBoundingClientRect();
    if (!rect) return;

    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    if (action === 'drag') {
      setIsDragging(true);
    } else {
      setIsResizing(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging && !isResizing) return;
    
    const rect = (activeView === 'svg' ? svgRef.current : mockupRef.current)?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging) {
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      
      onPrintAreaChange({
        ...printArea,
        x: Math.max(0, Math.min(rect.width - printArea.width, printArea.x + deltaX)),
        y: Math.max(0, Math.min(rect.height - printArea.height, printArea.y + deltaY))
      });
      
      setDragStart({ x, y });
    } else if (isResizing) {
      const newWidth = Math.max(50, x - printArea.x);
      const newHeight = Math.max(50, y - printArea.y);
      
      onPrintAreaChange({
        ...printArea,
        width: Math.min(newWidth, rect.width - printArea.x),
        height: Math.min(newHeight, rect.height - printArea.y)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const resetArea = () => {
    onPrintAreaChange({ x: 50, y: 50, width: 200, height: 200 });
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Move className="h-5 w-5" />
          Zone d'impression
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={activeView === 'svg' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('svg')}
            disabled={!svgUrl}
          >
            Vue SVG
          </Button>
          <Button
            type="button"
            variant={activeView === 'mockup' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('mockup')}
            disabled={!mockupUrl}
          >
            Vue Mockup
          </Button>
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

        {/* Affichage SVG */}
        {activeView === 'svg' && svgUrl && (
          <div
            ref={svgRef}
            className="relative border-2 border-gray-300 rounded bg-white overflow-hidden"
            style={{ height: '400px' }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <img
              src={svgUrl}
              alt="Template SVG"
              className="w-full h-full object-contain"
              draggable={false}
            />
            
            {/* Zone d'impression draggable */}
            <div
              className="absolute border-2 border-blue-500 bg-blue-200/30 cursor-move"
              style={{
                left: `${printArea.x}px`,
                top: `${printArea.y}px`,
                width: `${printArea.width}px`,
                height: `${printArea.height}px`,
              }}
              onMouseDown={(e) => handleMouseDown(e, 'drag')}
            >
              <div className="absolute inset-0 flex items-center justify-center text-blue-700 text-xs font-medium">
                Zone d'impression
              </div>
              
              {/* Handle de redimensionnement */}
              <div
                className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(e, 'resize');
                }}
              />
            </div>
          </div>
        )}

        {/* Affichage Mockup */}
        {activeView === 'mockup' && mockupUrl && (
          <div
            ref={mockupRef}
            className="relative border-2 border-gray-300 rounded bg-white overflow-hidden"
            style={{ height: '400px' }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <img
              src={mockupUrl}
              alt="Template Mockup"
              className="w-full h-full object-contain"
              draggable={false}
            />
            
            {/* Zone d'impression sur le mockup */}
            <div
              className="absolute border-2 border-green-500 bg-green-200/30 cursor-move"
              style={{
                left: `${printArea.x}px`,
                top: `${printArea.y}px`,
                width: `${printArea.width}px`,
                height: `${printArea.height}px`,
              }}
              onMouseDown={(e) => handleMouseDown(e, 'drag')}
            >
              <div className="absolute inset-0 flex items-center justify-center text-green-700 text-xs font-medium">
                Aperçu zone
              </div>
              
              {/* Handle de redimensionnement */}
              <div
                className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 cursor-se-resize"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(e, 'resize');
                }}
              />
            </div>
          </div>
        )}

        {/* Pas de fichier disponible */}
        {!svgUrl && !mockupUrl && (
          <div className="h-60 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500">
            Uploadez un fichier SVG ou une image mockup pour configurer la zone d'impression
          </div>
        )}

        {/* Contrôles manuels */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="area-x">X</Label>
            <Input
              id="area-x"
              type="number"
              value={printArea.x}
              onChange={(e) => onPrintAreaChange({ ...printArea, x: Number(e.target.value) })}
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="area-y">Y</Label>
            <Input
              id="area-y"
              type="number"
              value={printArea.y}
              onChange={(e) => onPrintAreaChange({ ...printArea, y: Number(e.target.value) })}
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="area-width">Largeur</Label>
            <Input
              id="area-width"
              type="number"
              value={printArea.width}
              onChange={(e) => onPrintAreaChange({ ...printArea, width: Number(e.target.value) })}
              min="50"
            />
          </div>
          <div>
            <Label htmlFor="area-height">Hauteur</Label>
            <Input
              id="area-height"
              type="number"
              value={printArea.height}
              onChange={(e) => onPrintAreaChange({ ...printArea, height: Number(e.target.value) })}
              min="50"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrintAreaSelector;
