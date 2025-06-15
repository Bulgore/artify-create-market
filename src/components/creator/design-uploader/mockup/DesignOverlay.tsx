
import React from 'react';
import type { AutoPositionResult } from '@/utils/designPositioning';

interface DesignOverlayProps {
  designUrl: string;
  autoPosition: AutoPositionResult;
  containerWidth: number;
  containerHeight: number;
  onLoad: () => void;
  onError: () => void;
}

export const DesignOverlay: React.FC<DesignOverlayProps> = ({
  designUrl,
  autoPosition,
  containerWidth = 400,
  containerHeight = 300,
  onLoad,
  onError
}) => {
  const style = {
    left: `${(autoPosition.x / containerWidth) * 100}%`,
    top: `${(autoPosition.y / containerHeight) * 100}%`,
    width: `${(autoPosition.width / containerWidth) * 100}%`,
    height: `${(autoPosition.height / containerHeight) * 100}%`
  };

  return (
    <div className="absolute" style={style}>
      <img
        src={designUrl}
        alt="Design"
        className="w-full h-full object-contain rounded shadow-sm"
        onLoad={onLoad}
        onError={onError}
      />
    </div>
  );
};
