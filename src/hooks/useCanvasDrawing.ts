
import { useEffect, useRef } from 'react';
import { PrintArea, ViewType } from '@/types/printArea';

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

  const drawCanvas = (type: ViewType) => {
    console.log(`Drawing canvas for ${type}`);
    const canvas = type === 'svg' ? svgCanvasRef.current : mockupCanvasRef.current;
    const image = type === 'svg' ? svgImageRef.current : mockupImageRef.current;
    const area = type === 'svg' ? printArea : (mockupPrintArea || { x: 50, y: 50, width: 200, height: 200 });
    const imageLoaded = type === 'svg' ? svgImageLoaded : mockupImageLoaded;

    if (!canvas || !image || !imageLoaded) {
      console.log(`Canvas drawing skipped for ${type}:`, { 
        canvas: !!canvas, 
        image: !!image, 
        imageLoaded 
      });
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    try {
      // Set canvas size to fit the container while maintaining aspect ratio
      const maxWidth = 400;
      const maxHeight = 400;
      const scale = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
      
      const newWidth = image.naturalWidth * scale;
      const newHeight = image.naturalHeight * scale;
      
      // Always resize canvas to ensure it's visible
      canvas.width = newWidth;
      canvas.height = newHeight;
      canvas.style.width = `${newWidth}px`;
      canvas.style.height = `${newHeight}px`;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the image
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      
      // Draw the print area overlay
      ctx.strokeStyle = '#33C3F0';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(
        area.x * scale,
        area.y * scale,
        area.width * scale,
        area.height * scale
      );

      // Draw corner handle for resizing
      const handleSize = 8;
      ctx.fillStyle = '#33C3F0';
      ctx.setLineDash([]);
      ctx.fillRect(
        (area.x + area.width) * scale - handleSize / 2,
        (area.y + area.height) * scale - handleSize / 2,
        handleSize,
        handleSize
      );
      
      console.log(`Canvas drawn successfully for ${type}`, {
        imageSize: { width: image.naturalWidth, height: image.naturalHeight },
        canvasSize: { width: canvas.width, height: canvas.height },
        scale,
        area
      });
    } catch (error) {
      console.error(`Error drawing ${type} canvas:`, error);
    }
  };

  // Force redraw function for manual triggering
  const forceRedraw = (type: ViewType) => {
    console.log(`Force redrawing ${type} canvas`);
    setTimeout(() => drawCanvas(type), 100);
  };

  // Redraw canvas when areas change
  useEffect(() => {
    if (svgImageLoaded && svgImageRef.current) {
      console.log('Redrawing SVG canvas due to area change');
      drawCanvas('svg');
    }
  }, [printArea, svgImageLoaded]);

  useEffect(() => {
    if (mockupImageLoaded && mockupImageRef.current) {
      console.log('Redrawing mockup canvas due to area change');
      drawCanvas('mockup');
    }
  }, [mockupPrintArea, mockupImageLoaded]);

  return {
    svgCanvasRef,
    mockupCanvasRef,
    drawCanvas,
    forceRedraw
  };
};
