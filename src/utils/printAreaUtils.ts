
import { PrintArea, ViewType } from '@/types/printArea';

export const getCanvasCoordinates = (
  e: React.MouseEvent<HTMLCanvasElement>, 
  canvas: HTMLCanvasElement | null,
  image: HTMLImageElement | null
) => {
  if (!canvas || !image) return { x: 0, y: 0 };

  const rect = canvas.getBoundingClientRect();
  
  // Get the actual displayed size vs natural size ratio
  const scaleX = image.naturalWidth / rect.width;
  const scaleY = image.naturalHeight / rect.height;
  
  // Calculate coordinates in image's natural coordinate system
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;
  
  console.log('Coordinate calculation:', {
    clientCoords: { x: e.clientX - rect.left, y: e.clientY - rect.top },
    imageCoords: { x, y },
    scale: { scaleX, scaleY },
    rectSize: { width: rect.width, height: rect.height },
    naturalSize: { width: image.naturalWidth, height: image.naturalHeight }
  });
  
  return { x, y };
};

export const isPointInResizeHandle = (
  x: number, 
  y: number, 
  area: PrintArea, 
  handleSize: number
): boolean => {
  // Check if point is in bottom-right resize handle
  const handleX = area.x + area.width;
  const handleY = area.y + area.height;
  
  return x >= handleX - handleSize && x <= handleX + handleSize &&
         y >= handleY - handleSize && y <= handleY + handleSize;
};

export const isPointInArea = (
  x: number, 
  y: number, 
  area: PrintArea
): boolean => {
  return x >= area.x && x <= area.x + area.width &&
         y >= area.y && y <= area.y + area.height;
};

export const constrainAreaToBounds = (
  area: PrintArea, 
  imageWidth: number, 
  imageHeight: number
): PrintArea => {
  // Ensure minimum dimensions
  const minWidth = 50;
  const minHeight = 50;
  
  let { x, y, width, height } = area;
  
  // Constrain width and height
  width = Math.max(minWidth, Math.min(width, imageWidth));
  height = Math.max(minHeight, Math.min(height, imageHeight));
  
  // Constrain position
  x = Math.max(0, Math.min(x, imageWidth - width));
  y = Math.max(0, Math.min(y, imageHeight - height));
  
  return { x, y, width, height };
};
