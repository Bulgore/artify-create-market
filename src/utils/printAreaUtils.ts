
import { PrintArea, ViewType } from '@/types/printArea';

export const getCanvasCoordinates = (
  e: React.MouseEvent<HTMLCanvasElement>, 
  canvas: HTMLCanvasElement | null,
  image: HTMLImageElement | null
) => {
  if (!canvas || !image) return { x: 0, y: 0 };

  const rect = canvas.getBoundingClientRect();
  const scale = canvas.width / image.width;
  
  const x = (e.clientX - rect.left) / scale;
  const y = (e.clientY - rect.top) / scale;
  
  return { x, y };
};

export const isPointInResizeHandle = (
  x: number, 
  y: number, 
  area: PrintArea, 
  handleSize: number
): boolean => {
  return x >= area.x + area.width - handleSize &&
         x <= area.x + area.width + handleSize &&
         y >= area.y + area.height - handleSize &&
         y <= area.y + area.height + handleSize;
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
  return {
    ...area,
    x: Math.max(0, Math.min(imageWidth - area.width, area.x)),
    y: Math.max(0, Math.min(imageHeight - area.height, area.y)),
    width: Math.min(area.width, imageWidth - area.x),
    height: Math.min(area.height, imageHeight - area.y)
  };
};
