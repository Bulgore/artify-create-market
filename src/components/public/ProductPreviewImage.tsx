
import React, { useState, useRef, useEffect } from 'react';
import { getProductDisplayData } from '@/utils/mockupGenerator';
import { calculateAutoPosition, getImageDimensions } from '@/utils/designPositioning';
import type { PublicCreatorProduct } from '@/services/publicProductsService';
import type { DesignPosition } from '@/types/design';

interface ProductPreviewImageProps {
  product: PublicCreatorProduct;
  className?: string;
}

export const ProductPreviewImage: React.FC<ProductPreviewImageProps> = ({
  product,
  className = "w-full h-full object-cover"
}) => {
  const [mockupLoaded, setMockupLoaded] = useState(false);
  const [designPosition, setDesignPosition] = useState<DesignPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  const { mockupUrl, designUrl, printArea } = getProductDisplayData(product);

  const scaleX = naturalSize.width ? containerSize.width / naturalSize.width : 1;
  const scaleY = naturalSize.height ? containerSize.height / naturalSize.height : 1;

  // Calculer la position du design quand tout est chargé
  useEffect(() => {
    const calculateDesignPosition = async () => {
      if (!designUrl || !printArea || !mockupLoaded) return;

      try {
        const designDimensions = await getImageDimensions(designUrl);
        const autoPosition = calculateAutoPosition(designDimensions, printArea);
        
        setDesignPosition(autoPosition);
        console.log('✅ [ProductPreviewImage] Position calculée:', autoPosition);
      } catch (error) {
        console.error('❌ [ProductPreviewImage] Erreur calcul position:', error);
      }
    };

    calculateDesignPosition();
  }, [designUrl, printArea, mockupLoaded]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  if (!mockupUrl) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <span className="text-gray-500 text-sm">Pas d'image</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {/* Mockup de base */}
      <img
        src={mockupUrl}
        alt={product.name}
        className="w-full h-full object-cover"
        onLoad={(e) => {
          const img = e.currentTarget;
          setMockupLoaded(true);
          setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
          if (containerRef.current) {
            setContainerSize({
              width: containerRef.current.clientWidth,
              height: containerRef.current.clientHeight
            });
          }
          console.log('✅ [ProductPreviewImage] Mockup chargé:', product.name);
        }}
        onError={() => {
          console.error('❌ [ProductPreviewImage] Erreur mockup:', mockupUrl);
        }}
      />
      
      {/* Design superposé */}
      {designUrl && designPosition && mockupLoaded && (
        <div
          className="absolute pointer-events-none transition-transform duration-300"
          style={{
            left: `${designPosition.x * scaleX}px`,
            top: `${designPosition.y * scaleY}px`,
            width: `${designPosition.width * scaleX}px`,
            height: `${designPosition.height * scaleY}px`,
            zIndex: 10,
            transform: 'inherit'
          }}
        >
          <img
            src={designUrl}
            alt="Design"
            className="w-full h-full object-contain transition-transform duration-300"
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '2px',
              transform: 'inherit'
            }}
            onLoad={() => {
              console.log('✅ [ProductPreviewImage] Design appliqué:', product.name);
            }}
            onError={() => {
              console.error('❌ [ProductPreviewImage] Erreur design:', designUrl);
            }}
          />
        </div>
      )}
    </div>
  );
};
