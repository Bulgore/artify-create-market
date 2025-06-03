
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { MousePointer, Info, RotateCcw } from 'lucide-react';
import { usePrintArea } from '@/hooks/usePrintArea';

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
  const {
    svgCanvasRef,
    mockupCanvasRef,
    currentSvgArea,
    currentMockupArea,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleInputChange,
    svgImageLoaded,
    mockupImageLoaded
  } = usePrintArea({
    svgUrl,
    mockupUrl,
    printArea,
    onPrintAreaChange,
    mockupPrintArea,
    onMockupPrintAreaChange
  });

  const resetSvgArea = () => {
    onPrintAreaChange({ x: 50, y: 50, width: 200, height: 200 });
  };

  const resetMockupArea = () => {
    if (onMockupPrintAreaChange) {
      onMockupPrintAreaChange({ x: 50, y: 50, width: 200, height: 200 });
    }
  };

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
                {svgUrl ? (
                  <div className="border border-gray-300 rounded overflow-hidden">
                    <canvas
                      ref={svgCanvasRef}
                      className="cursor-move max-w-full block"
                      onMouseDown={(e) => handleCanvasMouseDown(e, 'svg')}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                      onMouseLeave={handleCanvasMouseUp}
                    />
                  </div>
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
                {mockupUrl ? (
                  <div className="border border-gray-300 rounded overflow-hidden">
                    <canvas
                      ref={mockupCanvasRef}
                      className="cursor-move max-w-full block"
                      onMouseDown={(e) => handleCanvasMouseDown(e, 'mockup')}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                      onMouseLeave={handleCanvasMouseUp}
                    />
                  </div>
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
