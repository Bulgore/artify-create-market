
import React, { useState, useRef, useEffect } from 'react';
import { getProductDisplayData } from '@/utils/mockupGenerator';
import { calculateAutoPosition, getImageDimensions } from '@/utils/designPositioning';
import type { PublicCreatorProduct } from '@/services/publicProductsService';

interface ProductPreviewImageProps {
  product: PublicCreatorProduct;
  className?: string;
}

export const ProductPreviewImage: React.FC<ProductPreviewImageProps> = ({
  product,
  className = "w-full h-full object-cover"
}) => {
  const [mockupLoaded, setMockupLoaded] = useState(false);
  const [designPosition, setDesignPosition] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { mockupUrl, designUrl, printArea } = getProductDisplayData(product);

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

  if (!mockupUrl) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <span className="text-gray-500 text-sm">Pas d'image</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Mockup de base */}
      <img
        src={mockupUrl}
        alt={product.name}
        className={className}
        onLoad={() => {
          setMockupLoaded(true);
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
            left: `${(designPosition.x / 400) * 100}%`,
            top: `${(designPosition.y / 400) * 100}%`,
            width: `${(designPosition.width / 400) * 100}%`,
            height: `${(designPosition.height / 400) * 100}%`,
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
