
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
    const canvas = type === 'svg' ? svgCanvasRef.current : mockupCanvasRef.current;
    const image = type === 'svg' ? svgImageRef.current : mockupImageRef.current;
    const area = type === 'svg' ? printArea : (mockupPrintArea || { x: 50, y: 50, width: 200, height: 200 });

    if (!canvas || !image) {
      console.log(`Canvas or image not ready for ${type}`);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size to fit the container while maintaining aspect ratio
    const maxWidth = 400;
    const maxHeight = 400;
    const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
    
    const newWidth = image.width * scale;
    const newHeight = image.height * scale;
    
    // Only resize if necessary to avoid constant redraws
    if (canvas.width !== newWidth || canvas.height !== newHeight) {
      canvas.width = newWidth;
      canvas.height = newHeight;
    }

    // Draw the image
    try {
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
      
      console.log(`Canvas drawn successfully for ${type}`);
    } catch (error) {
      console.error(`Error drawing ${type} canvas:`, error);
    }
  };

  // Redraw canvas when areas change
  useEffect(() => {
    if (svgImageLoaded && svgImageRef.current) {
      drawCanvas('svg');
    }
  }, [printArea, svgImageLoaded]);

  useEffect(() => {
    if (mockupImageLoaded && mockupImageRef.current) {
      drawCanvas('mockup');
    }
  }, [mockupPrintArea, mockupImageLoaded]);

  return {
    svgCanvasRef,
    mockupCanvasRef,
    drawCanvas
  };
};
