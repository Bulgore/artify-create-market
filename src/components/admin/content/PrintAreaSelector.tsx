
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { MousePointer, Info, RotateCcw } from 'lucide-react';
import { usePrintArea } from '@/hooks/usePrintArea';
import { SVGDisplay } from '@/components/ui/SVGDisplay';
import { PrintArea } from '@/types/printArea';

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
    mockupImageLoaded,
    forceRedraw
  } = usePrintArea({
    svgUrl,
    mockupUrl,
    printArea,
    onPrintAreaChange,
    mockupPrintArea,
    onMockupPrintAreaChange
  });

  const resetSvgArea = () => {
    console.log('Resetting SVG area');
    onPrintAreaChange({ x: 50, y: 50, width: 200, height: 200 });
  };

  const resetMockupArea = () => {
    console.log('Resetting mockup area');
    if (onMockupPrintAreaChange) {
      onMockupPrintAreaChange({ x: 50, y: 50, width: 200, height: 200 });
    }
  };

  const handleTabChange = (value: string) => {
    console.log('Tab changed to:', value);
    setTimeout(() => {
      if (value === 'svg' && svgImageLoaded) {
        forceRedraw('svg');
      } else if (value === 'mockup' && mockupImageLoaded) {
        forceRedraw('mockup');
      }
    }, 50);
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
        <Tabs defaultValue="svg" className="w-full" onValueChange={handleTabChange}>
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
                  <div className="border border-gray-300 rounded overflow-hidden bg-white relative" style={{ minHeight: '400px', maxHeight: '600px' }}>
                    <div className="w-full h-full relative">
                      <SVGDisplay 
                        svgUrl={svgUrl}
                        className="w-full h-full"
                        onLoad={() => {
                          console.log('SVG template loaded for print area selection');
                          setTimeout(() => forceRedraw('svg'), 100);
                        }}
                        onError={() => console.error('SVG template failed to load')}
                      />
                      
                      {/* Canvas pour l'interaction par-dessus le SVG */}
                      {svgImageLoaded && (
                        <canvas
                          ref={svgCanvasRef}
                          className="absolute top-0 left-0 cursor-move w-full h-full"
                          onMouseDown={(e) => handleCanvasMouseDown(e, 'svg')}
                          onMouseMove={handleCanvasMouseMove}
                          onMouseUp={handleCanvasMouseUp}
                          onMouseLeave={handleCanvasMouseUp}
                          style={{ minHeight: '400px' }}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-96 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500 bg-gray-50">
                    Aucun fichier SVG sélectionné
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
                      value={Math.round(currentSvgArea.x * 100) / 100}
                      onChange={(e) => handleInputChange('x', Number(e.target.value), 'svg')}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="svg-y">Y</Label>
                    <Input
                      id="svg-y"
                      type="number"
                      value={Math.round(currentSvgArea.y * 100) / 100}
                      onChange={(e) => handleInputChange('y', Number(e.target.value), 'svg')}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="svg-width">Largeur</Label>
                    <Input
                      id="svg-width"
                      type="number"
                      value={Math.round(currentSvgArea.width * 100) / 100}
                      onChange={(e) => handleInputChange('width', Number(e.target.value), 'svg')}
                      min="10"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="svg-height">Hauteur</Label>
                    <Input
                      id="svg-height"
                      type="number"
                      value={Math.round(currentSvgArea.height * 100) / 100}
                      onChange={(e) => handleInputChange('height', Number(e.target.value), 'svg')}
                      min="10"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-700 font-medium">Zone d'impression actuelle:</p>
                  <p className="text-xs text-green-600 mt-1">
                    Position: ({Math.round(currentSvgArea.x)}, {Math.round(currentSvgArea.y)}) | 
                    Taille: {Math.round(currentSvgArea.width)}×{Math.round(currentSvgArea.height)}px
                  </p>
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
                  <div className="border border-gray-300 rounded overflow-hidden bg-white">
                    {mockupImageLoaded ? (
                      <canvas
                        ref={mockupCanvasRef}
                        className="cursor-move max-w-full block mx-auto"
                        onMouseDown={(e) => handleCanvasMouseDown(e, 'mockup')}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseLeave={handleCanvasMouseUp}
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
                ) : (
                  <div className="h-96 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500 bg-gray-50">
                    Aucune image mockup sélectionnée
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
                      value={Math.round(currentMockupArea.x * 100) / 100}
                      onChange={(e) => handleInputChange('x', Number(e.target.value), 'mockup')}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mockup-y">Y</Label>
                    <Input
                      id="mockup-y"
                      type="number"
                      value={Math.round(currentMockupArea.y * 100) / 100}
                      onChange={(e) => handleInputChange('y', Number(e.target.value), 'mockup')}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mockup-width">Largeur</Label>
                    <Input
                      id="mockup-width"
                      type="number"
                      value={Math.round(currentMockupArea.width * 100) / 100}
                      onChange={(e) => handleInputChange('width', Number(e.target.value), 'mockup')}
                      min="10"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mockup-height">Hauteur</Label>
                    <Input
                      id="mockup-height"
                      type="number"
                      value={Math.round(currentMockupArea.height * 100) / 100}
                      onChange={(e) => handleInputChange('height', Number(e.target.value), 'mockup')}
                      min="10"
                      step="0.01"
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
