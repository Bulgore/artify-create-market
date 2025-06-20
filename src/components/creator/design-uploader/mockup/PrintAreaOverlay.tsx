
import React from 'react';
import type { PrintArea } from '@/types/printArea';

interface PrintAreaOverlayProps {
  designArea: PrintArea;
  containerWidth: number;
  containerHeight: number;
}

export const PrintAreaOverlay: React.FC<PrintAreaOverlayProps> = ({
  designArea,
  containerWidth = 400,
  containerHeight = 300
}) => {
  // Calcul des pourcentages pour affichage dans le conteneur mockup
  // en utilisant les coordonnées EXACTES de la zone d'impression
  const style = {
    left: `${(designArea.x / containerWidth) * 100}%`,
    top: `${(designArea.y / containerHeight) * 100}%`,
    width: `${(designArea.width / containerWidth) * 100}%`,
    height: `${(designArea.height / containerHeight) * 100}%`
  };

  return (
    <div
      className="absolute border-2 border-red-500 border-dashed bg-red-500 bg-opacity-20 pointer-events-none z-10"
      style={style}
      title={`Zone d'impression EXACTE définie par l'admin - Design automatiquement centré et agrandi au maximum (${Math.round(designArea.width)}×${Math.round(designArea.height)}px)`}
    >
      <div className="absolute -top-7 left-0 text-xs text-red-700 bg-red-100 px-2 py-1 rounded shadow border border-red-200 font-medium z-20">
        Zone d'impression EXACTE ({Math.round(designArea.width)}×{Math.round(designArea.height)}px)
      </div>
      <div className="absolute top-1 left-1 text-xs text-red-600 bg-white bg-opacity-90 px-1 rounded">
        AUTO
      </div>
    </div>
  );
};
