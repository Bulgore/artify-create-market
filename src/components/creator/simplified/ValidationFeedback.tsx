
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
      <div className="text-sm text-amber-600 bg-amber-50 p-4 rounded border border-amber-200">
        <div className="font-medium mb-2">⚠️ Informations requises pour créer le produit :</div>
        <div className="space-y-1">
          {!selectedProduct && <div className="flex items-center gap-2">❌ Sélectionnez un produit</div>}
          {selectedProduct && !designUrl && <div className="flex items-center gap-2">❌ Uploadez votre design</div>}
          {selectedProduct && designUrl && !productName.trim() && <div className="flex items-center gap-2">❌ Renseignez le nom du produit</div>}
        </div>
        <div className="mt-3 text-xs text-amber-700 bg-amber-100 p-2 rounded">
          <strong>Note:</strong> Seuls ces 3 champs sont obligatoires. Le positionnement se fait automatiquement.
        </div>
      </div>
    );
  }

  return (
    <div className="text-sm text-green-600 bg-green-50 p-4 rounded border border-green-200">
      <div className="font-medium mb-2">✅ Produit prêt à créer !</div>
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-2">✓ Produit sélectionné: {selectedProduct?.name}</div>
        <div className="flex items-center gap-2">✓ Design uploadé et traité</div>
        <div className="flex items-center gap-2">✓ Nom du produit: "{productName}"</div>
      </div>
      
      {designArea && autoDesignPosition && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-medium text-blue-700 mb-1">🎯 Positionnement automatique appliqué</div>
          <div className="text-xs text-blue-600 space-y-1">
            <div>📐 Zone d'impression: {designArea.width}×{designArea.height}px</div>
            <div>🔍 Design agrandi à {Math.round(autoDesignPosition.scale * 100)}% (maximum possible)</div>
            <div>📍 Position centrée: ({Math.round(autoDesignPosition.x)}, {Math.round(autoDesignPosition.y)})</div>
            <div className="font-medium text-purple-600">🚫 Aucune modification manuelle nécessaire</div>
          </div>
        </div>
      )}
    </div>
  );
};
