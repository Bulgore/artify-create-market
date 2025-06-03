
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Move, Square } from 'lucide-react';

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
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [svgDimensions, setSvgDimensions] = useState({ width: 400, height: 400 });
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent, action: 'drag' | 'resize') => {
    e.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * svgDimensions.width;
    const y = ((e.clientY - rect.top) / rect.height) * svgDimensions.height;

    if (action === 'drag') {
      setIsDragging(true);
      setDragStart({
        x: x - printArea.x,
        y: y - printArea.y
      });
    } else {
      setIsResizing(true);
      setDragStart({ x, y });
    }
  }, [printArea, svgDimensions]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging && !isResizing) return;

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * svgDimensions.width;
    const y = ((e.clientY - rect.top) / rect.height) * svgDimensions.height;

    if (isDragging) {
      const newX = Math.max(0, Math.min(svgDimensions.width - printArea.width, x - dragStart.x));
      const newY = Math.max(0, Math.min(svgDimensions.height - printArea.height, y - dragStart.y));
      
      onPrintAreaChange({
        ...printArea,
        x: newX,
        y: newY
      });
    } else if (isResizing) {
      const newWidth = Math.max(20, Math.min(svgDimensions.width - printArea.x, x - printArea.x));
      const newHeight = Math.max(20, Math.min(svgDimensions.height - printArea.y, y - printArea.y));
      
      onPrintAreaChange({
        ...printArea,
        width: newWidth,
        height: newHeight
      });
    }
  }, [isDragging, isResizing, dragStart, printArea, svgDimensions, onPrintAreaChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const resetArea = () => {
    onPrintAreaChange({
      x: svgDimensions.width * 0.3,
      y: svgDimensions.height * 0.3,
      width: svgDimensions.width * 0.4,
      height: svgDimensions.height * 0.4
    });
  };

  const handleInputChange = (field: keyof PrintArea, value: number) => {
    const constrainedValue = Math.max(0, value);
    let newArea = { ...printArea, [field]: constrainedValue };

    // Constrain position and size within SVG bounds
    if (field === 'x' || field === 'width') {
      newArea.x = Math.max(0, Math.min(svgDimensions.width - newArea.width, newArea.x));
      newArea.width = Math.max(10, Math.min(svgDimensions.width - newArea.x, newArea.width));
    }
    if (field === 'y' || field === 'height') {
      newArea.y = Math.max(0, Math.min(svgDimensions.height - newArea.height, newArea.y));
      newArea.height = Math.max(10, Math.min(svgDimensions.height - newArea.y, newArea.height));
    }

    onPrintAreaChange(newArea);
  };

  useEffect(() => {
    if (svgUrl) {
      // Try to get SVG dimensions from the loaded SVG
      const img = new Image();
      img.onload = () => {
        setSvgDimensions({ width: img.width || 400, height: img.height || 400 });
      };
      img.src = svgUrl;
    }
  }, [svgUrl]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Square className="h-5 w-5" />
          Zone d'impression
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {svgUrl ? (
          <div className="border rounded-lg p-4 bg-gray-50">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
              className="w-full h-64 border rounded cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Background SVG */}
              <image
                href={svgUrl}
                x="0"
                y="0"
                width={svgDimensions.width}
                height={svgDimensions.height}
                opacity="0.3"
              />
              
              {/* Print area rectangle */}
              <rect
                x={printArea.x}
                y={printArea.y}
                width={printArea.width}
                height={printArea.height}
                fill="rgba(51, 195, 240, 0.2)"
                stroke="#33C3F0"
                strokeWidth="2"
                strokeDasharray="5,5"
                onMouseDown={(e) => handleMouseDown(e, 'drag')}
                className="cursor-move"
              />
              
              {/* Resize handle */}
              <circle
                cx={printArea.x + printArea.width}
                cy={printArea.y + printArea.height}
                r="6"
                fill="#33C3F0"
                stroke="white"
                strokeWidth="2"
                onMouseDown={(e) => handleMouseDown(e, 'resize')}
                className="cursor-se-resize"
              />
              
              {/* Zone label */}
              <text
                x={printArea.x + printArea.width / 2}
                y={printArea.y + printArea.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#33C3F0"
                fontSize="12"
                fontWeight="bold"
                pointerEvents="none"
              >
                Zone d'impression
              </text>
            </svg>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Square className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">Uploadez d'abord un fichier SVG pour définir la zone d'impression</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Position X</Label>
            <Input
              type="number"
              value={Math.round(printArea.x)}
              onChange={(e) => handleInputChange('x', parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Position Y</Label>
            <Input
              type="number"
              value={Math.round(printArea.y)}
              onChange={(e) => handleInputChange('y', parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Largeur</Label>
            <Input
              type="number"
              value={Math.round(printArea.width)}
              onChange={(e) => handleInputChange('width', parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Hauteur</Label>
            <Input
              type="number"
              value={Math.round(printArea.height)}
              onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <Button onClick={resetArea} variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          Réinitialiser la zone
        </Button>
      </CardContent>
    </Card>
  );
};

export default PrintAreaSelector;
