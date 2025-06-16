
import { UsePrintAreaProps } from '@/types/printArea';
import { useImageLoader } from './useImageLoader';
import { useCanvasDrawing } from './useCanvasDrawing';
import { useCanvasInteraction } from './useCanvasInteraction';

export const usePrintArea = ({
  svgUrl,
  mockupUrl,
  printArea,
  onPrintAreaChange,
  mockupPrintArea,
  onMockupPrintAreaChange
}: UsePrintAreaProps) => {
  const {
    svgImageRef,
    mockupImageRef,
    svgImageLoaded,
    mockupImageLoaded
  } = useImageLoader({ svgUrl, mockupUrl });

  const {
    svgCanvasRef,
    mockupCanvasRef,
    forceRedraw
  } = useCanvasDrawing({
    svgImageRef,
    mockupImageRef,
    svgImageLoaded,
    mockupImageLoaded,
    printArea,
    mockupPrintArea
  });

  const {
    currentSvgArea,
    currentMockupArea,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleInputChange
  } = useCanvasInteraction({
    svgCanvasRef,
    mockupCanvasRef,
    svgImageRef,
    mockupImageRef,
    printArea,
    mockupPrintArea,
    onPrintAreaChange,
    onMockupPrintAreaChange
  });

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
    mockupImageLoaded,
    forceRedraw
  };
};
