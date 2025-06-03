
import { useState, useRef, useEffect } from 'react';

interface PrintArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UsePrintAreaProps {
  svgUrl: string;
  mockupUrl?: string;
  printArea: PrintArea;
  onPrintAreaChange: (area: PrintArea) => void;
  mockupPrintArea?: PrintArea;
  onMockupPrintAreaChange?: (area: PrintArea) => void;
}

export const usePrintArea = ({
  svgUrl,
  mockupUrl,
  printArea,
  onPrintAreaChange,
  mockupPrintArea,
  onMockupPrintAreaChange
}: UsePrintAreaProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeView, setActiveView] = useState<'svg' | 'mockup'>('svg');
  const [svgImageLoaded, setSvgImageLoaded] = useState(false);
  const [mockupImageLoaded, setMockupImageLoaded] = useState(false);

  const svgCanvasRef = useRef<HTMLCanvasElement>(null);
  const mockupCanvasRef = useRef<HTMLCanvasElement>(null);
  const svgImageRef = useRef<HTMLImageElement>(null);
  const mockupImageRef = useRef<HTMLImageElement>(null);

  const currentSvgArea = printArea;
  const currentMockupArea = mockupPrintArea || { x: 50, y: 50, width: 200, height: 200 };

  // Load SVG image
  useEffect(() => {
    if (svgUrl) {
      console.log('Loading SVG image:', svgUrl);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        console.log('SVG image loaded successfully');
        svgImageRef.current = img;
        setSvgImageLoaded(true);
      };
      img.onerror = (error) => {
        console.error('Error loading SVG image:', error);
        setSvgImageLoaded(false);
      };
      img.src = svgUrl;
    } else {
      setSvgImageLoaded(false);
    }
  }, [svgUrl]);

  // Load mockup image
  useEffect(() => {
    if (mockupUrl) {
      console.log('Loading mockup image:', mockupUrl);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        console.log('Mockup image loaded successfully');
        mockupImageRef.current = img;
        setMockupImageLoaded(true);
      };
      img.onerror = (error) => {
        console.error('Error loading mockup image:', error);
        setMockupImageLoaded(false);
      };
      img.src = mockupUrl;
    } else {
      setMockupImageLoaded(false);
    }
  }, [mockupUrl]);

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

  const drawCanvas = (type: 'svg' | 'mockup') => {
    const canvas = type === 'svg' ? svgCanvasRef.current : mockupCanvasRef.current;
    const image = type === 'svg' ? svgImageRef.current : mockupImageRef.current;
    const area = type === 'svg' ? currentSvgArea : currentMockupArea;

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

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>, type: 'svg' | 'mockup') => {
    const canvas = type === 'svg' ? svgCanvasRef.current : mockupCanvasRef.current;
    const image = type === 'svg' ? svgImageRef.current : mockupImageRef.current;
    
    if (!canvas || !image) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / image.width;
    
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    return { x, y };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>, type: 'svg' | 'mockup') => {
    e.preventDefault();
    setActiveView(type);
    
    const { x, y } = getCanvasCoordinates(e, type);
    setDragStart({ x, y });

    const area = type === 'svg' ? currentSvgArea : currentMockupArea;
    const image = type === 'svg' ? svgImageRef.current : mockupImageRef.current;
    
    if (!image) return;
    
    // Check if clicking on resize handle
    const handleSize = 8 / (svgCanvasRef.current?.width || 1) * (image.width || 1);
    const isOnHandle = 
      x >= area.x + area.width - handleSize &&
      x <= area.x + area.width + handleSize &&
      y >= area.y + area.height - handleSize &&
      y <= area.y + area.height + handleSize;

    if (isOnHandle) {
      setIsResizing(true);
    } else if (
      x >= area.x && x <= area.x + area.width &&
      y >= area.y && y <= area.y + area.height
    ) {
      setIsDragging(true);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging && !isResizing) return;

    const { x, y } = getCanvasCoordinates(e, activeView);
    const image = activeView === 'svg' ? svgImageRef.current : mockupImageRef.current;
    
    if (!image) return;

    if (isDragging) {
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      
      const currentArea = activeView === 'svg' ? currentSvgArea : currentMockupArea;
      const newArea = {
        ...currentArea,
        x: Math.max(0, Math.min(image.width - currentArea.width, currentArea.x + deltaX)),
        y: Math.max(0, Math.min(image.height - currentArea.height, currentArea.y + deltaY))
      };

      if (activeView === 'svg') {
        onPrintAreaChange(newArea);
      } else if (onMockupPrintAreaChange) {
        onMockupPrintAreaChange(newArea);
      }
      
      setDragStart({ x, y });
    } else if (isResizing) {
      const currentArea = activeView === 'svg' ? currentSvgArea : currentMockupArea;
      const newWidth = Math.max(50, x - currentArea.x);
      const newHeight = Math.max(50, y - currentArea.y);
      
      const newArea = {
        ...currentArea,
        width: Math.min(newWidth, image.width - currentArea.x),
        height: Math.min(newHeight, image.height - currentArea.y)
      };

      if (activeView === 'svg') {
        onPrintAreaChange(newArea);
      } else if (onMockupPrintAreaChange) {
        onMockupPrintAreaChange(newArea);
      }
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleInputChange = (field: keyof PrintArea, value: number, type: 'svg' | 'mockup') => {
    const currentArea = type === 'svg' ? currentSvgArea : currentMockupArea;
    const newArea = { ...currentArea, [field]: Math.max(0, value) };

    if (type === 'svg') {
      onPrintAreaChange(newArea);
    } else if (onMockupPrintAreaChange) {
      onMockupPrintAreaChange(newArea);
    }
  };

  // Global mouse up handler
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return {
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
  };
};
