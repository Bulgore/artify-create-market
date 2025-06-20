
import React from 'react';
import type { PrintProduct } from '@/types/customProduct';

interface ValidationFeedbackProps {
  canSubmit: boolean;
  selectedProduct: PrintProduct | null;
  designUrl: string;
  productName: string;
  autoDesignPosition: any;
}

export const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({
  canSubmit,
  selectedProduct,
  designUrl,
  productName,
  autoDesignPosition
}) => {
  // Debug logging DÉTAILLÉ pour identifier les problèmes de validation
  console.log('🔍 ValidationFeedback Debug COMPLET:', {
    canSubmit,
    hasSelectedProduct: !!selectedProduct,
    selectedProductId: selectedProduct?.id,
    selectedProductName: selectedProduct?.name,
    hasDesignUrl: !!designUrl,
    designUrlLength: designUrl?.length,
    hasProductName: !!productName,
    productNameTrimmed: productName?.trim(),
    hasAutoPosition: !!autoDesignPosition,
    autoPositionScale: autoDesignPosition?.scale
  });

  if (!canSubmit) {
    const missingItems = [];
    
    if (!selectedProduct) {
      missingItems.push("❌ Sélectionnez un produit");
      console.log('❌ Validation échouée: Pas de produit sélectionné');
    } else {
      console.log('✅ Produit sélectionné:', selectedProduct.name, 'ID:', selectedProduct.id);
    }
    
    if (!designUrl || designUrl.trim() === '') {
      missingItems.push("❌ Uploadez votre design");
      console.log('❌ Validation échouée: Pas de design uploadé');
    } else {
      console.log('✅ Design présent:', designUrl.substring(0, 50));
    }
    
    if (!productName || productName.trim() === '') {
      missingItems.push("❌ Renseignez le nom du produit");
      console.log('❌ Validation échouée: Pas de nom de produit');
    } else {
      console.log('✅ Nom du produit:', productName);
    }

    return (
      <div className="text-sm text-red-600 bg-red-50 p-4 rounded border border-red-300">
        <div className="font-medium mb-2">🚫 ERREURS DE VALIDATION - Informations manquantes :</div>
        <div className="space-y-2">
          {missingItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2 font-medium">{item}</div>
          ))}
        </div>
        <div className="mt-4 text-xs text-red-700 bg-red-100 p-3 rounded border">
          <strong>Instructions:</strong> Seuls ces 3 champs sont obligatoires. Le positionnement se fait automatiquement une fois tous les champs remplis.
        </div>
        {/* Debug info DÉTAILLÉ pour développeurs */}
        <div className="mt-3 text-xs text-gray-600 bg-white p-3 rounded border">
          <div className="font-bold text-red-600 mb-1">🐛 DEBUG VALIDATION:</div>
          <div>Produit ID = {selectedProduct?.id || 'NULL'}</div>
          <div>Produit nom = {selectedProduct?.name || 'NULL'}</div>
          <div>Design = {designUrl ? `PRÉSENT (${designUrl.length} chars)` : 'MANQUANT'}</div>
          <div>Nom = {productName ? `PRÉSENT ("${productName}")` : 'MANQUANT'}</div>
          <div>Auto-position = {autoDesignPosition ? `PRÉSENT (échelle: ${Math.round(autoDesignPosition.scale * 100)}%)` : 'MANQUANT'}</div>
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
      
      {autoDesignPosition && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-medium text-blue-700 mb-1">🎯 Positionnement automatique appliqué</div>
          <div className="text-xs text-blue-600 space-y-1">
            <div>🔍 Design agrandi à {Math.round(autoDesignPosition.scale * 100)}%</div>
            <div>📍 Position centrée: ({Math.round(autoDesignPosition.x)}, {Math.round(autoDesignPosition.y)})</div>
            <div>📏 Taille finale: {Math.round(autoDesignPosition.width)}×{Math.round(autoDesignPosition.height)}px</div>
          </div>
        </div>
      )}
    </div>
  );
};
