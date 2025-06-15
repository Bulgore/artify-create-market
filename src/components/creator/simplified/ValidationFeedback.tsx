
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
  // Debug logging to identify validation issues
  console.log('🔍 ValidationFeedback Debug:', {
    canSubmit,
    hasSelectedProduct: !!selectedProduct,
    selectedProductId: selectedProduct?.id,
    selectedProductName: selectedProduct?.name,
    hasDesignUrl: !!designUrl,
    designUrlLength: designUrl?.length,
    hasProductName: !!productName,
    productNameTrimmed: productName?.trim(),
    hasDesignArea: !!designArea,
    hasAutoPosition: !!autoDesignPosition
  });

  if (!canSubmit) {
    const missingItems = [];
    
    if (!selectedProduct) {
      missingItems.push("❌ Sélectionnez un produit");
    } else {
      console.log('✅ Produit sélectionné:', selectedProduct.name);
    }
    
    if (!designUrl || designUrl.trim() === '') {
      missingItems.push("❌ Uploadez votre design");
    } else {
      console.log('✅ Design présent:', designUrl.substring(0, 50));
    }
    
    if (!productName || productName.trim() === '') {
      missingItems.push("❌ Renseignez le nom du produit");
    } else {
      console.log('✅ Nom du produit:', productName);
    }

    return (
      <div className="text-sm text-amber-600 bg-amber-50 p-4 rounded border border-amber-200">
        <div className="font-medium mb-2">⚠️ Informations requises pour créer le produit :</div>
        <div className="space-y-1">
          {missingItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">{item}</div>
          ))}
        </div>
        <div className="mt-3 text-xs text-amber-700 bg-amber-100 p-2 rounded">
          <strong>Note:</strong> Seuls ces 3 champs sont obligatoires. Le positionnement se fait automatiquement.
        </div>
        {/* Debug info for developers */}
        <div className="mt-2 text-xs text-gray-500 border-t pt-2">
          <div>Debug: Produit ID = {selectedProduct?.id || 'NULL'}</div>
          <div>Debug: Design = {designUrl ? 'PRÉSENT' : 'MANQUANT'}</div>
          <div>Debug: Nom = {productName ? 'PRÉSENT' : 'MANQUANT'}</div>
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
