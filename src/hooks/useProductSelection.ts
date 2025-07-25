
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { PrintProduct } from '@/types/customProduct';

export const useProductSelection = (printProducts: PrintProduct[]) => {
  const [selectedProduct, setSelectedProduct] = useState<PrintProduct | null>(null);

  const handleProductSelect = (productId: string) => {
    console.log("Selecting product:", productId);
    
    const product = printProducts.find(p => p.id === productId);
    
    if (!product) {
      console.error("Product not found:", productId);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Produit non trouvé."
      });
      return;
    }

    if (!product.product_templates) {
      console.error("Product has no template:", product);
      toast({
        variant: "destructive",
        title: "Gabarit non trouvé",
        description: "Ce produit n'est pas encore configuré pour la personnalisation."
      });
      return;
    }
    if (!product.product_templates.primary_mockup_id) {
      console.error("Template has no primary mockup:", product.product_templates);
      toast({
        variant: "destructive",
        title: "Mockup principal manquant",
        description: "Le gabarit de ce produit n'a pas de mockup principal défini."
      });
      return;
    }

    console.log("Product selected successfully:", product.name);
    setSelectedProduct(product);

    toast({
      title: "Produit sélectionné",
      description: `${product.name} est prêt pour la personnalisation.`
    });
  };

  return {
    selectedProduct,
    handleProductSelect,
    setSelectedProduct
  };
};
