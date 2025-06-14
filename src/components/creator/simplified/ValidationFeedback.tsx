
import React from 'react';
import type { PrintProduct, DesignArea } from '@/types/customProduct';

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
        <div className="font-medium mb-1">Informations manquantes :</div>
        {!selectedProduct && <div>• Sélectionnez un produit</div>}
        {selectedProduct && !designUrl && <div>• Uploadez un design</div>}
        {selectedProduct && designUrl && !productName.trim() && <div>• Renseignez le nom du produit</div>}
      </div>
    );
  }

  return (
    <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
      ✅ Prêt à créer ! Design automatiquement positionné dans la zone d'impression.
      {designArea && autoDesignPosition && (
        <div className="mt-1 text-xs">
          Zone: {designArea.width}×{designArea.height}px • Position: {Math.round(autoDesignPosition.scale * 100)}% de la taille originale
        </div>
      )}
    </div>
  );
};
