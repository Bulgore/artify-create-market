
export interface DesignArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DesignPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export const parseDesignArea = (rawArea: any): DesignArea => {
  try {
    let parsed;
    
    if (typeof rawArea === 'string') {
      parsed = JSON.parse(rawArea);
    } else if (typeof rawArea === 'object' && rawArea !== null) {
      parsed = rawArea;
    } else {
      throw new Error('Invalid design area format');
    }
    
    const { x, y, width, height } = parsed;
    
    if (
      typeof x !== 'number' || 
      typeof y !== 'number' || 
      typeof width !== 'number' || 
      typeof height !== 'number' ||
      isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)
    ) {
      throw new Error('Invalid design area values');
    }
    
    return { x, y, width, height };
  } catch (error) {
    console.error('❌ Error parsing design area:', error, rawArea);
    return { x: 50, y: 50, width: 200, height: 200 };
  }
};
