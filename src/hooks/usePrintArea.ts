
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
      const img = new Image();
      img.onload = () => {
        svgImageRef.current = img;
        setSvgImageLoaded(true);
        drawCanvas('svg');
      };
      img.src = svgUrl;
    }
  }, [svgUrl]);

  // Load mockup image
  useEffect(() => {
    if (mockupUrl) {
      const img = new Image();
      img.onload = () => {
        mockupImageRef.current = img;
        setMockupImageLoaded(true);
        drawCanvas('mockup');
      };
      img.src = mockupUrl;
    }
  }, [mockupUrl]);

  // Redraw canvas when areas change
  useEffect(() => {
    if (svgImageLoaded) drawCanvas('svg');
  }, [printArea, svgImageLoaded]);

  useEffect(() => {
    if (mockupImageLoaded) drawCanvas('mockup');
  }, [mockupPrintArea, mockupImageLoaded]);

  const drawCanvas = (type: 'svg' | 'mockup') => {
    const canvas = type === 'svg' ? svgCanvasRef.current : mockupCanvasRef.current;
    const image = type === 'svg' ? svgImageRef.current : mockupImageRef.current;
    const area = type === 'svg' ? currentSvgArea : currentMockupArea;

    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to fit the container while maintaining aspect ratio
    const maxWidth = 400;
    const maxHeight = 400;
    const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
    
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;

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

    // Draw corner handles for resizing
    const handleSize = 8;
    ctx.fillStyle = '#33C3F0';
    ctx.setLineDash([]);
    ctx.fillRect(
      (area.x + area.width) * scale - handleSize / 2,
      (area.y + area.height) * scale - handleSize / 2,
      handleSize,
      handleSize
    );
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>, type: 'svg' | 'mockup') => {
    e.preventDefault();
    setActiveView(type);
    
    const canvas = type === 'svg' ? svgCanvasRef.current : mockupCanvasRef.current;
    const image = type === 'svg' ? svgImageRef.current : mockupImageRef.current;
    
    if (!canvas || !image) return;

    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / image.width;
    
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    setDragStart({ x, y });

    const area = type === 'svg' ? currentSvgArea : currentMockupArea;
    
    // Check if clicking on resize handle
    const handleSize = 8 / scale;
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

    const canvas = activeView === 'svg' ? svgCanvasRef.current : mockupCanvasRef.current;
    const image = activeView === 'svg' ? svgImageRef.current : mockupImageRef.current;
    
    if (!canvas || !image) return;

    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / image.width;
    
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

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
    const newArea = { ...currentArea, [field]: value };

    if (type === 'svg') {
      onPrintAreaChange(newArea);
    } else if (onMockupPrintAreaChange) {
      onMockupPrintAreaChange(newArea);
    }
  };

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
