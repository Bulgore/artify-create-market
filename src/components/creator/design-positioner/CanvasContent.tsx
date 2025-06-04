
import React from 'react';

interface CanvasContentProps {
  templateUrl: string;
  templateLoaded: boolean;
  templateError: boolean;
}

export const CanvasContent: React.FC<CanvasContentProps> = ({
  templateUrl,
  templateLoaded,
  templateError
}) => {
  // Template background (SVG du produit) avec meilleure visibilité
  if (templateUrl && templateLoaded && !templateError) {
    return (
      <image
        href={templateUrl}
        x="0"
        y="0"
        width="400"
        height="400"
        opacity="0.7"
        preserveAspectRatio="xMidYMid meet"
      />
    );
  }

  // Fallback si pas de template - Affichage du tote bag par défaut
  return (
    <>
      <rect
        x="0"
        y="0"
        width="400"
        height="400"
        fill="#f8f9fa"
        stroke="#e9ecef"
        strokeWidth="2"
        rx="8"
      />
      {/* Simulation du contour d'un tote bag */}
      <path
        d="M100 80 L100 120 L80 140 L80 360 L320 360 L320 140 L300 120 L300 80 M120 80 L120 60 L280 60 L280 80"
        fill="none"
        stroke="#d1d5db"
        strokeWidth="3"
        strokeDasharray="5,5"
      />
      <text
        x="200"
        y="220"
        textAnchor="middle"
        fill="#6c757d"
        fontSize="14"
        fontWeight="medium"
      >
        🛍️ Tote bag (template manquant)
      </text>
    </>
  );
};
