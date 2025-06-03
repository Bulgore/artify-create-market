import React, { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { MousePointer, Square, Info, RotateCcw } from 'lucide-react';

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
          <MousePointer className="h-5 w-5" />
          Configuration des zones d'impression
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded">
          <Info className="h-4 w-4" />
          <span>Les zones SVG et mockup sont indépendantes. Seule la zone SVG sera utilisée pour l'impression.</span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="svg" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="svg">Zone SVG (Impression)</TabsTrigger>
            <TabsTrigger value="mockup">Zone Mockup (Aperçu)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="svg" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label>Fichier SVG - Zone d'impression</Label>
                {svgUrl ? (
                  <canvas
                    ref={svgCanvasRef}
                    className="border border-gray-300 rounded cursor-move max-w-full"
                    onMouseDown={(e) => handleCanvasMouseDown(e, 'svg')}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                  />
                ) : (
                  <div className="h-48 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500">
                    Aucun fichier SVG
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <Label>Coordonnées de la zone d'impression SVG</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="svg-x">X</Label>
                    <Input
                      id="svg-x"
                      type="number"
                      value={currentSvgArea.x}
                      onChange={(e) => handleInputChange('x', Number(e.target.value), 'svg')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="svg-y">Y</Label>
                    <Input
                      id="svg-y"
                      type="number"
                      value={currentSvgArea.y}
                      onChange={(e) => handleInputChange('y', Number(e.target.value), 'svg')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="svg-width">Largeur</Label>
                    <Input
                      id="svg-width"
                      type="number"
                      value={currentSvgArea.width}
                      onChange={(e) => handleInputChange('width', Number(e.target.value), 'svg')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="svg-height">Hauteur</Label>
                    <Input
                      id="svg-height"
                      type="number"
                      value={currentSvgArea.height}
                      onChange={(e) => handleInputChange('height', Number(e.target.value), 'svg')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="mockup" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label>Image Mockup - Zone d'aperçu</Label>
                {mockupUrl ? (
                  <canvas
                    ref={mockupCanvasRef}
                    className="border border-gray-300 rounded cursor-move max-w-full"
                    onMouseDown={(e) => handleCanvasMouseDown(e, 'mockup')}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                  />
                ) : (
                  <div className="h-48 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500">
                    Aucune image mockup
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <Label>Coordonnées de la zone d'aperçu mockup</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mockup-x">X</Label>
                    <Input
                      id="mockup-x"
                      type="number"
                      value={currentMockupArea.x}
                      onChange={(e) => handleInputChange('x', Number(e.target.value), 'mockup')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mockup-y">Y</Label>
                    <Input
                      id="mockup-y"
                      type="number"
                      value={currentMockupArea.y}
                      onChange={(e) => handleInputChange('y', Number(e.target.value), 'mockup')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mockup-width">Largeur</Label>
                    <Input
                      id="mockup-width"
                      type="number"
                      value={currentMockupArea.width}
                      onChange={(e) => handleInputChange('width', Number(e.target.value), 'mockup')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mockup-height">Hauteur</Label>
                    <Input
                      id="mockup-height"
                      type="number"
                      value={currentMockupArea.height}
                      onChange={(e) => handleInputChange('height', Number(e.target.value), 'mockup')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PrintAreaSelector;
