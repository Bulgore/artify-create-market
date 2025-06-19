
import { useRef, useEffect, useCallback } from 'react';
import { PrintArea } from '@/types/printArea';

interface UseCanvasDrawingProps {
  svgImageRef: React.RefObject<HTMLImageElement>;
  mockupImageRef: React.RefObject<HTMLImageElement>;
  svgImageLoaded: boolean;
  mockupImageLoaded: boolean;
  printArea: PrintArea;
  mockupPrintArea?: PrintArea;
}

export const useCanvasDrawing = ({
  svgImageRef,
  mockupImageRef,
  svgImageLoaded,
  mockupImageLoaded,
  printArea,
  mockupPrintArea
}: UseCanvasDrawingProps) => {
  const svgCanvasRef = useRef<HTMLCanvasElement>(null);
  const mockupCanvasRef = useRef<HTMLCanvasElement>(null);

  const drawPrintArea = useCallback((
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    area: PrintArea,
    color: string = '#ef4444'
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx || !image) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size to match image
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    // Set canvas display size
    const containerWidth = canvas.parentElement?.clientWidth || 500;
    const aspectRatio = image.naturalHeight / image.naturalWidth;
    const displayHeight = containerWidth * aspectRatio;
    
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    // Draw print area rectangle
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(area.x, area.y, area.width, area.height);

    // Draw corner handles
    const handleSize = 8;
    ctx.fillStyle = color;
    ctx.setLineDash([]);
    
    // Top-left handle
    ctx.fillRect(area.x - handleSize/2, area.y - handleSize/2, handleSize, handleSize);
    
    // Top-right handle
    ctx.fillRect(area.x + area.width - handleSize/2, area.y - handleSize/2, handleSize, handleSize);
    
    // Bottom-left handle
    ctx.fillRect(area.x - handleSize/2, area.y + area.height - handleSize/2, handleSize, handleSize);
    
    // Bottom-right handle (resize handle)
    ctx.fillRect(area.x + area.width - handleSize/2, area.y + area.height - handleSize/2, handleSize, handleSize);

    // Add semi-transparent fill
    ctx.fillStyle = color + '20';
    ctx.fillRect(area.x, area.y, area.width, area.height);
  }, []);

  const forceRedraw = useCallback((viewType: 'svg' | 'mockup') => {
    if (viewType === 'svg' && svgCanvasRef.current && svgImageRef.current && svgImageLoaded) {
      console.log('Force redrawing SVG canvas with area:', printArea);
      drawPrintArea(svgCanvasRef.current, svgImageRef.current, printArea, '#ef4444');
    } else if (viewType === 'mockup' && mockupCanvasRef.current && mockupImageRef.current && mockupImageLoaded && mockupPrintArea) {
      console.log('Force redrawing mockup canvas with area:', mockupPrintArea);
      drawPrintArea(mockupCanvasRef.current, mockupImageRef.current, mockupPrintArea, '#3b82f6');
    }
  }, [drawPrintArea, svgImageRef, mockupImageRef, svgImageLoaded, mockupImageLoaded, printArea, mockupPrintArea]);

  // Draw SVG canvas
  useEffect(() => {
    if (svgCanvasRef.current && svgImageRef.current && svgImageLoaded) {
      console.log('Drawing SVG canvas with area:', printArea);
      drawPrintArea(svgCanvasRef.current, svgImageRef.current, printArea, '#ef4444');
    }
  }, [drawPrintArea, svgImageLoaded, printArea]);

  // Draw mockup canvas
  useEffect(() => {
    if (mockupCanvasRef.current && mockupImageRef.current && mockupImageLoaded && mockupPrintArea) {
      console.log('Drawing mockup canvas with area:', mockupPrintArea);
      drawPrintArea(mockupCanvasRef.current, mockupImageRef.current, mockupPrintArea, '#3b82f6');
    }
  }, [drawPrintArea, mockupImageLoaded, mockupPrintArea]);

  return {
    svgCanvasRef,
    mockupCanvasRef,
    forceRedraw
  };
};
