
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

    // Set canvas size to match image natural dimensions
    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
    
    if (naturalWidth === 0 || naturalHeight === 0) return;

    canvas.width = naturalWidth;
    canvas.height = naturalHeight;

    // Set canvas display size to maintain aspect ratio
    const containerWidth = canvas.parentElement?.clientWidth || 500;
    const aspectRatio = naturalHeight / naturalWidth;
    const displayHeight = containerWidth * aspectRatio;
    
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    // Draw print area rectangle with proper scaling
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(2, naturalWidth / 200); // Scale line width
    ctx.setLineDash([Math.max(5, naturalWidth / 80), Math.max(3, naturalWidth / 130)]);
    
    // Ensure area dimensions are valid
    const validArea = {
      x: Math.max(0, Math.min(area.x, naturalWidth - 50)),
      y: Math.max(0, Math.min(area.y, naturalHeight - 50)),
      width: Math.max(50, Math.min(area.width, naturalWidth - area.x)),
      height: Math.max(50, Math.min(area.height, naturalHeight - area.y))
    };

    ctx.strokeRect(validArea.x, validArea.y, validArea.width, validArea.height);

    // Draw corner handles with proper scaling
    const handleSize = Math.max(8, naturalWidth / 50);
    ctx.fillStyle = color;
    ctx.setLineDash([]);
    
    // Corner handles positions
    const handles = [
      { x: validArea.x - handleSize/2, y: validArea.y - handleSize/2 }, // Top-left
      { x: validArea.x + validArea.width - handleSize/2, y: validArea.y - handleSize/2 }, // Top-right
      { x: validArea.x - handleSize/2, y: validArea.y + validArea.height - handleSize/2 }, // Bottom-left
      { x: validArea.x + validArea.width - handleSize/2, y: validArea.y + validArea.height - handleSize/2 } // Bottom-right
    ];

    handles.forEach(handle => {
      ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
    });

    // Add semi-transparent fill
    ctx.fillStyle = color + '20';
    ctx.fillRect(validArea.x, validArea.y, validArea.width, validArea.height);

    console.log('Canvas drawn:', {
      canvasSize: { width: canvas.width, height: canvas.height },
      displaySize: { width: containerWidth, height: displayHeight },
      area: validArea,
      imageSize: { width: naturalWidth, height: naturalHeight }
    });
  }, []);

  const forceRedraw = useCallback((viewType: 'svg' | 'mockup') => {
    // Add small delay to ensure DOM is ready
    setTimeout(() => {
      if (viewType === 'svg' && svgCanvasRef.current && svgImageRef.current && svgImageLoaded) {
        console.log('Force redrawing SVG canvas with area:', printArea);
        drawPrintArea(svgCanvasRef.current, svgImageRef.current, printArea, '#ef4444');
      } else if (viewType === 'mockup' && mockupCanvasRef.current && mockupImageRef.current && mockupImageLoaded && mockupPrintArea) {
        console.log('Force redrawing mockup canvas with area:', mockupPrintArea);
        drawPrintArea(mockupCanvasRef.current, mockupImageRef.current, mockupPrintArea, '#3b82f6');
      }
    }, 50);
  }, [drawPrintArea, svgImageRef, mockupImageRef, svgImageLoaded, mockupImageLoaded, printArea, mockupPrintArea]);

  // Draw SVG canvas
  useEffect(() => {
    if (svgCanvasRef.current && svgImageRef.current && svgImageLoaded) {
      console.log('Drawing SVG canvas with area:', printArea);
      // Small delay to ensure image is fully loaded
      setTimeout(() => {
        drawPrintArea(svgCanvasRef.current!, svgImageRef.current!, printArea, '#ef4444');
      }, 10);
    }
  }, [drawPrintArea, svgImageLoaded, printArea]);

  // Draw mockup canvas
  useEffect(() => {
    if (mockupCanvasRef.current && mockupImageRef.current && mockupImageLoaded && mockupPrintArea) {
      console.log('Drawing mockup canvas with area:', mockupPrintArea);
      // Small delay to ensure image is fully loaded
      setTimeout(() => {
        drawPrintArea(mockupCanvasRef.current!, mockupImageRef.current!, mockupPrintArea, '#3b82f6');
      }, 10);
    }
  }, [drawPrintArea, mockupImageLoaded, mockupPrintArea]);

  return {
    svgCanvasRef,
    mockupCanvasRef,
    forceRedraw
  };
};
