
export interface AutoPositionResult {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
}

export const getImageDimensions = (imageUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = imageUrl;
  });
};

export const calculateAutoPosition = (
  designDimensions: { width: number; height: number },
  printArea: { x: number; y: number; width: number; height: number }
): AutoPositionResult => {
  const { width: designWidth, height: designHeight } = designDimensions;
  const { x: areaX, y: areaY, width: areaWidth, height: areaHeight } = printArea;

  // Calculer le ratio d'échelle pour que le design rentre dans la zone d'impression
  const scaleX = areaWidth / designWidth;
  const scaleY = areaHeight / designHeight;
  const scale = Math.min(scaleX, scaleY, 1); // Ne pas agrandir au-delà de 100%

  // Calculer les nouvelles dimensions du design
  const scaledWidth = designWidth * scale;
  const scaledHeight = designHeight * scale;

  // Centrer le design dans la zone d'impression
  const x = areaX + (areaWidth - scaledWidth) / 2;
  const y = areaY + (areaHeight - scaledHeight) / 2;

  return {
    x,
    y,
    width: scaledWidth,
    height: scaledHeight,
    scale
  };
};
