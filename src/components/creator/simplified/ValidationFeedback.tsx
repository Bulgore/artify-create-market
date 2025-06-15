
import React from 'react';
import type { PrintProduct } from '@/types/customProduct';
import type { DesignArea } from '@/types/designArea';

interface ValidationFeedbackProps {
  canSubmit: boolean;
  selectedProduct: PrintProduct | null;
  designUrl: string;
  productName: string;
  designArea?: DesignArea;
  autoDesignPosition: any;
}

export const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({
  canSubmit,
  selectedProduct,
  designUrl,
  productName,
  designArea,
  autoDesignPosition
}) => {
  if (!canSubmit) {
    return (
      <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded">
        <div className="font-medium mb-1">Informations manquantes pour validation :</div>
        {!selectedProduct && <div>• Sélectionnez un produit</div>}
        {selectedProduct && !designUrl && <div>• Uploadez un design</div>}
        {selectedProduct && designUrl && !productName.trim() && <div>• Renseignez le nom du produit</div>}
        {selectedProduct && designUrl && productName.trim() && !autoDesignPosition && <div>• Position automatique en cours de calcul...</div>}
      </div>
    );
  }

  return (
    <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
      <div className="font-medium mb-1">✅ Prêt à créer ! Positionnement automatique PROFESSIONNEL appliqué</div>
      {designArea && autoDesignPosition && (
        <div className="mt-2 space-y-1 text-xs">
          <div>📏 Zone d'impression: {designArea.width}×{designArea.height}px</div>
          <div>🎯 Design agrandi au maximum: {Math.round(autoDesignPosition.scale * 100)}% de la taille originale</div>
          <div>📍 Position centrée automatiquement: ({Math.round(autoDesignPosition.x)}, {Math.round(autoDesignPosition.y)})</div>
          <div className="text-purple-600 font-medium">🚫 Aucune manipulation manuelle - Standard professionnel respecté</div>
        </div>
      )}
    </div>
  );
};
