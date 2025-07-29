import React, { useEffect, useRef } from 'react';
import { getProductDisplayData } from '@/utils/mockupGenerator';
import type { PublicCreatorProduct } from '@/services/publicProductsService';

interface ProductPreviewImageProps {
  product: PublicCreatorProduct;
  className?: string;
}

export const ProductPreviewImage: React.FC<ProductPreviewImageProps> = ({
  product,
  className = 'w-full h-full'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { mockupUrl, designUrl, printArea } = getProductDisplayData(product);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mockupUrl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mockup = new Image();
    const design = new Image();
    [mockup, design].forEach(img => (img.crossOrigin = 'anonymous'));

    let cancelled = false;

    const drawImages = () => {
      if (cancelled || !mockup.complete || (designUrl && !design.complete)) return;

      canvas.width = mockup.naturalWidth;
      canvas.height = mockup.naturalHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(mockup, 0, 0);

      if (designUrl && printArea) {
        ctx.drawImage(design, printArea.x, printArea.y, printArea.width, printArea.height);
      }
    };

    mockup.onload = drawImages;
    if (designUrl) {
      design.onload = drawImages;
    }
    mockup.src = mockupUrl;
    if (designUrl) {
      design.src = designUrl;
    }

    return () => {
      cancelled = true;
    };
  }, [mockupUrl, designUrl, printArea]);

  if (!mockupUrl) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <span className="text-gray-500 text-sm">Pas d'image</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas ref={canvasRef} className="w-full h-auto" />
    </div>
  );
};
