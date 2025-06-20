
export interface PrintArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const parsePrintArea = (rawArea: any): PrintArea => {
  try {
    const parsed =
      typeof rawArea === 'string'
        ? JSON.parse(rawArea)
        : typeof rawArea === 'object' && rawArea !== null
        ? rawArea
        : null;

    if (
      !parsed ||
      typeof parsed.x !== 'number' ||
      typeof parsed.y !== 'number' ||
      typeof parsed.width !== 'number' ||
      typeof parsed.height !== 'number'
    ) {
      throw new Error('Invalid print area values');
    }

    return { x: parsed.x, y: parsed.y, width: parsed.width, height: parsed.height };
  } catch (error) {
    console.error('Failed to parse print area:', error);
    return { x: 50, y: 50, width: 200, height: 200 };
  }
};

export interface UsePrintAreaProps {
  svgUrl: string;
  mockupUrl?: string;
  printArea: PrintArea;
  onPrintAreaChange: (area: PrintArea) => void;
  mockupPrintArea?: PrintArea;
  onMockupPrintAreaChange?: (area: PrintArea) => void;
}

export type ViewType = 'svg' | 'mockup';
