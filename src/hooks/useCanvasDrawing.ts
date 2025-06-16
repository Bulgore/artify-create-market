
import { useRef, useEffect, useCallback } from 'react';
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

  // Fonction pour dessiner la zone d'impression
  const drawPrintArea = useCallback((
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    area: PrintArea
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurer le canvas aux dimensions de l'image
    canvas.width = image.width;
    canvas.height = image.height;
    
    // Nettoyer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner la zone d'impression
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(area.x, area.y, area.width, area.height);
    
    // Dessiner un overlay semi-transparent en dehors de la zone
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Découper la zone d'impression (rendre transparente)
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(area.x, area.y, area.width, area.height);
    
    // Restaurer le mode de composition
    ctx.globalCompositeOperation = 'source-over';
    
    // Redessiner le contour de la zone
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.strokeRect(area.x, area.y, area.width, area.height);
    
    // Dessiner la poignée de redimensionnement
    const handleSize = 8;
    const handleX = area.x + area.width - handleSize / 2;
    const handleY = area.y + area.height - handleSize / 2;
    
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(handleX, handleY, handleSize, handleSize);
    
    // Contour blanc pour la poignée
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(handleX, handleY, handleSize, handleSize);
  }, []);

  // Fonction pour forcer le redessin
  const forceRedraw = useCallback((type: ViewType) => {
    if (type === 'svg' && svgCanvasRef.current && svgImageRef.current && svgImageLoaded) {
      drawPrintArea(svgCanvasRef.current, svgImageRef.current, printArea);
    } else if (type === 'mockup' && mockupCanvasRef.current && mockupImageRef.current && mockupImageLoaded && mockupPrintArea) {
      drawPrintArea(mockupCanvasRef.current, mockupImageRef.current, mockupPrintArea);
    }
  }, [drawPrintArea, svgImageLoaded, mockupImageLoaded, printArea, mockupPrintArea]);

  // Effet pour redessiner la zone SVG
  useEffect(() => {
    if (svgCanvasRef.current && svgImageRef.current && svgImageLoaded) {
      const timeoutId = setTimeout(() => {
        forceRedraw('svg');
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [svgImageLoaded, printArea, forceRedraw]);

  // Effet pour redessiner la zone mockup
  useEffect(() => {
    if (mockupCanvasRef.current && mockupImageRef.current && mockupImageLoaded && mockupPrintArea) {
      const timeoutId = setTimeout(() => {
        forceRedraw('mockup');
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [mockupImageLoaded, mockupPrintArea, forceRedraw]);

  return {
    svgCanvasRef,
    mockupCanvasRef,
    forceRedraw
  };
};
