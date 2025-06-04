
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EditPrintProductModal from "./EditPrintProductModal";

interface PrintProduct {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  material: string;
  stock_quantity: number;
  images: string[];
  available_sizes: string[];
  available_colors: string[];
  is_active: boolean;
  template_id: string | null;
}

interface ProductsListProps {
  isLoading: boolean;
  printProducts: PrintProduct[];
  onRefreshProducts: () => void;
  onAddProduct?: () => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ 
  isLoading, 
  printProducts, 
  onRefreshProducts,
  onAddProduct 
}) => {
  const [editingProduct, setEditingProduct] = useState<PrintProduct | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const handleEditProduct = (product: PrintProduct) => {
    console.log("Edit product:", product.id);
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le produit "${productName}" ? Cette action est irréversible.`)) {
      return;
    }

    setDeletingProductId(productId);

    try {
      const { error } = await supabase
        .from('print_products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Produit supprimé",
        description: `Le produit "${productName}" a été supprimé avec succès.`
      });

      onRefreshProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le produit."
      });
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleAddProductClick = () => {
    if (onAddProduct) {
      onAddProduct();
    } else {
      // Fallback: trigger the tab change programmatically
      const addProductTab = document.querySelector('[data-value="addProduct"]') as HTMLElement;
      if (addProductTab) {
        addProductTab.click();
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <p className="text-center py-8">Chargement des produits...</p>
      ) : printProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {printProducts.map(product => (
            <Card key={product.id}>
              <div className="h-48 overflow-hidden">
                <img 
                  src={product.images[0] || "/placeholder.svg"} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <div className="flex gap-2">
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? "Actif" : "Inactif"}
                    </Badge>
                    {product.template_id ? (
                      <Badge variant="outline" className="text-green-600">
                        Gabarit OK
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        Pas de gabarit
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{product.material}</p>
                <p className="text-sm text-gray-600 mb-2">Stock: {product.stock_quantity}</p>
                <div className="mb-2">
                  <p className="text-xs text-gray-500">Tailles: {product.available_sizes.join(', ')}</p>
                  <p className="text-xs text-gray-500">Couleurs: {product.available_colors.join(', ')}</p>
                </div>
                <p className="font-medium mb-4">{product.base_price}€</p>
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditProduct(product)}
                  >
                    Modifier
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    disabled={deletingProductId === product.id}
                    onClick={() => handleDeleteProduct(product.id, product.name)}
                  >
                    {deletingProductId === product.id ? "Suppression..." : "Supprimer"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>Vous n'avez pas encore créé de produits d'impression.</p>
          <Button 
            className="mt-4 bg-[#33C3F0] hover:bg-[#0FA0CE]"
            onClick={handleAddProductClick}
          >
            Créer mon premier produit
          </Button>
        </div>
      )}

      <EditPrintProductModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        product={editingProduct}
        onProductUpdated={onRefreshProducts}
      />
    </>
  );
};

export default ProductsList;
