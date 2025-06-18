
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePrintArea } from '@/hooks/usePrintArea';
import { PrintArea } from '@/types/printArea';
import { PrintAreaHeader } from './print-area/PrintAreaHeader';
import { SVGPrintAreaTab } from './print-area/SVGPrintAreaTab';
import { MockupPrintAreaTab } from './print-area/MockupPrintAreaTab';

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

  const handleTabChange = (value: string) => {
    console.log('Tab changed to:', value);
    setTimeout(() => {
      if (value === 'svg' && svgImageLoaded) {
        forceRedraw('svg');
      } else if (value === 'mockup' && mockupImageLoaded) {
        forceRedraw('mockup');
      }
    }, 100);
  };

  return (
    <Card>
      <PrintAreaHeader />
      <CardContent>
        <Tabs defaultValue="svg" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="svg">Zone SVG (Impression)</TabsTrigger>
            <TabsTrigger value="mockup">Zone Mockup (Aperçu)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="svg" className="space-y-4">
            <SVGPrintAreaTab
              svgUrl={svgUrl}
              printArea={currentSvgArea}
              svgImageLoaded={svgImageLoaded}
              svgCanvasRef={svgCanvasRef}
              onPrintAreaChange={onPrintAreaChange}
              onCanvasMouseDown={handleCanvasMouseDown}
              onCanvasMouseMove={handleCanvasMouseMove}
              onCanvasMouseUp={handleCanvasMouseUp}
              onInputChange={handleInputChange}
              forceRedraw={forceRedraw}
            />
          </TabsContent>
          
          <TabsContent value="mockup" className="space-y-4">
            <MockupPrintAreaTab
              mockupUrl={mockupUrl}
              mockupPrintArea={mockupPrintArea}
              mockupImageLoaded={mockupImageLoaded}
              mockupCanvasRef={mockupCanvasRef}
              onMockupPrintAreaChange={onMockupPrintAreaChange}
              onCanvasMouseDown={handleCanvasMouseDown}
              onCanvasMouseMove={handleCanvasMouseMove}
              onCanvasMouseUp={handleCanvasMouseUp}
              onInputChange={handleInputChange}
              forceRedraw={forceRedraw}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PrintAreaSelector;
