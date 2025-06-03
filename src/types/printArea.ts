
export interface PrintArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UsePrintAreaProps {
  svgUrl: string;
  mockupUrl?: string;
  printArea: PrintArea;
  onPrintAreaChange: (area: PrintArea) => void;
  mockupPrintArea?: PrintArea;
  onMockupPrintAreaChange?: (area: PrintArea) => void;
}

export type ViewType = 'svg' | 'mockup';
