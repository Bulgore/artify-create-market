
import React from 'react';
import type { DesignArea } from '@/types/designArea';

interface PrintAreaOverlayProps {
  designArea: DesignArea;
  containerWidth: number;
  containerHeight: number;
}

export const PrintAreaOverlay: React.FC<PrintAreaOverlayProps> = ({
  designArea,
  containerWidth = 400,
  containerHeight = 300
}) => {
  const style = {
    left: `${(designArea.x / containerWidth) * 100}%`,
    top: `${(designArea.y / containerHeight) * 100}%`,
    width: `${(designArea.width / containerWidth) * 100}%`,
    height: `${(designArea.height / containerHeight) * 100}%`
  };

  return (
    <div
      className="absolute border-2 border-red-500 border-dashed bg-red-500 bg-opacity-10"
      style={style}
      title="Zone d'impression définie par l'administrateur"
    >
      <div className="absolute -top-6 left-0 text-xs text-red-600 bg-white px-2 py-1 rounded shadow">
        Zone d'impression
      </div>
    </div>
  );
};
